Crafty.defineScene 'Game', (data) ->
  # constructor
  #
  # import from globals
  Game = window.Game

  script = Game.Scripts.Stage1
  #script = Game.Scripts.BossFight
  level = Game.levelGenerator.createLevel script::metadata
  level.start()

  new script(level).run().then =>
    console.log 'end of script!'

  # TODO: This should be set in script, because other levels / scripts have different positions/sunlight
  Crafty.background('#602020')

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

, ->
  # destructor
  Crafty('Delay').each -> @destroy()
  Crafty.unbind('PlayerDied')
  Crafty('Player').each -> @removeComponent('ShipSpawnable')
