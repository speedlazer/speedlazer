Crafty.c 'Enemy',
  init: ->
    @requires '2D, WebGL, Collision, Tween, Choreography, ViewportFixed, Hideable, SunBlock'
    @attr
      pointsOnHit: 10
      pointsOnDestroy: 50
    @invincible = no

  enemy: ->
    Crafty.trigger('EnemySpawned', this)
    @onHit 'Bullet',
      (e) ->
        return if Game.paused
        return if @hidden
        data = { @pointsOnHit, @pointsOnDestroy }
        bullet = e[0].obj
        unless @invincible
          bullet.trigger 'HitTarget', data
          @attr hitFlash: { _red: 255, _green: 255, _blue: 0 }
          @absorbDamage(bullet.damage)
          if @health <= 0
            bullet.trigger 'DestroyTarget', data

          @trigger('Hit', this)
        bullet.destroy()
      ->
        @attr hitFlash: no

    @onHit 'Explosion',
      (e) ->
        return if Game.paused
        return if @hidden
        return if @invincible
        for c in e
          splosion = c.obj
          @trigger('Hit', this)
          @attr hitFlash: { _red: 255, _green: 255, _blue: 128 }
          @absorbDamage(splosion.damage)
      ->
        @attr hitFlash: no
    this

  absorbDamage: (damage) ->
    return unless damage?
    @health -= damage
    @updatedHealth?()
    if @health <= 0
      Crafty.trigger('EnemyDestroyed', this)
      @trigger('Destroyed', this)
      @destroy()

  flipX: ->
    try
      @flip('X')
      for c in @_children
        console.log c
        relX = c.x - @x
        c.attr?(
          x: @x + @w - c.w - relX
        )
        c.flip?('X')
    catch e
      console.log e

  unflipX: ->
    try
      @unflip('X')
      for c in @_children
        relX = (@x + @w - (c.x + c.w))
        c.attr?(
          x: @x + relX
        )
        c.unflip?('X')
    catch e
      console.log e
