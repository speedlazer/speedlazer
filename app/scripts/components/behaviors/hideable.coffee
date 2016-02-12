Crafty.c 'Hideable',
  init: ->
    @requires 'ColorEffects'
    @hidden = no

  sendToBackground: (scale, z) ->
    currentScale = @scale ? 1.0
    @attr
      scale: scale
      w: (@w / currentScale) * scale
      h: (@h / currentScale) * scale
      z: z
    @hidden = yes

  hide: (@hideMarker, options) ->
    @hidden = yes

    if options.below
      @hideAt = options.below
      for c in @_children
        c.attr?(hideAt: options.below)
    else
      @attr alpha: .0
      for c in @_children
        c.attr?(alpha: .0)

  reveal: ->
    @hideMarker?.destroy()
    @hidden = no
    currentScale = @scale ? 1.0
    scale = 1.0
    @attr
      scale: scale
      w: (@w / currentScale) * scale
      h: (@h / currentScale) * scale
      alpha: 1.0,
      z: 0
      hideAt: null

    for c in @_children
      c.attr?(alpha: 1.0, hideAt: null)

  remove: ->
    @hideMarker?.destroy()

Crafty.c 'WaterSplashes',
  init: ->
    @bind 'GameLoop', @_waterSplashes
    @cooldown = 0

  remove: ->
    @unbind 'GameLoop', @_waterSplashes

  setSealevel: (@sealevel) ->

  _waterSplashes: (fd) ->
    @cooldown -= fd.dt
    if (@y + @h > @sealevel) and (@y < @sealevel) and (@cooldown <= 0)
      @cooldown = 70
      upwards = 1
      if @_lastWaterY isnt @y
        upwards = (@speed - 20) / 30

      coverage = 45
      parts = (@w / coverage)
      r = 0
      for i in [0...parts]
        for d in [0...Math.min(upwards, 3)]
          r += 1
          pos = Math.random()
          sealevel = @sealevel
          Crafty.e('Blast')
            .colorOverride('#FFFFFF')
            .explode(
              upwards: if r % 2 is 0 then upwards else 0
              x: @x + (i * coverage) + (pos * coverage)
              y: @sealevel - 10
              z: @z + 3
              duration: 210 + (Math.random() * 100)
              radius: 5
              topDesaturation: @topDesaturation
              bottomDesaturation: @bottomDesaturation
              alpha: .6
              gravity: 0.2
              ->
                gravity: @gravity + 0.3
                alpha: Math.max(0.1, (@alpha - Math.random() * .03))
                y: Math.min(@y - (Math.random() * @upwards) + @gravity, sealevel - 10)
                x: @x + ((-.5 + pos) * Math.random() * 4.0)
                w: @w + .3
                h: @h + .3
            )
    @_lastWaterY = @y
