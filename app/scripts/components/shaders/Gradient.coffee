GRADIENT_VERTEX_SHADER = """
  attribute vec2 aPosition;
  attribute vec3 aOrientation;
  attribute vec2 aLayer;
  attribute vec4 aColor;

  varying lowp vec4 vColor;
  uniform  vec4 uViewport;

  mat4 viewportScale = mat4(2.0 / uViewport.z, 0, 0, 0,    0, -2.0 / uViewport.w, 0,0,    0, 0,1,0,    -1,+1,0,1);
  vec4 viewportTranslation = vec4(uViewport.xy, 0, 0);

  void main() {
    vec2 pos = aPosition;
    vec2 entityOrigin = aOrientation.xy;
    mat2 entityRotationMatrix = mat2(cos(aOrientation.z), sin(aOrientation.z), -sin(aOrientation.z), cos(aOrientation.z));

    pos = entityRotationMatrix * (pos - entityOrigin) + entityOrigin;
    gl_Position = viewportScale * (viewportTranslation + vec4(pos, 1.0/(1.0+exp(aLayer.x) ), 1) );
    vColor = vec4(aColor.rgb*aColor.a*aLayer.y, aColor.a*aLayer.y);
  }
"""

GRADIENT_FRAGMENT_SHADER = """
  precision mediump float;
  varying lowp vec4 vColor;
  void main(void) {
    gl_FragColor = vColor;
  }
"""

GRADIENT_ATTRIBUTE_LIST = [
    {name:"aPosition", width: 2},
    {name:"aOrientation", width: 3},
    {name:"aLayer", width:2},
    {name:"aColor",  width: 4}
]

Crafty.c 'Gradient',
  _red: 0
  _green: 0
  _blue: 0
  _strength: 1.0
  _color: ""
  ready: yes

  init: ->
    @bind 'Draw', @_drawColor
    if @has 'WebGL'
      @_establishShader 'Gradient',
        GRADIENT_FRAGMENT_SHADER,
        GRADIENT_VERTEX_SHADER,
        GRADIENT_ATTRIBUTE_LIST
    @trigger 'Invalidate'

  remove: ->
    @unbind 'Draw', @_drawColor
    if @has 'DOM'
      @_element.style.backgroundColor = 'transparent'
    @trigger 'Invalidate'

  # draw function for "Color"
  _drawColor: (e) ->
    return unless @_color
    if e.type is 'webgl'
      e.program.writeVector('aColor',
          @_red/255,
          @_green/255,
          @_blue/255,
          @_strength
      )

  ###@
   * #.color
   * @comp Color
   * @trigger Invalidate - when the color changes
   *
   * Will assign the color and opacity, either through a string shorthand, or through explicit rgb values.
   * @sign public this .color(String color[, Float strength])
   * @param color - Color of the rectangle
   * @param strength - the opacity of the rectangle
   *
   * @sign public this .color(r, g, b[, strength])
   * @param r - value for the red channel
   * @param g - value for the green channel
   * @param b - value for the blue channel
   * @param strength - the opacity of the rectangle
   *
   * @sign public String .color()
   * @return A string representing the current color as a CSS property.
   *
   * @example
   * ```
   * var c = Crafty.e("2D, DOM, Color");
   * c.color("#FF0000");
   * c.color("red");
   * c.color(255, 0, 0);
   * c.color("rgb(255, 0, 0")
   * ```
   * Three different ways of assign the color red.
   * ```
   * var c = Crafty.e("2D, DOM, Color");
   * c.color("#00FF00", 0.5);
   * c.color("rgba(0, 255, 0, 0.5)");
   * ```
   * Two ways of assigning a transparent green color.
  ###
  color: (color) ->
    return this._color if arguments.length is 0
    if arguments.length >= 3
      @_red = arguments[0]
      @_green = arguments[1]
      @_blue = arguments[2]
      @_strength = arguments[3] if typeof arguments[3] is 'number'
    else
      # First argument is color name
      Crafty.assignColor(color, this)
      # Second argument, if present, is strength of color
      # Note that assignColor will give a default strength of 1.0 if none exists.
      @_strength = arguments[1] if typeof arguments[1] is 'number'

    @_color = "rgba(#{@_red}, #{@_green}, #{@_blue}, #{@_strength})"
    @trigger 'Invalidate'
    this

