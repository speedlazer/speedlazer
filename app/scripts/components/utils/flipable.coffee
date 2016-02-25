Crafty.c 'Flipable',
  flipX: ->
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
    this

  unflipX: ->
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
    this

  _mirrorCollision: ->
    return unless @map.points
    for p, i in @map.points
      if i % 2 is 0
        dx = (p - @x)
        @map.points[i] = @x + (@w - dx)
