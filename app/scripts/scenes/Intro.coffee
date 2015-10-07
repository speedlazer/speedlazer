Crafty.defineScene 'Intro', ->
  # import from globals
  Game = window.Game

  # constructor
  Crafty.background('#000000')
  Crafty.viewport.x = 0
  Crafty.viewport.y = 0

  Crafty.e('2D, Canvas, Text, Tween, Delay')
    .attr(x: 150, y: 210, w: 450)
    .text('Speedlazer')
    .textColor('#0000ff')
    .textFont(
      size: '40px'
      weight: 'bold'
      family: 'Courier new'
    ).delay ->
      @tween({ x: 250 }, 2000)
      @one('TweenEnd', ->
        @tween({ x: 150 }, 2000)
      )
    , 2000, -1

  Crafty.e('2D, Canvas, Text, Tween, Delay')
    .attr(x: 200, y: 290, w: 750)
    .text('Press fire to start!')
    .textColor('#FF0000')
    .textFont(
      size: '20px'
      weight: 'bold'
      family: 'Courier new'
    ).delay ->
      @tween({ alpha: 0 }, 1000)
      @one 'TweenEnd', ->
        @tween({ alpha: 1 }, 1000)
    , 2000, -1

  Crafty('Player').each ->
    @reset()
    @one 'Activated', ->
      Crafty.enterScene(Game.firstLevel, { stage: 1 })

, ->
  # destructor
  Crafty('Player').each -> @unbind('Activated')
