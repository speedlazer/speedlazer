Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Test extends Game.LazerScript
  metadata:
    namespace: 'City'
    armedPlayers: 'lasers'
    speed: 0
    title: 'WebGL-Shaders'

  assets: ->
    @loadAssets('test',
      images: ['city.png']
    )

  execute: ->
    o = Crafty.e('2D, WebGL, Image')
      .image('images/city.png')
      .attr(
        x: 40
        y: 250
        z: -500
      )
    speed = 4
    colorDuration = (500000 / speed)

    e = Crafty.e('2D, WebGL, ImageWithEffects')
      .image('images/city.png')
      .attr(
        x: 140
        y: 230
        z: -600
      )
    f = Crafty.e('2D, WebGL, ImageWithEffects')
      .image('images/city.png')
      .attr(
        x: 240
        y: 210
        z: -700
      )
    Crafty.bind('BackgroundColor', (c) ->
      e.colorDesaturation(c, .5)
      f.colorDesaturation(c, .8)
    )

    @parallel(
      @backgroundColorFade duration: colorDuration, '#000010', '#402020', '#7070CC', '#8080FF'
    )
