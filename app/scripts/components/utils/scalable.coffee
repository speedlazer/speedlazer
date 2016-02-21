Crafty.c 'Scalable',
  _scale: 1.0

  _Scalable_property_definitions:
    scale:
      set: (v) -> @_updateScale(v)
      get: -> @_scale
      configurable: true
      enumerable: true
    _scale: { enumerable: false }

  init: ->
    @_defineScalableProperties()
    @_scale = 1.0

  remove: ->

  _defineScalableProperties: ->
    for prop, def of @_Scalable_property_definitions
      Object.defineProperty(this, prop, def)

  _updateScale: (newScale) ->
    oldScale = @_scale
    @_scale = newScale

    @w = (@w / oldScale) * newScale
    @h = (@h / oldScale) * newScale


