Crafty.c 'LargeDrone',
  init: ->
    @requires 'Enemy, standardLargeDrone, SpriteAnimation'
    #@reel 'eyes', 1200, [[1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1]]

  drone: (attr = {}) ->
    @attr _.defaults(attr,
      w: 90, h: 70, health: 800)
    @origin 'center'
    @collision [2, 36, 16,15, 86,2, 88,4, 62,15, 57,46, 46, 66, 18, 66, 3, 47]

    @eye = Crafty.e('2D, Canvas, eyeStart, SpriteAnimation')
    @attach(@eye)
    @eye.attr(x: 2 + @x, y: 18 + @y)
    @eye.reel 'slow', 1500, [[0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1]]

    @wing = Crafty.e('2D, Canvas, wingLoaded, SpriteAnimation')
    @attach(@wing)
    @wing.attr(x: 20 + @x, y: 28 + @y)
    @wing.reel 'emptyWing', 0, [[1, 2]]
    @wing.reel 'reload', 500, [[0, 0], [1, 0], [2, 0], [1, 1]]

    @enemy()
    @onHit 'Mine', (e) ->
      return if @hidden
      for c in e
        mine = c.obj
        return if mine.hidden
        mine.absorbDamage(300) # Mine collision on LargeDrone triggers explosion of mine
    this
