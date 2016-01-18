GRADIENT_VERTEX_SHADER = """
  attribute vec2 aPosition;
  attribute vec3 aOrientation;
  attribute vec2 aLayer;
  attribute vec4 aColor;

  varying lowp vec4 vColor;
  varying lowp vec2 vLayer;
  uniform  vec4 uViewport;

  mat4 viewportScale = mat4(2.0 / uViewport.z, 0, 0, 0,    0, -2.0 / uViewport.w, 0,0,    0, 0,1,0,    -1,+1,0,1);
  vec4 viewportTranslation = vec4(uViewport.xy, 0, 0);

  void main() {
    vec2 pos = aPosition;
    vec2 entityOrigin = aOrientation.xy;
    mat2 entityRotationMatrix = mat2(cos(aOrientation.z), sin(aOrientation.z), -sin(aOrientation.z), cos(aOrientation.z));

    pos = entityRotationMatrix * (pos - entityOrigin) + entityOrigin;
    gl_Position = viewportScale * (viewportTranslation + vec4(pos, 1.0/(1.0+exp(aLayer.x) ), 1) );

    vColor = aColor;
    vLayer = aLayer;
  }
"""

GRADIENT_FRAGMENT_SHADER = """
  precision mediump float;
  varying lowp vec4 vColor;
  varying lowp vec2 vLayer;
  void main(void) {
    gl_FragColor = vec4(vColor.rgb*vColor.a*vLayer.y, vColor.a*vLayer.y);
  }
"""

GRADIENT_ATTRIBUTE_LIST = [
    {name:"aPosition", width: 2}
    {name:"aOrientation", width: 3}
    {name:"aLayer", width:2}
    {name:"aColor", width: 4}
]

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
      @_establishShader "Gradient",
        GRADIENT_FRAGMENT_SHADER,
        GRADIENT_VERTEX_SHADER,
        GRADIENT_ATTRIBUTE_LIST
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

