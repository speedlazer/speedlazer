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

  ##
  # TODO: Extract this
  # Setup the recoloring background to show a dawn in progress
  v = 0

  # origin
  co =
    r: 0x60
    g: 0x20
    b: 0x20

  # destination
  cd =
    r: 0x80
    g: 0x80
    b: 0xFF

  steps = 320
  delay = 1000
  Crafty.e('Delay').delay(
    =>
      v += 1
      p = v * 1.0 / steps
      c =
        r: co.r * (1 - p) + cd.r * p
        b: co.b * (1 - p) + cd.g * p
        g: co.g * (1 - p) + cd.b * p
      cs = (i.toString(16).slice(0, 2) for k, i of c)

      Crafty.background("##{cs.join('')}")
  , delay, steps - 1)

  duration = steps * delay * 2

  Crafty.e('Sun')
    .sun(
      x: 620
      y: 340
    )
    .tween({ dy: -250, dx: 115 }, duration)

  Crafty.bind 'EndOfLevel', ->
    level.stop()
    Crafty.enterScene('GameplayDemo', { stage: data.stage + 1 })

, ->
  # destructor
  Crafty('Delay').each -> @destroy()
  Crafty.unbind('PlayerDied')
  Crafty.unbind('EndOfLevel')
  Crafty('Player').each -> @removeComponent('ShipSpawnable')
