Crafty.c 'Flipable',
  flipX: ->
    return if @xFlipped
    @xFlipped = yes
    try
      @flip?('X')
      for c in @_children
        relX = c.x - @x
        c.attr?(
          x: @x + @w - c.w - relX
        )
        c.flip?('X')
    catch e
      console.log e

    @_mirrorCollision()
    @_mirrorRotationPoints()
    @_mirrorWeaponOrigin()
    this

  unflipX: ->
    return unless @xFlipped
    @xFlipped = no
    try
      @unflip?('X')
      for c in @_children
        relX = (@x + @w - (c.x + c.w))
        c.attr?(
          x: @x + relX
        )
        c.unflip?('X')
    catch e
      console.log e
    @_mirrorCollision()
    @_mirrorRotationPoints()
    @_mirrorWeaponOrigin()
    this

  _mirrorCollision: ->
    return unless @map.points
    for p, i in @map.points
      if i % 2 is 0
        dx = (p - @x)
        @map.points[i] = @x + (@w - dx)

  _mirrorRotationPoints: ->
    @_origin.x = @w - @_origin.x
    for c in @_children
      c._origin.x = c.w - c._origin.x if c.origin?
      c.rotation = (360 + (360 - c.rotation)) % 360

  _mirrorWeaponOrigin: ->
    return unless @weaponOrigin?
    @weaponOrigin = [@w - @weaponOrigin[0], @weaponOrigin[1]]

