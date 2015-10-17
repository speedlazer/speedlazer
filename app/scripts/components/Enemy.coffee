Crafty.c 'Enemy',
  init: ->
    @requires '2D, Canvas, Collision, Choreography'

  enemy: ->
    Crafty.trigger('EnemySpawned', this)
    @onHit 'Bullet', (e) ->
      bullet = e[0].obj
      bullet.trigger 'HitTarget', target: this
      @health -= bullet.damage
      if @health <= 0
        bullet.trigger 'DestroyTarget', target: this
        Crafty.trigger('EnemyDestroyed', this)
        @trigger('Destroyed', this)
        @destroy()
      bullet.destroy()
    @_initialViewport =
      x: Crafty.viewport.x
      y: Crafty.viewport.y

    @motion = Crafty.bind 'ViewportScroll', =>
      shiftedX = (@_initialViewport.x - Crafty.viewport._x)
      shiftedY = (@_initialViewport.y - Crafty.viewport._y)
      @attr x: @x + shiftedX, y: @y + shiftedY
      @_initialViewport =
        x: Crafty.viewport.x
        y: Crafty.viewport.y

    this

  remove: ->
    Crafty.unbind 'ViewportScroll', @motion
