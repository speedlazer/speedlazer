Crafty.c 'Hideable',
  init: ->
    @hidden = no

  sendToBackground: (scale, z) ->
    currentScale = @scale ? 1.0
    @attr
      scale: scale
      w: (@w / currentScale) * scale
      h: (@h / currentScale) * scale
      z: z
    @hidden = yes

  colorDesaturation: (color) ->
    c = {}
    Crafty.assignColor(color, c)
    @attr desaturationColor: c

  hide: (@hideMarker) ->
    @hidden = yes
    @attr alpha: 0.0

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

  remove: ->
    @hideMarker?.destroy()
