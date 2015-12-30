Crafty.defineScene 'GameOver', (data) ->
  # import from globals
  Game = window.Game

  # constructor
  Crafty.background('#000')
  Crafty.viewport.x = 0
  Crafty.viewport.y = 0

  w = Crafty.viewport.width
  h = Crafty.viewport.height

  Crafty.e('2D, DOM, Text')
    .attr(x: 0, y: h * .2, w: w)
    .text('Game Over')
    .textColor('#FF0000')
    .css('textAlign', 'center')
    .textFont({
      size: '50px'
      weight: 'bold'
      family: 'Press Start 2P'
    })

  task = (data) ->
    ->
      highScorePos = null
      highScorePos = i for s, i in hs when s.player is data.player

      t = "#{data.name}: #{data.points}"
      if highScorePos < 10
        rank = switch highScorePos
          when 0 then 'ACE'
          when 1 then '2nd'
          when 2 then '3rd'
          else "#{highScorePos + 1}th"
        t += " - #{rank}"

      Crafty.e('2D, DOM, Text')
        .attr(x: 0, y: (h * .45) + (data.index * 45), w: w)
        .text(t)
        .textColor(data.color)
        .css("textAlign", "center")
        .textFont({
          size: '20px'
          weight: 'bold'
          family: 'Press Start 2P'
        })

      if highScorePos < 10
        p = Crafty.e('2D, DOM, Text')
          .attr(x: w * .25, y: (h * .45) + ((data.index + 1) * 45), w: w)
          .text("Enter name: ")
          .textColor(data.color)
          .css("textAlign", "left")
          .textFont({
            size: '20px'
            weight: 'bold'
            family: 'Press Start 2P'
          })
        k = Crafty.e('TextInput')
          .attr(x: w * .6, y: (h * .45) + ((data.index + 1) * 45), w: w)
          .textColor(data.color)
          .css("textAlign", "left")
          .textFont({
            size: '20px'
            weight: 'bold'
            family: 'Press Start 2P'
          })
        k.textInput(data.player, 3).then (name) ->

          loadList = ->
            dat = localStorage.getItem('SPDLZR')
            return [] unless dat
            ko = dat.slice(0,20)
            d = dat.slice(20)
            s = CryptoJS.AES.decrypt(d,ko)
            v = s.toString(CryptoJS.enc.Utf8)
            return [] unless v.length > 1
            JSON.parse(v)

          l = loadList()
          l.push({
            initials: name
            score: data.points
            time: (new Date).getTime()
          })
          d = JSON.stringify(l)
          ky = CryptoJS.AES.encrypt(d, 'secret').toString().slice(8,28)
          ed = CryptoJS.AES.encrypt(d, ky).toString()
          localStorage.setItem('SPDLZR', ky + ed)

          p.destroy()
          k.destroy()

  collect = []
  hs = _.clone Game.highscores()

  Crafty('Player ControlScheme').each (index) ->
    highscoreEntry = null
    hs.push { initials: null, player: this, score: @points }
    collect.push task({
      index
      @name
      @points
      player: this
      color: @color()
    })

  hs = _.sortBy(hs, 'score').reverse()

  WhenJS.sequence(collect).then =>

    # After a timeout, be able to replay
    Crafty.e('Delay').delay ->
      if Game.credits > 0
        time = 10

        text = if Game.credits is 1
          "1 Credit left"
        else
          "#{Game.credits} Credits left"

        Crafty.e('2D, DOM, Text')
          .attr(x: 0, y: h * .8, w: w)
          .textColor('#FF0000')
          .css("textAlign", "center")
          .textFont(
            size: '15px'
            weight: 'bold'
            family: 'Press Start 2P'
          )
          .text(text)
        e = Crafty.e('2D, DOM, Text')
          .attr(x: 0, y: (h * .8) + 30, w: w)
          .textColor('#FF0000')
          .css("textAlign", "center")
          .textFont(
            size: '15px'
            weight: 'bold'
            family: 'Press Start 2P'
          )
        prefix = "Press fire to continue"
        e.text("#{prefix} #{"00#{time}".slice(-2)}")
        @delay ->
          time -= 1
          e.text("#{prefix} #{"00#{time}".slice(-2)}")
        , 1000, time, ->
          Crafty.enterScene('Intro')

        Crafty('Player').each ->
          @reset()
          @one 'Activated', ->
            Game.credits -= 1
            Crafty.enterScene Game.firstLevel, data
      else
        @delay ->
          Crafty.enterScene('Intro')
        , 10000

    , 2000, 0
, ->
  # destructor
  Crafty('Delay').each -> @destroy()
  Crafty('Player').each -> @unbind('Activated')
