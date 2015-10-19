Crafty.c 'Enemy',
  init: ->
    @requires '2D, Canvas, Collision, Choreography'

  enemy: ->
    Crafty.trigger('EnemySpawned', this)
    @onHit 'Bullet', (e) ->
      return if @hidden
      bullet = e[0].obj
      bullet.trigger 'HitTarget', target: this
      @health -= bullet.damage
      if @health <= 0
        bullet.trigger 'DestroyTarget', target: this
        Crafty.trigger('EnemyDestroyed', this)
        @trigger('Destroyed', this)
        @destroy()
      bullet.destroy()

    # Extract to 'ViewportFixed' Component?
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

  hide: (@hideMarker) ->
    @hidden = yes
    @attr alpha: 0.0

  reveal: ->
    @hideMarker?.destroy()
    @hidden = no
    @attr alpha: 1.0

  remove: ->
    Crafty.unbind 'ViewportScroll', @motion
