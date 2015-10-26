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

  hide: (@hideMarker) ->
    @hidden = yes
    @attr alpha: 0.0

  reveal: ->
    @hideMarker?.destroy()
    @hidden = no
    @attr alpha: 1.0
