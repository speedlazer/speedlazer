Crafty.defineScene 'City', (data) ->

  # import from globals
  Game = window.Game

  # constructor
  Crafty.background('#602020')

  level = Game.levelGenerator.createLevel
    stage: data.stage
    title: 'City'
    namespace: 'City'
    startScenery: 'Intro'

  level.start
    armedPlayers: no
    speed: 0
    viewport:
      x: 0
      y: 120

  (new Game.Scripts.Stage1).run(level).then =>
    console.log 'end of script!'

    # Temporary code to make the player "enjoy" the gameplay
    # demo level

    Crafty('ScrollWall').each -> @off()
    endLevelTrigger = Crafty.e('2D, Canvas, Color, Collision')
      .attr({ w: 10, h: level.visibleHeight })
      .onHit 'PlayerControlledShip', ->
        Crafty.trigger('EndOfLevel')
        @destroy()
    level.addComponent(endLevelTrigger, x: 640, y: 0)

  duration = 600 * 1000
  Crafty.e('ColorFade').colorFade(duration: duration, background: yes,
    '#602020', '#8080FF')

  Crafty.e('Sun, ColorFade')
    .sun(
      x: 620
      y: 340
    )
    .tween({ dy: -250, dx: 115 }, duration)
    .colorFade(duration: duration, '#DD4000', '#DDDD00', '#DDDD80')

  Crafty.bind 'EndOfLevel', ->
    level.stop()
    Crafty.enterScene('GameplayDemo', { stage: data.stage + 1 })

, ->
  # destructor
  Crafty('Delay').each -> @destroy()
  Crafty.unbind('PlayerDied')
  Crafty.unbind('EndOfLevel')
  Crafty('Player').each -> @removeComponent('ShipSpawnable')
