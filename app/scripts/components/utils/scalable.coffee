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

    oldW = @w
    oldH = @h

    @w = @w / oldScale * newScale
    @h = @h / oldScale * newScale

    for c in @_children
      relX = c.x - @x
      relY = c.y - @y
      c.attr?(
        x: @x + (relX / oldScale * newScale)
        y: @y + (relY / oldScale * newScale)
        w: (c.w + oldW - @w) / oldScale * newScale
        h: (c.h + oldH - @h) / oldScale * newScale
      )

    # Scale collision shape
    if @map?.points?
      for p, i in @map.points
        origin = if i % 2 is 0 then @x else @y
        @map.points[i] = origin + (((p - origin) / oldScale) * newScale)

