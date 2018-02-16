GRADIENT_VERTEX_SHADER = require('./shaders/gradient.vert')
GRADIENT_FRAGMENT_SHADER = require('./shaders/gradient.frag')

GRADIENT_ATTRIBUTE_LIST = [
    {name:"aPosition", width: 2}
    {name:"aOrientation", width: 3}
    {name:"aLayer", width:2}
    {name:"aColor", width: 4}
]

Crafty.extend
  defaultGradientShader: (shader) ->
    if arguments.length is 0
      if @_defaultGradientShader is undefined
        @_defaultGradientShader = new Crafty.WebGLShader(
          GRADIENT_VERTEX_SHADER,
          GRADIENT_FRAGMENT_SHADER,
          GRADIENT_ATTRIBUTE_LIST,
          (e) ->
        )
      return @_defaultGradientShader
    @_defaultGradientShader = shader

Crafty.c 'Gradient',
  init: ->
    # Declaring the vars here instead as class attributes
    # make them unique for each instance
    @_topColor =
      _red: 0
      _green: 0
      _blue: 0
      _strength: 1.0
    @_bottomColor =
      _red: 0
      _green: 0
      _blue: 0
      _strength: 1.0
    @ready = yes

    @bind 'Draw', @_drawGradient
    if @has 'WebGL'
      @_establishShader "Gradient", Crafty.defaultGradientShader()
    @trigger 'Invalidate'

  remove: ->
    @unbind 'Draw', @_drawGradient
    if @has 'DOM'
      @_element.style.backgroundColor = 'transparent'
    @trigger 'Invalidate'

  _drawGradient: (e) ->
    if e.type is 'webgl'
      e.program.writeVector('aColor',
        @_topColor._red/255,
        @_topColor._green/255,
        @_topColor._blue/255,
        @_topColor._strength,

        @_bottomColor._red/255,
        @_bottomColor._green/255,
        @_bottomColor._blue/255,
        @_bottomColor._strength
      )

  topColor: (color) ->
    return @_topColor if arguments.length is 0
    @_setColor(@_topColor, arguments...)

  bottomColor: (color) ->
    return @_bottomColor if arguments.length is 0
    @_setColor(@_bottomColor, arguments...)

  _setColor: (varColor, color) ->
    if arguments.length >= 4
      varColor._red = arguments[1]
      varColor._green = arguments[2]
      varColor._blue = arguments[3]
      varColor._strength = arguments[4] if typeof arguments[4] is 'number'
    else
      # First argument is color name
      Crafty.assignColor(color, varColor)
      # Second argument, if present, is strength of color
      # Note that assignColor will give a default strength of 1.0 if none exists.
      varColor._strength = arguments[2] if typeof arguments[2] is 'number'

    @trigger 'Invalidate'
    this

