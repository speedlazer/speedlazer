Game = require('src/scripts/game')

Game.say = (speaker, text, settings) ->
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
    when 'John' then n: 'pPilot', l: [0, 4]

  h = Math.max(4, h) if avatar

  back = Crafty.e('2D, UILayerWebGL, Color, Tween, Dialog')
    .attr(w: w, h: (h * 20), alpha: 0.7)
    .color('#000000')
    .attr(
      x: x - 10
      y: settings.bottom - (h * 20)
      z: 100
    )
  back.bind('Abort', -> defer.resolve())

  avatarOffset = if avatar then 100 else 0
  if avatar?
    portrait = Crafty.e('2D, UILayerWebGL, SpriteAnimation')
      .addComponent(avatar.n)
      .sprite(avatar.l..., 4, 4)
      .attr(
        x: back.x + 5
        y: back.y - 20
        z: back.z + 1
        w: 96
        h: 96
      )
      .reel('talk', 400, [
        avatar.l,
        [avatar.l[0] + 4, avatar.l[1]]
      ])
      .animate('talk', lines.length * 6)
    back.attach portrait

    # add noise to level
    if settings.noise isnt 'none' and avatar?
      portrait.addComponent('Delay')
      portrait.delay(
        ->
          portrait.attr(
            alpha: .6 + (Math.random() * .3)
          )
        150
        -1
      )

  offset = 15
  if speaker?
    speakerText = Crafty.e('2D, UILayerDOM, Text')
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
    back.attach(Crafty.e('2D, UILayerDOM, Text')
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

