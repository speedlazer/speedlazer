defaults = require('lodash/defaults')

Crafty.c 'Enemy',
  required: '2D, WebGL, Collision, Tween, Choreography, Hideable, Flipable, Scalable, SunBlock, Hostile'
  events:
    HitOn: '_onCollisonHit'
    HitOff: '_onCollisonHitOff'
    HitFlash: 'applyHitFlash'

  init: ->
    @attr
      pointsOnHit: 0
      pointsOnDestroy: 0
      damage: 2
    @invincible = no

  _onCollisonHit: (collisions) ->
    return if Game.paused
    return if @hidden

    collisions.forEach((e) =>
      bulletOrExplosion = e.obj
      unless @invincible
        if bulletOrExplosion.damage > 0
          unless @juice is no
            @trigger('HitFlash', true)
          @absorbDamage(bulletOrExplosion)
          bulletOrExplosion.damage = 0

          @trigger('Hit', entity: this, projectile: bulletOrExplosion)

      if bulletOrExplosion.has('Bullet')
        bulletOrExplosion.trigger('BulletHit', bulletOrExplosion)
    )

  _onCollisonHitOff: (component) ->
    @trigger('HitFlash', false)

  onExplosionHit: (e) ->
    return if Game.paused
    return if @hidden
    return if @invincible
    for c in e
      splosion = c.obj
      if splosion.damage > 0
        @trigger('Hit', entity: this, projectile: splosion)
        unless @juice is no
          @trigger('HitFlash', true)
        @absorbDamage(splosion)
        splosion.damage = 0

  applyHitFlash: (onOff) ->
    if onOff
      @attr hitFlash: { _red: 255, _green: 255, _blue: 255 }
    else
      @attr hitFlash: no

  enemy: (options = {}) ->
    options = defaults(options,
      projectile: 'Bullet'
      pointsLocation: {
        x: @w / 2
        y: @h / 2
      }
    )
    @reveal()
    @pointsLocation = options.pointsLocation
    Crafty.trigger('EnemySpawned', this)
    @checkHits(options.projectile, 'Explosion')
    @updatedHealth?()
    this

  absorbDamage: (cause) ->
    return unless cause?
    x = @x + @pointsLocation.x
    y = @y + @pointsLocation.y
    data = { @pointsOnHit, @pointsOnDestroy, location: { x, y }}
    @health -= cause.damage
    @updatedHealth?()

    if @health <= 0
      Crafty.trigger('EnemyDestroyed', this)
      @trigger('Destroyed', this)
      @trigger('Cleanup', this)
      unless @__frozen
        @destroy()
      data.chainable = @chainable
      cause.ship?.trigger 'DestroyTarget', data
      @deathCause = cause.ship
    else
      cause.ship?.trigger 'HitTarget', data

