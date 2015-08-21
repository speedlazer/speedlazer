Crafty.c 'Drone',
  init: ->
    @requires '2D, Canvas, Color, Collision, Choreography, Enemy'

  drone: ->
    @attr w: 25, h: 25, health: 100
    @color '#0000FF'

    @onHit 'Bullet', (e) ->
      bullet = e[0].obj
      bullet.trigger 'HitTarget', target: this
      @health -= bullet.damage
      if @health <= 0
        bullet.trigger 'DestroyTarget', target: this
        Crafty.trigger('EnemyDestroyed', this)
        @trigger('Destroyed', this)
        @destroy()
      bullet.destroy()
    if @has('Weaponized')
      @bind 'Shoot', =>
        @shooting = Crafty.e('Delay').delay(
          =>
            Crafty.e('2D,Canvas,Color,Enemy,Tween').attr(
              x: @x - @w
              y: @y + (@h / 2)
              w: 4
              h: 4
            ).color('#FFFF00').tween(
              x: @x - 640
              1000
            )
        , 500, 5)

    this

  remove: ->
    @shooting.destroy() if @shooting?
