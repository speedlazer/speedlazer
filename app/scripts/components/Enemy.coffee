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
      @health -= bullet.damage
      if @health <= 0
        bullet.trigger 'DestroyTarget', target: this
        Crafty.trigger('EnemyDestroyed', this)
        @trigger('Destroyed', this)
        @destroy()
      bullet.destroy()
    this

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
