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
        bullet = e[0].obj
        unless @invincible
          unless @juice is no
            @attr hitFlash: { _red: 255, _green: 255, _blue: 0 }
          @absorbDamage(bullet)

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
            unless @juice is no
              @attr hitFlash: { _red: 255, _green: 255, _blue: 128 }
            @absorbDamage(splosion)
            #if splosion.ship?
              #console.log 'explosion by indirect hit caused by player!'
            #else
              #console.log 'explosion by indirect hit'
            splosion.damage = 0
      ->
        @attr hitFlash: no
    this

  absorbDamage: (cause) ->
    return unless cause?
    data = { @pointsOnHit, @pointsOnDestroy }
    cause.ship?.trigger 'HitTarget', data
    @health -= cause.damage
    @updatedHealth?()

    if @health <= 0
      Crafty.trigger('EnemyDestroyed', this)
      @trigger('Destroyed', this)
      @destroy()

      cause.ship?.trigger 'DestroyTarget', data
      @deathCause = cause.ship
      #console.log 'explosion by direct hit'

