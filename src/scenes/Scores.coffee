Crafty.defineScene 'Scores', ->
  # import from globals
  Game.resetCredits()
  # constructor
  Crafty.background('#000000')
  Crafty.viewport.x = 0
  Crafty.viewport.y = 0

  w = Crafty.viewport.width
  h = Crafty.viewport.height

  Crafty.e('2D, DOM, Text')
    .attr(x: 0, y: h * .1, w: w)
    .text('Highscores')
    .textColor('#FFFF00')
    .textAlign 'center'
    .textFont({
      size: '40px'
      weight: 'bold'
      family: 'Press Start 2P'
    })

  scores = Game.highscores()
  i = 0
  Crafty.e('Delay').delay ->
      entry = scores[i]
      if entry
        nr = switch i
          when 0 then 'ACE'
          when 1 then '2nd'
          when 2 then '3rd'
          else "#{i + 1}th"

        size = switch i
          when 0 then '20px'
          when 1, 2 then '18px'
          else '15px'

        Crafty.e('2D, DOM, Text')
          .attr(x: 0, y: (h * .25) + (36 * i), w: w)
          .text("#{nr}  #{entry.score} #{entry.initials}")
          .textColor('#FFFF00')
          .textAlign 'center'
          .textFont({
            size: size
            weight: 'bold'
            family: 'Press Start 2P'
          })

        i += 1

    , 500, 9


  Crafty('Player').each ->
    @reset()
    @one 'Activated', ->
      Crafty.enterScene('Game')


  Crafty.e('Delay').delay ->
      Crafty.enterScene('Intro')
    , 20000

, ->
  # destructor
  Crafty('Delay').each -> @destroy()
  Crafty('Player').each -> @unbind('Activated')

