Crafty.c 'Cheats',
  init: ->
    @addCheat('Freddie',
      [
        'Up'
        'Up'
        'Down'
        'Down'
        'Left'
        'Right'
        'Left'
        'Right'
        'Fire'
      ]
      => Crafty.e('Freddy').freddy(protect: @ship)
    )
    @_listenInput()

  remove: ->
    inputs = ['Up', 'Down', 'Left', 'Right', 'Fire']
    @unbind(input) for input in inputs

  addCheat: (name, sequence, method) ->
    @cheats ?= []
    @cheats.push {
      name
      sequence
      method
      index: 0
    }

  _listenInput: ->
    inputs = ['Up', 'Down', 'Left', 'Right', 'Fire']

    for input in inputs
      do (input) =>
        @bind(input, =>
          for c in @cheats
            if c.sequence[c.index] is input
              c.index += 1
              c.method() if c.index is c.sequence.length
            else
              c.index = 0
        )

Crafty.c 'Freddy',
  init: ->
    @requires '2D, WebGL, freddie, Scalable, ColorEffects, Collision'

  remove: ->
    @unbind 'GameLoop', @_move

  freddy: (options) ->
    @ship = options.protect
    @ship.scoreText 'Help me Freddie!'
    @colorOverride?(@ship.playerColor, 'partial')
    @attr
      scale: .5
      z: @ship.z + 5
    midX = (@w // 2)
    midY = (@h // 2)
    fy = 15
    fx = 15
    @collision [-fx, -fy, midX, -(2*fy), @w + fx, -fy,
      @w + (2*fx), midY, @w + fx, @h + fy,
      midX, @h + (2*fy), -fx, @h + fy, -(2*fx), midY]
    @ship.addComponent('Invincible').invincibleDuration(-1)

    @attr(
      x: -Crafty.viewport.x - 100
      y: -Crafty.viewport.y + (Crafty.viewport.height * .5)
    )
    @circlePos = 180
    @eaten = 0
    @hFlash = 0
    @shooting = 0
    @ship.bind 'Remove', => @destroy()

    @bind 'GameLoop', @_move

    @onHit 'Enemy',
      (collision) =>
        return if Game.paused

        # Only count collisions once
        ids = (e.obj[0] for e in collision)
        @previousCols ?= []
        newCols = (i for i in ids when i not in @previousCols)
        @previousCols = ids

        for e in collision when e.obj[0] in newCols
          enemy = e.obj
          continue if enemy.hidden
          continue if enemy.invincible
          @attr hitFlash: { _red: 255, _green: 255, _blue: 0 }
          @hFlash = 5
          if enemy.absorbDamage?
            enemy.absorbDamage(500)
          if enemy.has('Projectile')
            enemy.destroy()
          @eaten += 1
          @scale = Math.min(.5 + ((.5 / 50) * @eaten), 1.0)
      =>
        @previousCols = []

  _move: (fd) ->
    circleSpeed = 8000
    speed = @ship._targetSpeed.x + 300
    rx = 80
    ry = 55

    circleSpeed -= Math.min((Crafty('Enemy').length * 800), circleSpeed - 1000)

    rot = (360 / circleSpeed) * fd.dt
    @circlePos = (@circlePos + rot + 360) % 360

    rad = @circlePos * 0.0174532925

    targetX =
      @ship.x + 10 +
      (@ship.w // 2) - (@w // 2) +
      (rx * Math.cos(rad))

    targetY =
      @ship.y +
      (@ship.h // 2) - (@h // 2) +
      (ry * Math.sin(rad))

    dist = speed * (fd.dt / 1000)

    if @hFlash > 0
      @hFlash -= 1
      @attr hitFlash: no if @hFlash is 0

    if @eaten > 50 and Crafty('Enemy').length > 0
      @shooting += 1
      if @shooting % 5 is 0
        for angle in [0...360] by 30
          Crafty.e('Bullet').attr(
            w: 8
            h: 8
            x: @x + (@w // 2)
            y: @y + (@h // 2)
            z: 1
            rotation: angle
          ).fire(
            origin: this
            speed: @ship._currentSpeed.x + 400
            damage: 400
            direction: angle
          )

      if @shooting > 200
        @eaten = 0
        @scale = .5
        @shooting = 0

    if @x > targetX
      @x -= Math.min(dist, @x - targetX)
    else
      @x += Math.min(dist, targetX - @x)

    if @y > targetY
      @y -= Math.min(dist, @y - targetY)
    else
      @y += Math.min(dist, targetY - @y)

