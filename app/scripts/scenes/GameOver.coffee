Crafty.defineScene 'GameOver', (data) ->
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
    .css('textAlign', 'center')
    .textFont({
      size: '50px',
      weight: 'bold',
      family: 'Courier new'
    })

  Crafty('Player ControlScheme').each (index) ->
    Crafty.e('2D, DOM, Text')
      .attr(x: 0, y: 200 + (index * 50), w: 640)
      .text(@name + ': ' + @points)
      .textColor(@color())
      .css("textAlign", "center")
      .textFont({
        size: '30px',
        weight: 'bold',
        family: 'Courier new'
      })
    text = if @credits is 1
      "1 Credit left"
    else
      "#{@credits} Credits left"

    Crafty.e('2D, DOM, Text')
      .attr(x: 0, y: 230 + (index * 50), w: 640)
      .text(text)
      .textColor(@color())
      .css("textAlign", "center")
      .textFont({
        size: '15px',
        weight: 'bold',
        family: 'Courier new'
      })

  # After a timeout, be able to replay
  Crafty.e('Delay').delay ->
    # TODO: Check if continues left
    creditsLeft = []
    Crafty('Player ControlScheme').each -> creditsLeft.push this if @credits > 0

    if creditsLeft.length > 0
      time = 10
      e = Crafty.e('2D, DOM, Text')
        .attr(x: 0, y: 350, w: 640)
        .textColor('#FF0000')
        .css("textAlign", "center")
        .textFont(
          size: '20px',
          weight: 'bold',
          family: 'Courier new'
        )
      prefix = "Press fire to continue"
      if creditsLeft.length is 1
        prefix = "#{creditsLeft[0].name} press fire to continue"
      e.text("#{prefix} #{"00#{time}".slice(-2)}")
      @delay ->
        time -= 1
        e.text("#{prefix} #{"00#{time}".slice(-2)}")
      , 1000, time, ->
        Crafty.enterScene('Intro')

      Crafty('Player').each ->
        @reset()
        @one 'Activated', ->
          # TODO: Add a continue to the stats
          Crafty.enterScene Game.firstLevel, { checkpoint: data.checkpoint }
    else
      @delay ->
        Crafty.enterScene('Intro')
      , 10000

  , 2000, 0
, ->
  # destructor
  Crafty('Delay').each -> @destroy()
  Crafty('Player').each -> @unbind('Activated')
