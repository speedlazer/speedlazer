
IMAGE_EFFECT_VERTEX_SHADER = """
 attribute vec2 aPosition;
 attribute vec3 aOrientation;
 attribute vec2 aLayer;
 attribute vec2 aTextureCoord;
 attribute vec4 aColor;

 varying mediump vec3 vTextureCoord;
 varying lowp vec4 vColor;
 varying lowp float vMix;

 uniform vec4 uViewport;
 uniform mediump vec2 uTextureDimensions;

 mat4 viewportScale = mat4(2.0 / uViewport.z, 0, 0, 0,    0, -2.0 / uViewport.w, 0,0,    0, 0,1,0,    -1,+1,0,1);
 vec4 viewportTranslation = vec4(uViewport.xy, 0, 0);

 void main() {
   vec2 pos = aPosition;
   vec2 entityOrigin = aOrientation.xy;
   mat2 entityRotationMatrix = mat2(cos(aOrientation.z), sin(aOrientation.z), -sin(aOrientation.z), cos(aOrientation.z));

   pos = entityRotationMatrix * (pos - entityOrigin) + entityOrigin ;
   gl_Position = viewportScale * (viewportTranslation + vec4(pos, 1.0/(1.0+exp(aLayer.x) ), 1) );
   vTextureCoord = vec3(aTextureCoord, aLayer.y);
   vColor = aColor;
 }
"""

IMAGE_EFFECT_FRAGMENT_SHADER = """
  precision mediump float;
  varying mediump vec3 vTextureCoord;
  varying mediump vec4 vColor;

  uniform sampler2D uSampler;
  uniform mediump vec2 uTextureDimensions;

  void main(void) {
    highp vec2 coord =   vTextureCoord.xy / uTextureDimensions;
    mediump vec4 texelColor = texture2D(uSampler, coord);

    mediump float mixFactor = vColor.a;
    mediump float lightness = (0.2126*texelColor.r + 0.7152*texelColor.g + 0.0722*texelColor.b);
    mediump float lightnessBase = (0.2126*vColor.r + 0.7152*vColor.g + 0.0722*vColor.b);
    mediump vec4 baseColor = vec4(vColor.rgb, texelColor.a) * (1.0 + (lightness - lightnessBase));
    mediump vec4 mixColor = vec4(
      (baseColor.rgba * mixFactor) + (texelColor.rgba * (1.0 - mixFactor))
    );

    gl_FragColor = vec4(
      mixColor.rgb * texelColor.a * vTextureCoord.z,
      texelColor.a * vTextureCoord.z
    );
  }
"""

IMAGE_EFFECT_ATTRIBUTE_LIST = [
  { name: "aPosition",     width: 2 }
  { name: "aOrientation",  width: 3 }
  { name: "aLayer",        width: 2 }
  { name: "aTextureCoord", width: 2 }
  { name: "aColor",        width: 4 }
]

Crafty.c 'ImageWithEffects',
  _repeat: 'repeat'
  ready: no

  init: ->
    @bind('Draw', @_drawImage)
    @_red = 0
    @_green = 0
    @_blue = 0
    @_strength = 0

  remove: ->
    @unbind('Draw', @_drawImage)

  colorDesaturation: (color) ->
    return this unless color?
    if arguments.length >=3
      @_red = arguments[0]
      @_green = arguments[1]
      @_blue = arguments[2]
      @_strength = arguments[3] if typeof arguments[3] is "number"
    else
      # First argument is color name
      Crafty.assignColor(color, this)
      # Second argument, if present, is strength of color
      # Note that assignColor will give a default strength of 1.0 if none exists.
      @_strength = arguments[1] if typeof arguments[1] is "number"

    @trigger("Invalidate")
    this

  image: (url, repeat) ->
    @__image = url
    @_repeat = repeat || 'no-repeat'
    @img = Crafty.asset(url)
    if !@img
      @img = new Image()
      Crafty.asset url, @img
      @img.src = url
      img.onload = => @_onImageLoad()
    else
      @_onImageLoad()
      @trigger 'Invalidate'
    this

  _onImageLoad: ->
    if @has 'WebGL'
      @_establishShader("imageFx:#{@__image}", IMAGE_EFFECT_FRAGMENT_SHADER, IMAGE_EFFECT_VERTEX_SHADER, IMAGE_EFFECT_ATTRIBUTE_LIST)
      @program.setTexture(@webgl.makeTexture(@__image, @img, (@_repeat isnt 'no-repeat')))

    if @_repeat is 'no-repeat'
      @w = @w || @img.width
      @h = @h || @img.height
    @ready = yes
    @trigger 'Invalidate'

  _drawImage: (e) ->
    if e.type is 'webgl'
      pos = e.pos

      # Write texture coordinates
      e.program.writeVector('aTextureCoord',
         0, 0,
         0, pos._h,
         pos._w, 0,
         pos._w, pos._h
      )
      e.program.writeVector("aColor",
        @_red/255,
        @_green/255,
        @_blue/255,
        @_strength
      )

