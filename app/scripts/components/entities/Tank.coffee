Crafty.c 'Tank',
  init: ->
    @requires 'Enemy, Color'

  tank: (attr = {}) ->
    defaultHealth = 2750
    @attr _.defaults(attr,
      w: 150
      h: 100
      health: defaultHealth
      maxHealth: attr.health ? defaultHealth
    )
    @color '#FF0000'
    @enemy()
    this

  updatedHealth: ->

