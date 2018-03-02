Crafty.c 'Hideable',
  init: ->
    @requires 'ColorEffects'
    @hidden = no

  sendToBackground: (scale, z) ->
    @_originalZ = @z
    @attr
      scale: scale
      z: z
    for c in @_children
      if c.attr?
        zOff = c.z - @_originalZ
        c.attr z: z + zOff

    @trigger('Hiding', this) unless @hidden
    @hidden = yes
    this

  hide: (@hideMarker, options) ->
    @hidden = yes

    if options.below and @has('Sprite') and @rotation == 0
      @hideAt = options.below
      for c in @_children
        c.attr?(hideAt: options.below)
    else
      @attr alpha: .0
      for c in @_children
        c.attr?(alpha: .0)
    @trigger 'Hiding', this
    this

  hideBelow: (yValue) ->
    @hideAt = yValue
    for c in @_children
      c.attr?(hideAt: yValue)

  reveal: ->
    @hideMarker?.destroy()
    @hidden = no
    currentScale = @scale ? 1.0
    scale = 1.0

    for c in @_children
      if c.attr?
        zOff = c.z - @z
        c.attr z: @_originalZ + zOff
    @attr
      scale: scale
      alpha: 1.0,
      z: @_originalZ
      hideAt: null

    for c in @_children
      c.attr?(alpha: 1.0, hideAt: null)
    @trigger 'Revealing', this
    this

  remove: ->
    if @hideMarker
      if @hideMarker.hasPool
        @hideMarker.recycle()
      else
        @hideMarker.destroy()

