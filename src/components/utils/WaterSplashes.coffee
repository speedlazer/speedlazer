createEntityPool = require('src/lib/entityPool').default

Crafty.c('GameParticle', {
  events:
    'CameraPan': ({ dx, dy }) ->
      @shift(-dx, -dy)

  particle: (props) ->
    @duration = props.duration ? 100
    @running = 0

    @uniqueBind 'GameLoop', @_onGameLoop
    this

  _onGameLoop: (fd) ->
    @running += fd.dt
    if @running > @duration
      @unbind 'GameLoop', @_onGameLoop
      @trigger('ParticleEnded', this)

})

Crafty.c('Explode', {
  required: 'explosionStart, SpriteAnimation'
  init: ->
    @reel 'explodeReset', 20, [
      [0, 0]
    ]

  playExplode: (duration) ->
    reel = @getReel('explode')
    if (reel && reel.duration == duration)
      @animate 'explode'
      return this
    @animate 'explodeReset'
    @reel 'explode', duration, [
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
    @animate 'explode'
    this

})

splashPool = createEntityPool(
  ->
    Crafty.e('2D, WebGL, Explode, ColorEffects, GameParticle, Motion, Tween')
      .colorOverride('#FFFFFF')
  200
)

Crafty.c 'WaterSplashes',
  events:
    'GameLoop': '_waterSplashes'

  init: ->
    @cooldown = 0
    @defaultWaterCooldown ?= 70
    @waterRadius ?= 5
    @minSplashDuration ?= 210
    @detectionOffset = 0
    @minOffset = -10
    @waterAlpha ?= .6
    @splashUpwards = false

  setDetectionOffset: (@detectionOffset, @minOffset = -10) ->
    this

  _waterSplashes: (fd) ->
    return if Game.explosionMode?
    @cooldown -= fd.dt
    sealevel = Crafty.s('SeaLevel').getSeaLevel(@scale)
    flySpeed = Crafty('ScrollWall')._currentSpeed.x

    if (@y + @h + @detectionOffset > sealevel) and (@y < sealevel) and (@cooldown <= 0)
      speed = @waterSplashSpeed ? @defaultSpeed
      @cooldown = @defaultWaterCooldown
      upwards = 1
      if @_lastWaterY isnt @y and @splashUpwards
        upwards = (speed - 20) / 30

      upwards *= @scale ? 1

      coverage = 65
      parts = (@w / coverage)
      r = 0
      vy = Math.min(Math.abs((@vy || 0) / 3), 100)
      for i in [0...parts]
        for d in [0...Math.min(upwards, 3)]
          r += 1
          pos = Math.random()
          duration = (@minSplashDuration + (vy * 4) + (pos * 100)) * 3
          factor = 210 / @minSplashDuration
          splashPool.get()
            .attr(
              x: @x + (i * coverage) + (pos * coverage) - (@waterRadius * 2)
              y: sealevel + @minOffset - (@waterRadius * 2)
              z: @z + 3
              w: @waterRadius * 4
              h: @waterRadius * 4
              alpha: @waterAlpha * (0.5 + (pos * 0.5))
              topDesaturation: @topDesaturation
              bottomDesaturation: @bottomDesaturation
              vy: (-10 - vy - vy) * factor * pos
              ay: (30 + vy + vy) * (0.5 + (factor * 0.5)) * pos
              vx: -flySpeed
            )
            .one('ParticleEnded', (e) -> splashPool.recycle(e))
            .playExplode(duration)
            .tween({
              alpha: 0.2
              w: (@waterRadius * 4) + (@waterRadius * 2 * pos)
              h: (@waterRadius * 4) + (@waterRadius * 2 * pos)
            }, duration * 5 * pos)
            .particle(
              duration: duration
            )
    @_lastWaterY = @y
