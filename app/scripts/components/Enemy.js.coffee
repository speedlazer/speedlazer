Crafty.c 'Enemy',
  init: ->
    @requires '2D, Canvas, Color, Collision, Choreography'

  enemy: ->
    @attr w: 25, h: 25, health: 300
    @color '#0000FF'
    #@bind 'EnterFrame', ->
      #@x = @x - 1
      #minX = (-Crafty.viewport._x) - 300
      #@destroy() if @x < minX

    @onHit 'Bullet', (e) ->
      bullet = e[0].obj
      bullet.trigger 'HitTarget', target: this
      @health -= bullet.damage
      if @health <= 0
        bullet.trigger 'DestroyTarget', target: this
        @destroy()
      bullet.destroy()

    this
