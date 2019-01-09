Crafty.c 'ColorFade',
  colorFade: (options, bottomColors, topColors) ->
    { @duration, skip } = options
    @_bottomColors = bottomColors.map(@_strToColor)
    @_topColors = topColors.map(@_strToColor)

    @v = 0
    @v += Math.max(skip, 0) ? 0
    @bind 'GameLoop', @_recolor

  remove: ->
    @unbind 'GameLoop', @_recolor

  _recolor: (fd) ->
    @v += fd.dt
    pos = @v / @duration
    pos = 0 if pos < 0
    if pos >= 1
      @unbind 'GameLoop', @_recolor
      @trigger 'ColorFadeFinished'
      pos = 1

    bcolor = @_buildColor(pos, @_bottomColors)
    tcolor = @_buildColor(pos, @_topColors)

    stringColor = @_colorToStr(bcolor)
    Crafty.trigger('BackgroundColor', stringColor)
    #Crafty.background stringColor

    @bottomColor bcolor
    @topColor tcolor

  _buildColor: (v, colors) ->
    parts = (1 / (colors.length - 1))
    index = v // parts
    from = colors[index]
    to = colors[index + 1] ? from

    localV = (v - (index * parts)) / parts
    @_mix(localV, from, to)

  _mix: (v, from, to) ->
    [
      Math.round(from[0] * (1 - v) + to[0] * v)
      Math.round(from[1] * (1 - v) + to[1] * v)
      Math.round(from[2] * (1 - v) + to[2] * v)
    ]


  _colorToStr: (color) ->
    '#' + color.map((value) -> ('0' + value.toString(16)).slice(-2)).join('')

  _strToColor: (string) ->
    [
      parseInt(string[1..2], 16),
      parseInt(string[3..4], 16),
      parseInt(string[5..6], 16)
    ]


