
@Game.say = (speaker, text, settings) ->
    Crafty('Dialog').each ->
      @trigger('Abort')
      @destroy()

    lines = text.split('\n')

    x = 60
    defer = WhenJS.defer()
    w = Crafty.viewport.width * .8

    h = lines.length + 1
    if speaker?
      h += 1

    back = Crafty.e('2D, WebGL, Color, Tween, HUD, Dialog')
      .attr(w: w, h: (h * 20), alpha: 0.7)
      .color('#000000')
      .positionHud(
        x: x - 10
        y: settings.bottom - ((lines.length + 1) * 20)
        z: 100
      )
    back.bind('Abort', -> defer.resolve())

    offset = 15
    if speaker?
      speakerText = Crafty.e('2D, DOM, Text')
        .attr(w: w - 20, x: back.x + 10, y: back.y + 10, z: 101, alpha: 1)
        .text(speaker)
        .textColor('#707070')
        .textFont({
          size: '10px'
          weight: 'bold'
          family: 'Press Start 2P'
        })
      back.attach(speakerText)
      offset = 30

    for line, i in lines
      back.attach(Crafty.e('2D, DOM, Text')
        .attr(
          w: w - 20,
          x: back.x + 10,
          y: back.y + offset + (i * 20)
          z: 101
        )
        .text(line)
        .textColor('#909090')
        .textFont({
          size: '10px'
          weight: 'bold'
          family: 'Press Start 2P'
        })
      )

    Crafty.e('Dialog, Delay')
      .delay(
        ->
          defer.resolve()
          Crafty('Dialog').each -> @destroy()
        , 2500 * lines.length, 0)

    defer.promise

