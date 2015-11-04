Crafty.c 'Explosion',
  init: ->
    @requires 'Color,Tween,2D,Canvas'

  explode: (attr) ->
    @attr attr
    @color '#FF0000'
    @tween({
      x: @x - 20
      y: @y - 20
      w: @w + 40
      h: @h + 40
      alpha: 0
      color: '#000000'
    }, 500)
    @bind 'TweenEnd', ->
      @destroy()

