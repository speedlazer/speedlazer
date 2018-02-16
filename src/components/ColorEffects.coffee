isObject = require('lodash/isObject')

Crafty.c 'ColorEffects',

  colorDesaturation: (color) ->
    return this unless color?
    c = {}
    Crafty.assignColor(color, c)
    @attr desaturationColor: c

    @trigger("Invalidate")
    this

  # mode: 'all', 'partial'
  colorOverride: (color, mode = 'all') ->
    return this unless color?
    c = {}
    if isObject color
      c = color
    else
      Crafty.assignColor(color, c)
    @attr overrideColor: c, overrideColorMode: mode

    @trigger("Invalidate")
    this

  clearColorOverride: ->
    @attr overrideColor: null, overrideColorMode: 'all'
    @trigger("Invalidate")
    this

  saturationGradient: (start, end) ->
    @attr topDesaturation: start, bottomDesaturation: end
    this

