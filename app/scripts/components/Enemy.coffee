Crafty.c 'Enemy',
  init: ->
    @requires '2D, Canvas, Color, Collision, Choreography'

  enemy: ->
    @attr w: 25, h: 25, health: 100
    @color '#0000FF'

    @onHit 'Bullet', (e) ->
      bullet = e[0].obj
      bullet.trigger 'HitTarget', target: this
      @health -= bullet.damage
      if @health <= 0
        bullet.trigger 'DestroyTarget', target: this
        Crafty.trigger('EnemyDestroyed', this)
        @destroy()
      bullet.destroy()

    this
