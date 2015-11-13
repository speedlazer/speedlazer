Crafty.c 'Enemy',
  init: ->
    @requires '2D, Canvas, Collision, Choreography, ViewportFixed'

  enemy: ->
    Crafty.trigger('EnemySpawned', this)
    @onHit 'Bullet', (e) ->
      return if @hidden
      bullet = e[0].obj
      bullet.trigger 'HitTarget', target: this
      @trigger('Hit', this)
      @absorbDamage(bullet.damage)
      bullet.destroy()
    @onHit 'Explosion', (e) ->
      return if @hidden
      for c in e
        splosion = c.obj
        @trigger('Hit', this)
        @absorbDamage(splosion.damage)
    this

  absorbDamage: (damage) ->
    @health -= damage
    if @health <= 0
      Crafty.trigger('EnemyDestroyed', this)
      @trigger('Destroyed', this)
      @destroy()

  sendToBackground: (scale, z) ->
    currentScale = @scale ? 1.0
    @attr
      scale: scale
      w: (@w / currentScale) * scale
      h: (@h / currentScale) * scale
      z: z
    @hidden = yes

  hide: (@hideMarker) ->
    @hidden = yes
    @attr alpha: 0.0

  reveal: ->
    @hideMarker?.destroy()
    @hidden = no
    currentScale = @scale ? 1.0
    scale = 1.0
    @attr
      scale: scale
      w: (@w / currentScale) * scale
      h: (@h / currentScale) * scale
      alpha: 1.0,
      z: 0

  remove: ->
    @hideMarker?.destroy()
