Crafty.defineScene 'GameOver', ->
  # constructor
  Crafty.background('#111')
  Crafty.viewport.x = 0
  Crafty.viewport.y = 0

  Crafty.e('2D, DOM, Text')
    .attr(x: 200, y: 210, w: 450)
    .text('Game Over')
    .textColor('#FF0000')
    .textFont({
      size: '80px',
      weight: 'bold',
      family: 'Courier new'
    })

  Crafty('Player ControlScheme').each (index) ->
    Crafty.e('2D, DOM, Text')
      .attr(x: 240, y: 310 + (index * 50), w: 700)
      .text(@name + ': ' + @points)
      .textColor(@color())
      .textFont({
        size: '50px',
        weight: 'bold',
        family: 'Courier new'
      })

  # After a timeout, be able to replay
  Crafty.e('Delay').delay ->
    Crafty.e('2D, DOM, Text')
      .attr(x: 200, y: 590, w: 750)
      .text('Press fire to start again')
      .textColor('#FF0000')
      .textFont(
        size: '30px',
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
        Crafty.enterScene 'Space', { stage: 1 }

    @delay ->
      Crafty.enterScene('Intro')
    , 60000, 0
  , 2000, 0
, ->
  # destructor
  Crafty('Delay').each -> @destroy()
  Crafty('Player').each -> @unbind('Activated')
