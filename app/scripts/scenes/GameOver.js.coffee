Crafty.defineScene 'GameOver', ->
  # import from globals
  Game = window.Game

  # constructor
  Crafty.background('#111')
  Crafty.viewport.x = 0
  Crafty.viewport.y = 0

  Crafty.e('2D, DOM, Text')
    .attr(x: 0, y: 110, w: 640)
    .text('Game Over')
    .textColor('#FF0000')
    .css("textAlign", "center")
    .textFont({
      size: '50px',
      weight: 'bold',
      family: 'Courier new'
    })

  Crafty('Player ControlScheme').each (index) ->
    Crafty.e('2D, DOM, Text')
      .attr(x: 0, y: 200 + (index * 30), w: 640)
      .text(@name + ': ' + @points)
      .textColor(@color())
      .css("textAlign", "center")
      .textFont({
        size: '30px',
        weight: 'bold',
        family: 'Courier new'
      })

  # After a timeout, be able to replay
  Crafty.e('Delay').delay ->
    Crafty.e('2D, DOM, Text')
      .attr(x: 0, y: 350, w: 640)
      .text('Press fire to start again')
      .textColor('#FF0000')
      .css("textAlign", "center")
      .textFont(
        size: '20px',
        weight: 'bold',
        family: 'Courier new'
      )
    Crafty('Player').each ->
      # TODO: Turn this into a more generic 'reset player'
      @removeComponent('ControlScheme')
        .attr({
          lives: 2,
          points: 0
        })
      @one 'Activated', ->
        Crafty.enterScene Game.firstLevel, { stage: 1 }

    @delay ->
      Crafty.enterScene('Intro')
    , 60000, 0
  , 2000, 0
, ->
  # destructor
  Crafty('Delay').each -> @destroy()
  Crafty('Player').each -> @unbind('Activated')
