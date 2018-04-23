{ EntityScript } = require('src/lib/LazerScript')
{ Stage1BossRocket } = require('./stage1boss')

class HeliInactive extends EntityScript
  assets: ->
    @loadAssets('helicopter')

  spawn: (options) ->
    Crafty.e('Helicopter, KeepAlive, ParkedHeli').attr(
      x: Crafty.viewport.width + 40
      y: .6 * Crafty.viewport.height
      defaultSpeed: options.speed ? 100
      weaponOrigin: [0, 25]
    ).helicopter(
      rotors: off
    )

  execute: ->
    @sequence(
      @turnAround()
      @invincible yes
      @sendToBackground(0.8)
    )


class HeliFlyAway extends EntityScript
  assets: ->
    @loadAssets('helicopter')

  spawn: (options) ->
    helicopter = Crafty('ParkedHeli').get(0)
    helicopter.removeComponent('ParkedHeli')
    helicopter.removeComponent('KeepAlive')
    helicopter

  execute: ->
    @sequence(
      @invincible yes
      @sendToBackground(0.8)
      @action 'start-rotors'
      @wait 100
      @moveTo(dy: -30 + (-30 * @options.index))
      @rotate(5, 100)
      @detach()
      @parallel(
        @sendToBackground(0.75, -50)
        @moveTo(x: 1.02, { easing: "easeInQuad", speed: 200 })
      )
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
      chainable: !options.deathDecoy
    ).helicopter(
      pointsOnHit: 10
      pointsOnDestroy: 70
      rotors: on
    )
    p.addComponent('BurstShot').burstShot
      burstCooldown: 1500
      burstAmount: 4
      angle: -15
      angleDeviation: 5
      aim: 45
      cooldown: 100
      projectile: (x, y, angle) =>
        projectile = Crafty.e('Projectile, sphere1, Hostile, Collision')
          .crop(6, 21, 18, 7)
          .collision(0, 0, 20, 0, 20, 5, 0, 5)
          .flip()
          .attr(
            w: 20
            h: 8
            speed: 200
            damage: 1
          )

        projectile.shoot(x, y, angle)
    p

  execute: ->
    @bindSequence 'Destroyed', @onKilled

    @while(
      @movePath(@options.path, rotate: no, debug: @options.debug)
      @sequence(
        @wait 4000
        @fireRockets()
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
  HeliFlyAway
}
