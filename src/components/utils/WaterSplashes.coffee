Crafty.c 'WaterSplashes',
  init: ->
    @bind 'GameLoop', @_waterSplashes
    @cooldown = 0
    @defaultWaterCooldown ?= 70
    @waterRadius ?= 5
    @minSplashDuration ?= 210
    @detectionOffset = 0
    @minOffset = -10
    @waterAlpha ?= .6
    @splashUpwards = false

  remove: ->
    @unbind 'GameLoop', @_waterSplashes

  setDetectionOffset: (@detectionOffset, @minOffset = -10) ->
    this

  _waterSplashes: (fd) ->
    return if Game.explosionMode?
    @cooldown -= fd.dt
    sealevel = Crafty.s('SeaLevel').getSeaLevel(@scale)
    if (@y + @h + @detectionOffset > sealevel) and (@y < sealevel) and (@cooldown <= 0)
      speed = @waterSplashSpeed ? @defaultSpeed
      @cooldown = @defaultWaterCooldown
      upwards = 1
      if @_lastWaterY isnt @y and @splashUpwards
        upwards = (speed - 20) / 30

      upwards *= @scale ? 1

      coverage = 45
      parts = (@w / coverage)
      r = 0
      for i in [0...parts]
        for d in [0...Math.min(upwards, 3)]
          r += 1
          pos = Math.random()
          Crafty.e('Blast, ViewportRelativeMotion')
            .colorOverride('#FFFFFF')
            .viewportRelativeMotion(
              speed: 1
            )
            .explode(
              upwards: if r % 2 is 0 then upwards else 0
              x: @x + (i * coverage) + (pos * coverage)
              y: sealevel + @minOffset
              z: @z + 3
              duration: @minSplashDuration + (Math.random() * 100)
              radius: @waterRadius
              topDesaturation: @topDesaturation
              bottomDesaturation: @bottomDesaturation
              alpha: @waterAlpha
              gravity: 0.2
              (prev, fd) ->
                mul = fd.dt / (1000 / Crafty.timer.FPS())
                @attr(
                  gravity: @gravity + (0.3 * mul)
                  alpha: Math.max(0.1, (@alpha - Math.random() * (.03 * mul)))
                )
                return {
                  y: Math.min(prev.y - (Math.random() * @upwards * mul) + @gravity, sealevel - 10)
                  x: prev.x + ((-.5 + pos) * Math.random() * 4 * mul)
                  w: prev.w + (.3 * mul)
                  h: prev.h + (.3 * mul)
                }
            )
    @_lastWaterY = @y
