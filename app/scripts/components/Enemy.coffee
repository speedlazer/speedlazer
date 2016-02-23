Crafty.c 'Enemy',
  init: ->
    @requires '2D, WebGL, Collision, Tween, Choreography, ViewportFixed, Hideable, Flipable, Scalable, SunBlock'
    @attr
      pointsOnHit: 10
      pointsOnDestroy: 50
    @invincible = no

  enemy: (options = {}) ->
    options = _.defaults(options,
      projectile: 'Bullet'
    )
    Crafty.trigger('EnemySpawned', this)
    @onHit options.projectile,
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

          @trigger('Hit', entity: this, projectile: bullet)
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
          if splosion.damage > 0
            @trigger('Hit', entity: this, projectile: splosion)
            @attr hitFlash: { _red: 255, _green: 255, _blue: 128 }
            @absorbDamage(splosion.damage)
            splosion.damage = 0
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
