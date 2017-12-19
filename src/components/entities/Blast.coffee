Crafty.c 'Blast',
  init: ->
    @requires '2D, WebGL, explosionStart, SpriteAnimation, Horizon, Collision'

  remove: ->
    @unbind 'GameLoop'

  explode: (attr, frameOptions) ->
    radius = attr.radius ? 20
    duration = (attr.duration ? 160) / 1000

    @attr attr
    @attr w: attr.radius * 4, h: attr.radius * 4
    @attr x: @x - (@w / 2), y: @y - (@h / 2)

    @collision [
      @w * .2, @h * .2,
      @w * .8, @h * .2,
      @w * .8, @h * .8,
      @w * .2, @h * .8
    ]

    @reel 'explode', duration * 3000, [
      [0, 0]
      [1, 0]
      [2, 0]
      [3, 0]
      [4, 0]

      [0, 1]
      [1, 1]
      [2, 1]
      [3, 1]
      [4, 1]

      [0, 2]
      [1, 2]
      [2, 2]
      [3, 2]
      [4, 2]

      [0, 3]
      [1, 3]
    ]
    if frameOptions
      @bind 'GameLoop', =>
        a = frameOptions.call(this)
        @attr a

    @bind 'AnimationEnd', =>
      @destroy()
    @animate 'explode'
    this


