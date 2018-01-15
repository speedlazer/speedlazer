Test = require('src/lazerscripts/test').default

Crafty.defineScene 'Intro', ->
  # import from globals
  Game.resetCredits()

  # constructor
  Crafty.background('#000000')
  Crafty.viewport.x = 0
  Crafty.viewport.y = 0

  w = Crafty.viewport.width
  h = Crafty.viewport.height

  offset = .15

  Crafty.e('2D, DOM, Text, Tween, Delay')
    .attr(x: w * (.5 - offset), y: h * .4, w: 400)
    .text('Speedlazer')
    .textColor('#0000ff')
    .textFont(
      size: '40px'
      weight: 'bold'
      family: 'Press Start 2P'
    ).delay ->
      @tween({ x: (w * (.5 + offset)) - 400  }, 2000)
      @one('TweenEnd', ->
        @tween({ x: w * (.5 - offset) }, 2000)
      )
    , 4000, -1

  Crafty.e('2D, DOM, Text, Tween, Delay')
    .attr(x: (w * .5) - 150, y: h * .6, w: 300)
    .text('Press fire to start!')
    .textColor('#FF0000')
    .textFont(
      size: '15px'
      weight: 'bold'
      family: 'Press Start 2P'
    ).delay ->
      @tween({ alpha: 0.5 }, 1000)
      @one 'TweenEnd', ->
        @tween({ alpha: 1 }, 1000)
    , 2000, -1

  entry = Game.highscores()[0]

  Crafty.e('2D, DOM, Text')
    .attr(x: 0, y: (h * .85), w: w)
    .text("HI SCORE: #{entry.score} #{entry.initials}")
    .textColor('#FFFF00')
    .textAlign('center')
    .textFont({
      size: '10px'
      weight: 'bold'
      family: 'Press Start 2P'
    })

  Crafty('Player').each ->
    @reset()
    @one 'Activated', ->
      Crafty.enterScene('Game') # checkpoint: value
  Crafty.e('Delay').delay ->
      Crafty.enterScene('Scores')
    , 20000

, ->
  # destructor
  Crafty('Delay').each -> @destroy()
  Crafty('Player').each -> @unbind('Activated')
