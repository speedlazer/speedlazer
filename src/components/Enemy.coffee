defaults = require('lodash/defaults')

Crafty.c 'Enemy',
  init: ->
    @requires '2D, WebGL, Collision, Tween, Choreography, Hideable, Flipable, Scalable, SunBlock, Hostile'
    @attr
      pointsOnHit: 10
      pointsOnDestroy: 50
      damage: 2
    @invincible = no

  onProjectileHit: (e) ->
    return if Game.paused
    return if @hidden
    bullet = e[0].obj
    unless @invincible
      unless @juice is no
        @attr hitFlash: { _red: 255, _green: 255, _blue: 255 }
      @absorbDamage(bullet)

      @trigger('Hit', entity: this, projectile: bullet)
    bullet.destroy()

  onProjectileHitEnd: ->
    @attr hitFlash: no

  onExplosionHit: (e) ->
    return if Game.paused
    return if @hidden
    return if @invincible
    for c in e
      splosion = c.obj
      if splosion.damage > 0
        @trigger('Hit', entity: this, projectile: splosion)
        unless @juice is no
          @attr hitFlash: { _red: 255, _green: 255, _blue: 255 }
        @absorbDamage(splosion)
        splosion.damage = 0

  enemy: (options = {}) ->
    options = defaults(options,
      projectile: 'Bullet'
    )
    Crafty.trigger('EnemySpawned', this)
    @onHit(
      options.projectile
      (e) => @onProjectileHit(e)
      => @onProjectileHitEnd()
    )
    @onHit(
      'Explosion'
      (e) => @onExplosionHit(e)
      => @onProjectileHitEnd()
    )
    this

  absorbDamage: (cause) ->
    return unless cause?
    x = @x + @w / 2
    y = @y + @h / 2
    data = { @pointsOnHit, @pointsOnDestroy, location: { x, y }}
    @health -= cause.damage
    @updatedHealth?()

    if @health <= 0
      Crafty.trigger('EnemyDestroyed', this)
      @trigger('Destroyed', this)
      @destroy()

      cause.ship?.trigger 'DestroyTarget', data
      @deathCause = cause.ship
    else
      cause.ship?.trigger 'HitTarget', data

