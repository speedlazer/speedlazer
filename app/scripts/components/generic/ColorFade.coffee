Crafty.c 'ColorFade',
  init: ->
    @requires('Color')

  colorFade: (options, @colors...) ->
    { @duration, @background, skip } = options
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

    color = @_buildColor(pos, @colors)
    if @background
      Crafty.background color
    else
      @color color

  _buildColor: (v, colors) ->
    parts = (1 / (colors.length - 1))
    index = v // parts
    from = colors[index]
    to = colors[index + 1] ? from

    localV = (v - (index * parts)) / parts
    @_mix(localV, from, to)

  _mix: (v, from, to) ->
    f = @_strToColor from
    t = @_strToColor to

    c =
      r: Math.round(f.r * (1 - v) + t.r * v)
      g: Math.round(f.g * (1 - v) + t.g * v)
      b: Math.round(f.b * (1 - v) + t.b * v)
    "##{(('0' + i.toString(16)).slice(-2) for k, i of c).join ''}"

  _strToColor: (string) ->
    {
      r: parseInt(string[1..2], 16)
      g: parseInt(string[3..4], 16)
      b: parseInt(string[5..6], 16)
    }


