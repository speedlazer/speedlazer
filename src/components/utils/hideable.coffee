Crafty.c('Hideable', {
  _hidden: false,

  properties: {
    hidden: {
      set: (v) -> this._updateHidden(v)
      get: () -> this._hidden
      configurable: true,
      enumerable: true
    },
    _hidden: { enumerable: false },
  },

  init: ->
    @requires 'ColorEffects'

  sendToBackground: (scale, z) ->
    @_originalZ = @z
    @attr({ scale, z })
    for c in @_children
      if c.attr?
        zOff = c.z - @_originalZ
        c.attr z: z + zOff

    @hidden = yes
    this

  _updateHidden: (newHidden) ->
    return if (this._hidden is newHidden)
    this._hidden = newHidden
    if newHidden
      @trigger('Hiding', this)
    else
      @trigger 'Revealing', this

  hide: (@hideMarker, options) ->
    if options.below and @has('Sprite') and @rotation == 0
      @hideAt = options.below
      for c in @_children
        c.attr?(hideAt: options.below)
    else
      @attr alpha: .0
      for c in @_children
        c.attr?(alpha: .0)

    @hidden = yes
    this

  hideBelow: (yValue) ->
    @hideAt = yValue
    for c in @_children
      c.attr?(hideAt: yValue)

  reveal: ->
    @hideMarker?.destroy()
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

    @hidden = no
    this

  remove: ->
    if @hideMarker
      if @hideMarker.hasPool
        @hideMarker.recycle()
      else
        @hideMarker.destroy()
})

