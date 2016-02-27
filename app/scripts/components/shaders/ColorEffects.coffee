Crafty.c 'ColorEffects',

  colorDesaturation: (color) ->
    return this unless color?
    c = {}
    Crafty.assignColor(color, c)
    @attr desaturationColor: c

    @trigger("Invalidate")
    this

  colorOverride: (color, mode = 'all') ->
    return this unless color?
    c = {}
    Crafty.assignColor(color, c)
    @attr overrideColor: c, overrideColorMode: mode

    @trigger("Invalidate")
    this

  saturationGradient: (start, end) ->
    @attr topDesaturation: start, bottomDesaturation: end
    this

