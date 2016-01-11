Game = @Game
Game.Scripts ||= {}

DEFAULT_TEXTURE_VERTEX_SHADER = """
  attribute vec2 aPosition;
  attribute vec2 aTextureCoord;
  attribute vec4 aColor;

  varying mediump vec3 vTextureCoord;
  varying lowp vec4 vColor;
  uniform mediump vec2 uTextureDimensions;

  void main() {
    gl_Position = vec4(aPosition, 1, 1);
    vTextureCoord = vec3(aTextureCoord, 1);
    vColor = aColor;
  }
"""

COLOR_OVERRIDE_FRAGMENT_SHADER = """
  precision mediump float;
  varying mediump vec3 vTextureCoord;

  uniform sampler2D uSampler;
  uniform mediump vec2 uTextureDimensions;

  void main(void) {
    highp vec2 coord = vTextureCoord.xy / uTextureDimensions;
    mediump vec4 texelColor = texture2D(uSampler, coord);

    gl_FragColor = texelColor;
  }
"""

COLOR_OVERRIDE_SHADER_ATTRIBUTE_LIST = [
  { name: "aPosition", width: 2 },
  { name: "aTextureCoord", width: 2 },
  { name: "aColor", width: 4 }
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
    Crafty.c 'TextureFilter',
      init: ->
        @requires 'WebGL'
        @bind("Draw", @_drawFiltered)
        if @has('Image')
          @unbind("Draw", @_drawImage)

        @textureFilters = []

      remove: ->
        @unbind("Draw", @_drawFiltered)

      _drawFiltered: (e) ->
        for f in @textureFilters
          f.draw.call(this, e)
        @_drawImage(e)

    Crafty.c 'ColorShader',
      init: ->
        @requires 'TextureFilter'
        colorShaderProgram = this.webgl.getProgramWrapper(
          "ColorShader",
          COLOR_OVERRIDE_FRAGMENT_SHADER,
          DEFAULT_TEXTURE_VERTEX_SHADER,
          COLOR_OVERRIDE_SHADER_ATTRIBUTE_LIST
        )
        @textureFilters.push {
          shader: colorShaderProgram,
          draw: @_drawColorShader
        }

      _drawColorShader: (e) ->
        #e.program.writeVector("aColor",
            #this._red/255,
            #this._green/255,
            #this._blue/255,
            #this._strength
        #);
        #console.log 'foobar', @_red

      remove: ->

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

    Crafty.e('2D, WebGL, Image')
      .image('images/horizon-city.png')
      .attr(
        x: 40
        y: 50
        z: -600
      )
    try
      Crafty.e('2D, WebGL, Image, ColorShader')
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
