Crafty.c 'Explosion',
  init: ->
    @requires 'Color,Tween,2D,Canvas'

  explode: (attr) ->
    radius = attr.radius ? 20
    @attr attr
    @color '#FF0000'
    @tween({
      x: @x - radius
      y: @y - radius
      w: @w + (radius * 2)
      h: @h + (radius * 2)
      alpha: 0
      color: '#000000'
    }, 500)
    @bind 'TweenEnd', ->
      @destroy()

