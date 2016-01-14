Game = @Game
Game.Scripts ||= {}

IMAGE_EFFECT_VERTEX_SHADER = """
 attribute vec2 aPosition;
 attribute vec3 aOrientation;
 attribute vec2 aLayer;
 attribute vec2 aTextureCoord;

 varying mediump vec3 vTextureCoord;

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
 }
"""

IMAGE_EFFECT_FRAGMENT_SHADER = """
  precision mediump float;
  varying mediump vec3 vTextureCoord;

  uniform sampler2D uSampler;
  uniform mediump vec2 uTextureDimensions;

  void main(void) {
    highp vec2 coord =   vTextureCoord.xy / uTextureDimensions;
    mediump vec4 texelColor = texture2D(uSampler, coord);
    mediump vec4 finalColor = vec4(texelColor.rgb*texelColor.a*vTextureCoord.z, texelColor.a*vTextureCoord.z);

    vec4 scaledColor = finalColor * vec4(0.3, 0.59, 0.11, 1.0);
    float luminance = scaledColor.r + scaledColor.g + scaledColor.b;
    //gl_FragColor = vec4( luminance, luminance, luminance, finalColor.a);
    gl_FragColor = finalColor;
  }
"""

IMAGE_EFFECT_ATTRIBUTE_LIST = [
  { name: "aPosition",     width: 2 }
  { name: "aOrientation",  width: 3 }
  { name: "aLayer",        width: 2 }
  { name: "aTextureCoord", width: 2 }
]

class Game.Scripts.Test extends Game.LazerScript
  metadata:
    namespace: 'City'
    armedPlayers: 'lasers'
    speed: 0
    title: 'WebGL-Shaders'

  assets: ->
    @loadAssets('test',
      images: ['horizon-city.png']
    )

  execute: ->
    Crafty.c 'ImageWithEffects',
      _repeat: 'repeat'
      ready: no

      init: ->
        @bind('Draw', @_drawImage)

      remove: ->
        @unbind('Draw', @_drawImage)

      colorShader: (color) ->
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


    Crafty.e('2D, WebGL, Image')
      .image('images/horizon-city.png')
      .attr(
        x: 40
        y: 50
        z: -600
      )
    try
      Crafty.e('2D, WebGL, ImageWithEffects')
        .image('images/horizon-city.png')
        .colorShader('#FFFFFF')
        .attr(
          x: 140
          y: 150
          z: -600
        )
    catch e
      console.error e

    => WhenJS()
