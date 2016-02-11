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

    for c in @_children
      c.attr?(alpha: 1.0)

  remove: ->
    @hideMarker?.destroy()
