Crafty.c 'LargeDrone',
  init: ->
    @requires 'Color, Enemy'

  drone: (attr = {}) ->
    @attr _.defaults(attr,
      w: 45, h: 35, health: 800)
    @origin 'center'
    @color '#0000DF'

    @enemy()
    @onHit 'Mine', (e) ->
      return if @hidden
      for c in e
        mine = c.obj
        return if mine.hidden
        mine.absorbDamage(300) # Mine collision on LargeDrone triggers explosion of mine
    this
