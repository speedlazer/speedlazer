Crafty.c 'Enemy',
  init: ->
    @requires '2D, WebGL, Collision, Tween, Choreography, ViewportFixed, Hideable'
    @attr
      pointsOnHit: 10
      pointsOnDestroy: 50

  enemy: ->
    Crafty.trigger('EnemySpawned', this)
    @onHit 'Bullet', (e) =>
      return if @hidden
      data = { @pointsOnHit, @pointsOnDestroy }
      bullet = e[0].obj
      bullet.trigger 'HitTarget', data
      @absorbDamage(bullet.damage)
      if @health <= 0
        bullet.trigger 'DestroyTarget', data

      @trigger('Hit', this)
      bullet.destroy()

    @onHit 'Explosion', (e) ->
      return if @hidden
      for c in e
        splosion = c.obj
        @trigger('Hit', this)
        @absorbDamage(splosion.damage)
    this

  absorbDamage: (damage) ->
    return unless damage?
    @health -= damage
    @updatedHealth?()
    if @health <= 0
      Crafty.trigger('EnemyDestroyed', this)
      @trigger('Destroyed', this)
      @destroy()
