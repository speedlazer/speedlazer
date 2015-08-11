Crafty.c 'WeaponLaser',
  init: ->
    @requires '2D,Canvas,Color'
    @color '#808080'
    @attr
      w: 30
      h: 5

  remove: ->

  install: (@ship) ->
    @attr
      x: @ship.x + 10
      y: @ship.y + 15
    @ship.attach this

  shoot: ->
    Crafty.e('Bullet')
      .color(@ship.color())
      .attr
        x: @x + @w
        y: @y + 1
        w: 10
        h: 3
      .fire
        origin: this
        damage: 100
        speed: @ship._forcedSpeed.x + 7
        direction: 0
      .bind 'HitTarget', =>
        @ship.trigger('BulletHit')
      .bind 'DestroyTarget', =>
        @ship.trigger('BulletDestroyedTarget')

