
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

    avatar = switch speaker
      when 'General' then n: 'pGeneral', l: [0, 0]

    h = Math.max(4, h) if avatar

    back = Crafty.e('2D, WebGL, Color, Tween, HUD, Dialog')
      .attr(w: w, h: (h * 20), alpha: 0.7)
      .color('#000000')
      .positionHud(
        x: x - 10
        y: settings.bottom - (h * 20)
        z: 100
      )
    back.bind('Abort', -> defer.resolve())

    avatarOffset = if avatar then 64 else 0
    if avatar?
      portrait = Crafty.e('2D, WebGL, SpriteAnimation')
        .addComponent(avatar.n)
        .sprite(avatar.l..., 2, 2)
        .attr(
          x: back.x + 5
          y: back.y + 5
          z: back.z + 1
        )
        .reel('talk', 400, [
          avatar.l,
          [avatar.l[0] + 2, avatar.l[1]]
        ])
        .animate('talk', lines.length * 6)
      back.attach portrait

      # add noise to level
      if settings.noise isnt 'none'
        noise = Crafty.e('2D, WebGL, SpriteAnimation, noise')
          .attr(
            x: back.x + 5
            y: back.y + 5
            z: back.z + 2
            alpha: switch settings.noise
              when 'low' then .4
          )
          .reel('low', 250, [
            [4, 0]
            [4, 0]
            [6, 0]
          ])
          .animate(settings.noise, -1)
        back.attach(noise)

    offset = 15
    if speaker?
      speakerText = Crafty.e('2D, DOM, Text')
        .attr(
          w: w - 20
          x: back.x + 10 + avatarOffset
          y: back.y + 10
          z: 101
          alpha: 1
        )
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
          w: w - 20
          x: back.x + 10 + avatarOffset
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
        , 3000 * lines.length, 0)

    defer.promise

