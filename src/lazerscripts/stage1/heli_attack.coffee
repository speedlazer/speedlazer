{ EntityScript } = require('src/lib/LazerScript')
{ Stage1BossRocket } = require('./stage1boss')

class HeliInactive extends EntityScript
  assets: ->
    @loadAssets('helicopter')

  spawn: (options) ->
    Crafty.e('Helicopter, KeepAlive').attr(
      x: Crafty.viewport.width + 40
      y: .6 * Crafty.viewport.height
      defaultSpeed: options.speed ? 40
      weaponOrigin: [0, 25]
    ).helicopter(
      pointsOnHit: 25
      pointsOnDestroy: 200
      rotors: off
    )

  execute: ->
    @sequence(
      @invincible yes
      @sendToBackground(0.8)
    )


class HeliAttack extends EntityScript
  assets: ->
    @loadAssets('helicopter')

  spawn: (options) ->
    @ground = options.ground ? 660
    @corpseKeep = options.corpseKeep ? 10000

    p = Crafty.e('Helicopter').attr(
      x: Crafty.viewport.width + 40
      y: .6 * Crafty.viewport.height
      defaultSpeed: options.speed ? 40
      weaponOrigin: [0, 25]
    ).helicopter(
      pointsOnHit: 25
      pointsOnDestroy: 200
      rotors: on
    )
    p.addComponent('BurstShot').burstShot
      burstCooldown: 1500
      burstAmount: 6
      angle: -15
      angleDeviation: 5
      aim: 45
      cooldown: 50
      projectile: (x, y, angle) =>
        projectile = Crafty.e('Projectile, sphere1, Hostile')
          .crop(6, 21, 18, 7)
          .collision(0, 0, 20, 0, 20, 5, 0, 5)
          .flip()
          .attr(
            w: 20
            h: 8
            speed: 350
            damage: 1
          )

        projectile.shoot(x, y, angle)
    p

  execute: ->
    @bindSequence 'Destroyed', @onKilled

    @while(
      @movePath(@options.path, rotate: no) #, debug: yes)
      @sequence(
        @fireRockets()
        @wait 4000
      )
    )

  onKilled: ->
    @leaveAnimation @sequence(
      @deathDecoy()
      @bigExplosion()
      @while(
        @moveTo(
          x: .6
          y: @ground
          speed: 150
          easing: 'easeInQuad'
          positionType: 'absoluteY'
        )
        @sequence(
          @if(
            => !@entity.hidden
            @sequence(
              @blast(@location(),
                radius: 10,
                duration: 480,
                z: -1
                lightness: .2
                alpha: .5
              )
              @blast(@location(offsetX: 10, offsetY: 5),
                radius: 5,
                duration: 180,
                z: -1
              )
            )
          )
          @wait 100
        )
      )
      @moveTo(
        x: .6
        y: @ground - 20
        speed: 50
        easing: 'easeInOutQuad'
        positionType: 'absoluteY'
      )
      @moveTo(
        x: .6
        y: @ground
        speed: 50
        easing: 'easeInOutQuad'
        positionType: 'absoluteY'
      )
      @bigExplosion()
      =>
        @entity.attr(lightness: .3)
      @wait @corpseKeep
      @endDecoy()
    )

  fireRockets: (amount) ->
    script = Stage1BossRocket

    @sequence(
      @async @placeSquad(script,
        options:
          z: 5
          offsetX: 0
          offsetY: 50
          scale: .75
          health: 100
          location: @location()
      )
      @async @placeSquad(script,
        options:
          z: -5
          offsetX: 0
          offsetY: -50
          scale: .75
          health: 100
          location: @location()
      )
      @wait 500
    )

module.exports = {
  HeliAttack,
  HeliInactive
}
