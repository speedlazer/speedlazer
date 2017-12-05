Game = @Game
Game.Scripts ||= {}

class Game.Scripts.JumpMine extends Game.EntityScript

  assets: ->
    @loadAssets('mine')

  spawn: (options) ->
    x = if options.direction is 'right' then Crafty.viewport.width + 180 else -180
    @target = options.grid.getLocation()
    @juice = options.juice ? yes

    Crafty.e('Mine, BulletCircle').mine(
      x: x
      y: 440
      defaultSpeed: options.speed ? 200
      pointsOnHit: if options.points then 10 else 0
      pointsOnDestroy: if options.points then 50 else 0
    ).bulletCircle(
      burstAmount: 8
      projectile: (x, y, angle) =>
        projectile = Crafty.e('Sphere, Hostile, Projectile')
          .blink()
          .attr(
            w: 14
            h: 14
            speed: 200
          )
        projectile.shoot(x, y, angle)
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @moveTo(y: 1.05, speed: 400)
      @moveTo(x: @target.x, easing: if @juice then 'easeOutQuad' else 'linear')
      @moveTo(y: @target.y, easing: if @juice then 'easeOutQuad' else 'linear')
      @parallel(
        @sequence(
          @synchronizeOn 'placed'
          @animate('open')
          @wait 200
          @moveTo(x: -50, speed: 35)
        )
        @sequence(
          @wait 1000
          @animate('blink', -1)
          @wait 1000
          => @entity.absorbDamage damage: @entity.health
          => @entity.shootRing()
          @endSequence()
        )
      )
    )

  onKilled: ->
    @bigExplosion(juice: @juice)

