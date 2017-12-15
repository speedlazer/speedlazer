Game = require('src/scripts/game')
Game.Scripts ||= {}

class Game.Scripts.HeliAttack extends Game.EntityScript
  assets: ->
    @loadAssets('helicopter')

  spawn: (options) ->
    @dir = options.from ? 'top'
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
    )
    p.addComponent('BurstShot').burstShot
      burstCooldown: 2500
      burstAmount: 4
      angle: -15
      angleDeviation: 10
      aim: 45
      cooldown: 50
      projectile: (x, y, angle) =>
        projectile = Crafty.e('Projectile, sphere1, Hostile')
          .crop(6, 21, 18, 7)
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
      @flightPath()
      @sequence(
        @fireRockets()
        @wait 5000
      )
    )

  flightPath: ->
    if @dir is 'top'
      @movePath [
        [.9, .4]
        [.7, .25]
        [.65, .2]
        [.4, .6]
        [.6, .7]
        [.8, .5]
        [.4, .8]
        [.2, .3]
        [-.2, .5]
      ]
    else
      @movePath [
        [.9, .6]
        [.7, .75]
        [.65, .8]
        [.4, .4]
        [.6, .3]
        [.8, .5]
        [.4, .2]
        [.2, .7]
        [-.2, .5]
      ]

  onKilled: ->
    @leaveAnimation @sequence(
      @deathDecoy()
      @bigExplosion()
      @while(
        @moveTo(
          x: .6
          y: @ground
          speed: 250
          easing: 'easeInQuad'
          positionType: 'absoluteY'
        )
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
        @entity.removeComponent('ViewportFixed')
        @entity.attr(lightness: .3)
      @wait @corpseKeep
      @endDecoy()
    )

  fireRockets: (amount) ->
    script = Game.Scripts.Stage1BossRocket

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

