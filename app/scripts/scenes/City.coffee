Crafty.defineScene 'City', (data) ->
  # import from globals
  Game = window.Game

  # constructor
  Crafty.background('#602020')

  script = Game.Scripts.Stage1
  #script = Game.Scripts.BossFight
  level = Game.levelGenerator.createLevel script::metadata
  level.start()

  new script(level).run().then =>
    console.log 'end of script!'
    # Temporary code to make the player "enjoy" the gameplay
    # demo level

    #Crafty('ScrollWall').each -> @off()
    #endLevelTrigger = Crafty.e('2D, Canvas, Color, Collision')
      #.attr({ w: 10, h: level.visibleHeight })
      #.onHit 'PlayerControlledShip', ->
        #Crafty.trigger('EndOfLevel')
        #@destroy()
    #level.addComponent(endLevelTrigger, x: 640, y: 0)

  # TODO: This should be set in script, because other levels / scripts have different positions/sunlight
  duration = 600 * 1000
  Crafty.e('ColorFade, 2D').colorFade(duration: (duration / 2.0), background: yes,
    '#602020', '#8080FF')

  Crafty.e('Sun, ColorFade')
    .sun(
      x: 620
      y: 340
    )
    .tween({ dy: -250, dx: 115 }, duration)
    .colorFade(duration: duration, '#DD8000', '#DDDD00', '#DDDD80')

  Crafty.bind 'EndOfLevel', ->
    level.stop()
    Crafty.enterScene('GameplayDemo', { stage: data.stage + 1 })

, ->
  # destructor
  Crafty('Delay').each -> @destroy()
  Crafty.unbind('PlayerDied')
  Crafty.unbind('EndOfLevel')
  Crafty('Player').each -> @removeComponent('ShipSpawnable')
