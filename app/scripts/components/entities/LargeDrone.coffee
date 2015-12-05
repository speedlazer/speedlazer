Crafty.c 'LargeDrone',
  init: ->
    @requires 'Enemy, standardLargeDrone'

  drone: (attr = {}) ->
    @attr _.defaults(attr,
      w: 90, h: 70, health: 800)
    @origin 'center'
    @collision [2, 36, 16,15, 86,2, 88,4, 62,15, 57,46, 46, 66, 18, 66, 3, 47]
    #@color '#0000DF'

    @enemy()
    @onHit 'Mine', (e) ->
      return if @hidden
      for c in e
        mine = c.obj
        return if mine.hidden
        mine.absorbDamage(300) # Mine collision on LargeDrone triggers explosion of mine
    this
