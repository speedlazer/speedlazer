
@Game.say = (speaker, text, settings) ->
    Crafty('Dialog').each ->
      @trigger('Abort')
      @destroy()

    lines = text.split('\n')

    x = 60
    defer = WhenJS.defer()

    back = Crafty.e('2D, Canvas, Color, Tween, HUD, Dialog')
      .attr(w: 570, h: ((lines.length + 2) * 20), alpha: 0.5)
      .color('#000000')
      .positionHud(
        x: x - 10
        y: settings.bottom - ((lines.length + 1) * 20)
        z: 100
      )
    back.bind('Abort', -> defer.resolve())

    speakerText = Crafty.e('2D, Canvas, Text')
      .attr(w: 550, x: back.x + 10, y: back.y + 10, z: 101, alpha: 1)
      .text(speaker)
      .textColor('#707070')
      .textFont({
        size: '16px',
        weight: 'bold',
        family: 'Bank Gothic'
      })
    back.attach(speakerText)

    for line, i in lines
      back.attach(Crafty.e('2D, Canvas, Text')
        .attr(
          w: 550,
          x: back.x + 10,
          y: back.y + 30 + (i * 20)
          z: 101
        )
        .text(line)
        .textColor('#909090')
        .textFont({
          size: '16px',
          weight: 'bold',
          family: 'Bank Gothic'
        })
      )

    Crafty.e('Dialog, Delay')
      .delay(
        ->
          defer.resolve()
          Crafty('Dialog').each -> @destroy()
        , 2500 * lines.length, 0)

    defer.promise

