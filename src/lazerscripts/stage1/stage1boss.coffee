defaults = require('lodash/defaults')
{ EntityScript } = require('src/lib/LazerScript')

class Stage1Boss extends EntityScript
  assets: ->
    @loadAssets('largeDrone')

  rocketStrikeDance: ->
    @parallel(
      @movePath([
          [.7, .4]
          [.8, .3]
          [.9, .5]
          [.7, .6]
          [.8, .7]
          [.9, .4]
          [.7, .1]
          [.6, .2]
        ], speed: 200
      )
      @repeat 2, @sequence(
        @fireRockets(4)
        @wait 500
        @fireRockets(4)
        @wait 500
        @fireRockets(2)
        @wait 200
      )
    )

  rocketStrikeDanceHoming: ->
    @parallel(
      @movePath([
          [.7, .4]
          [.8, .3]
          [.9, .5]
          [.7, .6]
          [.8, .7]
          [.9, .4]
          [.7, .1]
          [.6, .2]
        ]
      )
      @repeat 2, @sequence(
        @fireRockets(2, yes)
        @wait 600
        @fireRockets(2, yes)
        @wait 600
        @fireRockets(2, yes)
        @wait 900
        @fireRockets(4)
        @wait 300
      )
    )

  fireRockets: (amount, homing) ->
    script = Stage1BossRocket
    if homing
      script = Stage1BossAimedRocket

    @sequence(
      @async @placeSquad(script,
        options:
          z: 5
          offsetX: 0
          offsetY: 50
          pointsOnHit: 0
          pointsOnDestroy: 0
          location: @location()
      )
      @animate 'emptyWing', 0, 'wing'
      @async @placeSquad(script,
        options:
          z: -5
          offsetX: 0
          offsetY: -50
          pointsOnHit: 0
          pointsOnDestroy: 0
          location: @location()
      )
      @if(( -> amount > 2)
        @async @placeSquad(Stage1BossRocket,
          options:
            z: -5
            offsetX: 30
            offsetY: -100
            location: @location()
            pointsOnHit: 0
            pointsOnDestroy: 0
        )
      )
      @if(( -> amount > 3)
        @async @placeSquad(Stage1BossRocket,
          options:
            z: -5
            offsetX: 30
            offsetY: 100
            location: @location()
            pointsOnHit: 0
            pointsOnDestroy: 0
        )
      )
      @wait 500
      @animate 'reload', 0, 'wing'
    )

  smoke: (version = 'heavy') ->
    options = {
      heavy:
        alpha: .8
        wait: 40
      medium:
        alpha: .6
        wait: 80
      light:
        alpha: .4
        wait: 140
    }[version]
    @sequence(
      @blast(@location(),
        =>
          radius: 10
          duration: 480
          z: @entity.z - 3
          alpha: options.alpha
          lightness: 1.0
        ->
          @attr(
            rotation: @rotation + 1
            alpha: Math.max(0, @alpha - .003)
            lightness: -> Math.max(.2, @lightness - .05)
          )
          y: @y - (Math.random() * 2)
      )
      @wait -> options.wait + (Math.random() * 50)
    )

class Stage1BossStage1 extends Stage1Boss
  spawn: ->
    Crafty.e('LargeDrone, Horizon, BulletCircle').drone(
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .35
      defaultSpeed: 100
      health: 23000
      #defaultSpeed: 50
      pointsOnHit: 10
    ).bulletCircle(
      burstAmount: 16
      projectile: (x, y, angle) =>
        projectile = Crafty.e('Sphere, Hostile, Projectile')
          .blink()
          .attr(
            w: 14
            h: 14
            speed: 200
            damage: 1
          )
        projectile.shoot(x, y, angle)
    )

  execute: ->
    @bindSequence 'Hit', @fase2, => @entity.healthBelow .7

    @sequence(
      @invincible yes
      @animate 'slow', -1, 'eye'
      @disableWeapons()
      @parallel(
        @moveTo(x: .75, y: .41)
        @say 'Drone Commander', 'We have control over the AI now! You will suffer!\nEarths defences are in our hands!'
      )
      @laugh()
      @invincible no
      @enableWeapons()
      @async @placeSquad(Stage1BossRocket,
        options:
          location: @location()
          pointsOnDestroy: 0
          pointsOnHit: 0
      )
      @animate 'emptyWing', 0, 'wing'
      @animate 'reload', 0, 'wing'
      @moveTo(y: .43, speed: 5)

      # TODO: Add 'choose' syntax that randomly picks one

      # TODO: Add homing missile attack to the mix

      # TODO: Add Search mines to the mix

      # fase 1
      @repeat @sequence(
        @rocketStrikeDance()
        @wait 100
        @mineStomp()
        @wait 100
      )
    )

  fase2: ->
    # start at .7
    @bindSequence 'Hit', @fase3, => @entity.healthBelow .4

    # TODO: Add screenshake and debris falling to the mix

    # TODO: Add homing missile attack to the mix

    # TODO: Add Search mines to the mix

    # fase 2
    @sequence(
      @mineFieldStrike('BridgeDamage')
      @repeat @sequence(
        @wait 100
        @rocketStrikeDance()
        @wait 100
        @mineStomp()
      )
    )

  fase3: ->
    # start at .4
    @bindSequence 'Hit', @endOfFight, => @entity.healthBelow .2

    # TODO: Revise with drone attacks

    @sequence(
      @mineFieldStrike('BridgeCollapse')
      @wait 500
      @rocketStrikeDance()
      #@cancelBullets('Mine')
      #@cancelBullets('shadow')
      @setSpeed 200
      @repeat @sequence(
        @bombRaid(yes)
        @repeat 2, @while(
          @rocketStrikeDanceHoming()
          @sequence(
            @async @runScript(Stage1BossMine, @location())
            @wait 1500
          )
        )
        @wait 1000
      )
    )

  mineStomp: ->
    @sequence(
      @animate 'fast', -1, 'eye'

      @while(
        @repeat(2,
          @sequence(
            @async @placeSquad(Stage1BossMineStomp,
              amount: 8
              delay: 50
              options:
                location: @location()
                gridConfig:
                  x:
                    start: ->
                      rnd = Math.random()
                      loc = 1 + Math.floor(rnd * 5.0)
                      loc * 0.15
                    steps: 1
                    stepSize: 0.15
                  y:
                    start: 0.125
                    steps: 8
                    stepSize: 0.1
            )
            @wait 2000
          )
        )
        @movePath([
          [.7, .3]
          [.9, .4]
          [.9, .2]
        ], speed: 200)
      )
      @animate 'slow', -1, 'eye'
    )

  mineFieldStrike: (event) ->
    @sequence(
      @parallel(
        @sequence(
          @moveTo(x: -.2, y: .8, speed: 600, easing: 'easeInQuad')
          @turnAround()
          @movePath([
            [.2, .2]
            [.9, .6]
            [1.2, .4]
          ], speed: 600)
          @turnAround()
          @movePath([
            [.8, .2]
            [.5, .5]
            [1.2, .6]
          ], speed: 600)
        )
        @placeSquad(Stage1BossMineField,
          amount: 30
          delay: 200
          options:
            location: @location()
            event: event
            gridConfig:
              x:
                start: 0.1
                steps: 6
                stepSize: 0.15
                avoid: ->
                  rnd = Math.random()
                  [1 + Math.floor(rnd * 4.0)]
              y:
                start: 0.125
                steps: 8
                stepSize: 0.1
        )
      )
      @movePath([
        [.7, .4]
      ], speed: 300, 'easeOutQuad')
    )

  bombRaid: (armed = no) ->
    @sequence(
      @while(
        @moveTo(x: .8, speed: 200, easing: 'easeInOutQuad')
        @sequence(
          @bigExplosion()
          @wait 200
        )
      )
      @repeat(5, @sequence(
        => @entity.shootRing()
        @wait 300
      ))

      @moveTo(y: .1, speed: 200, easing: 'easeInOutQuad')
      @while(
        @moveTo(x: -100, speed: 400)
        @sequence(
          @async @placeSquad(Stage1BossBombRaid,
            options:
              location: @location()
              armed: no
          )
          @wait 300
        )
      )
      @turnAround()
      @while(
        @moveTo(x: 1.0, speed: 400)
        @sequence(
          @async @placeSquad(Stage1BossBombRaid,
            options:
              location: @location()
              armed: armed
          )
          @smoke('light')
          @wait 300
        )
      )
      @moveTo(x: 1.2, speed: 400)
      @turnAround()
      @moveTo(x: .85, y: .41, speed: 400)
    )


  laugh: ->
    @sequence(
      => Crafty.audio.play('laugh')
      => @entity.invincible = yes
      @repeat 5, @sequence(
        @rotate(10, 200)
        @rotate(-10, 200)
      )
      @rotate(0, 200)
      => @entity.invincible = no
    )

  endOfFight: ->
    @sequence(
      @cancelBullets('Mine')
      @cancelBullets('shadow')
      @repeat(5, @sequence(
        => @entity.shootRing()
        @wait 300
      ))
      @invincible yes
      @while(
        @moveTo(x: .6, y: .90, speed: 50)
        @sequence(
          @smallExplosion()
          @while(
            @wait 300
            @smoke()
          )
        )
      )
      @moveTo(y: 1.1, x: .4, speed: 50)
      @moveTo(y: .6, x: .4, speed: 350, easing: 'easeOutQuad')
      @sendToBackground(0.9, -100)
      @parallel(
        @while(
          @moveTo(x: -.15, speed: 300, easing: 'easeInQuad')
          @smoke('medium')
        )

        @scale(0.8, duration: 3000)
      )
      @leaveAnimation @sequence(
        @turnAround()
        @sendToBackground(0.7, -150)
        @while(
          @moveTo(x: 1.1, speed: 500, easing: 'easeInQuad')
          @smoke('medium')
        )
      )
    )

class Stage1BossMine extends EntityScript
  assets: ->
    @loadAssets('mine')

  spawn: (location) ->
    Crafty.e('Mine').mine(
      health: 100
      x: location().x
      y: location().y + 10
      z: -4
      defaultSpeed: 200
      pointsOnHit: 0
      pointsOnDestroy: 0
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @pickTarget('PlayerControlledShip')
      @moveTo(y: 1.1, easing: 'easeInQuad')
      => @entity.attr(z: 0)
      @moveTo(@targetLocation(), y: 1.01, easing: 'easeInOutQuad')
      @moveTo(@targetLocation(x: null))
      @animate 'open'
      @wait 200
      @animate 'blink', -1
      @wait 1000
      => @entity.absorbDamage damage: @entity.health
      @endSequence()
    )

  onKilled: ->
    @bigExplosion()


class Stage1BossRocketStrike extends EntityScript
  spawn: (options) ->
    options = defaults(options,
      pointsOHit: 125
      pointsOnDestroy: 50
    )
    location = options.grid.getLocation()

    Crafty.e('Rocket').rocket(
      health: 250
      x: location.x * Crafty.viewport.width
      y: location.y * Crafty.viewport.height
      z: 5
      defaultSpeed: 600
      pointsOnHit: options.pointsOnHit
      pointsOnDestroy: options.pointsOnDestroy
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @while(
      @moveTo(x: -205, easing: 'easeInQuad')
      @sequence(
        @blast(@location(),
          ->
            radius: 5
            duration: 135
            z: 1
            alpha: .8
            lightness: 1.0
            gravity: (Math.random() * .2)
            vertical: 0
          ->
            vertical: @vertical + Math.random() * @gravity
            rotation: @rotation + (Math.random() * 3)
            alpha: Math.max(0.1, (@alpha - Math.random() * .03))
            lightness: Math.max(.4, @lightness - .05)
            y: @y - @vertical
        )
        @wait 20
      )
    )

  onKilled: ->
    @bigExplosion()

class Stage1BossRocket extends EntityScript
  spawn: (options) ->
    options = defaults(options,
      pointsOnHit: 125
      pointsOnDestroy: 50
      offsetY: 0
      offsetX: 0
      scale: 1.0
      health: 250
    )
    return null unless options.location?

    location = options.location?()
    return null unless location

    @offsetY = options.offsetY
    @offsetX = options.offsetX

    Crafty.e('Rocket').rocket(
      health: options.health
      x: location.x - 30
      y: location.y - 8 + Math.round(Math.random() * 15)
      z: 5
      scale: options.scale
      defaultSpeed: 600
      pointsOnHit: options.pointsOnHit
      pointsOnDestroy: options.pointsOnDestroy
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @while(
      @sequence(
        @moveTo @location(offsetY: @offsetY, offsetX: @offsetX)
        @if((-> @offsetX isnt 0 or @offsetY isnt 0)
          @wait 500
        )
        @moveTo(x: -205, easing: 'easeInQuad')
      )
      @sequence(
        @blast(@location(),
          ->
            radius: 5
            duration: 135
            z: -1
            alpha: .9
            lightness: 1.0
            gravity: (Math.random() * .2)
            vertical: 0
          ->
            @attr(
              vertical: @vertical + Math.random() * @gravity
              rotation: @rotation + (Math.random() * 3)
              alpha: Math.max(0.1, (@alpha - Math.random() * .02))
              lightness: Math.max(.2, @lightness - .05)
            )
            y: @y - @vertical
        )
        @wait 20
      )
    )

  onKilled: ->
    @bigExplosion()

class Stage1BossAimedRocket extends EntityScript
  spawn: (options) ->
    options = defaults(options,
      pointsOHit: 125
      pointsOnDestroy: 50
      z: 5
      scale: 1.0
      offsetY: 0
    )
    return null unless options.location?

    location = options.location?()
    return null unless location
    @offsetY = options.offsetY
    @cooldown = options.cooldown ? 500

    Crafty.e('Rocket').rocket(
      health: 250
      x: location.x - 30
      y: location.y - 8 + Math.round(Math.random() * 15)
      z: options.z
      defaultSpeed: 500
      scale: options.scale
      pointsOnHit: options.pointsOnHit
      pointsOnDestroy: options.pointsOnDestroy
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @pickTarget('PlayerControlledShip')
      @moveTo @location(offsetY: @offsetY)
      @wait @cooldown
      @while(
        @moveThrough @targetLocation()
        @sequence(
          @blast(@location(),
            ->
              radius: 5
              duration: 135
              z: 1
              alpha: .8
              lightness: 1.0
              gravity: (Math.random() * .2)
              vertical: 0
            ->
              vertical: @vertical + Math.random() * @gravity
              rotation: @rotation + (Math.random() * 3)
              alpha: Math.max(0.1, (@alpha - Math.random() * .03))
              lightness: Math.max(.4, @lightness - .05)
              y: @y - @vertical
          )
          @wait 20
        )
      )
    )

  onKilled: ->
    @bigExplosion()

class Stage1BossHomingRocket extends EntityScript
  spawn: (options) ->
    options = defaults(options,
      pointsOHit: 125
      pointsOnDestroy: 50
      z: 5
      scale: 1.0
      offsetY: 0
    )
    return null unless options.location?

    location = options.location?()
    return null unless location
    @offsetY = options.offsetY
    @cooldown = options.cooldown ? 500

    Crafty.e('Rocket').rocket(
      health: 250
      x: location.x - 30
      y: location.y - 8 + Math.round(Math.random() * 15)
      z: options.z
      defaultSpeed: 500
      scale: options.scale
      pointsOnHit: options.pointsOnHit
      pointsOnDestroy: options.pointsOnDestroy
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @pickTarget('PlayerControlledShip')
      @moveTo @location(offsetY: @offsetY)
      @wait @cooldown
      @while(
        @movePath [
          @targetLocation()
          [-160, .5]
        ]
        @sequence(
          @blast(@location(),
            ->
              radius: 5
              duration: 135
              z: 1
              alpha: .8
              lightness: 1.0
              gravity: (Math.random() * .2)
              vertical: 0
            ->
              vertical: @vertical + Math.random() * @gravity
              rotation: @rotation + (Math.random() * 3)
              alpha: Math.max(0.1, (@alpha - Math.random() * .03))
              lightness: Math.max(.4, @lightness - .05)
              y: @y - @vertical
          )
          @wait 20
        )
      )
    )

  onKilled: ->
    @bigExplosion()

class Stage1BossPopup extends Stage1Boss
  spawn: ->
    Crafty.e('LargeDrone, Horizon').drone(
      maxHealth: 60000
      health: 17000
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .5
      defaultSpeed: 150
    )

  execute: ->
    @bindSequence 'Hit', @leaveScreen, => @entity.healthBelow .10

    @sequence(
      @animate 'slow', -1, 'eye'
      @moveTo(x: .9, y: .45)
      @while(
        @repeat @rocketStrikeDance()
        @smoke('light')
      )
    )

  leaveScreen: ->
    @sequence(
      @invincible yes
      @moveTo(y: .5, x: 0.95, speed: 200, easing: 'easeInOutQuad')

      @async @placeSquad(Stage1BossPopupMineField,
        amount: 20
        delay: 50
        options:
          location: @location()
          gridConfig:
            x:
              start: 0.1
              steps: 12
              stepSize: 0.075
            y:
              start: 0.1
              steps: 5
              stepSize: 0.075
      )
      @async @placeSquad(Stage1BossPopupMineField,
        amount: 20
        delay: 50
        options:
          location: @location()
          gridConfig:
            x:
              start: 0.1
              steps: 12
              stepSize: 0.075
            y:
              start: 0.7
              steps: 5
              stepSize: 0.075
      )
      @wait(3000)
      @drop item: 'pool', location: @location()
      @while(
        @moveTo(x: -.15, speed: 500, easing: 'easeInOutQuad')
        @sequence(
          @smallExplosion()
          @while(
            @wait 300
            @smoke()
          )
        )
      )
      @leaveAnimation @sequence(
        @turnAround()
        @sendToBackground(0.7, -150)
        @while(
          @moveTo(x: 1.1, speed: 300)
          @smoke('light')
        )
      )
    )

class Stage1BossLeaving extends Stage1Boss

  spawn: ->
    Crafty.e('LargeDrone, Horizon').drone(
      maxHealth: 180000
      health: 36000
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .5
      defaultSpeed: 150
    )

  execute: ->
    @entity.colorDesaturation Game.backgroundColor
    @bindSequence 'Hit', @leaveScreen, => @entity.healthBelow .10

    @sequence(
      @animate 'slow', -1, 'eye'
      @shortRocketStrikeDance()
      @laugh()
      @leaveScreen()
    )

  shortRocketStrikeDance: (homing = no) ->
    @parallel(
      @movePath([
          [.7, .4]
          [.8, .3]
          [.9, .5]
          [.7, .6]
          [.8, .7]
          [.9, .4]
          [.7, .1]
          [.6, .2]
        ]
      )
      @repeat 2, @sequence(
        @fireRockets(4, homing)
        @wait 1500
        @fireRockets(4, homing)
        @wait 1000
        @fireRockets(2, homing)
        @wait 300
        @fireRockets(2)
        @wait 300
        @fireRockets(2, homing)
        @wait 300
      )
    )

  laugh: ->
    @sequence(
      => Crafty.audio.play('laugh')
      @invincible yes
      @repeat 5, @sequence(
        @rotate(10, 200)
        @rotate(-10, 200)
      )
      @rotate(0, 200)
      @invincible no
    )

  leaveScreen: ->
    @leaveAnimation @sequence(
      @animate 'emptyWing', 0, 'wing'
      @sendToBackground(0.9, -100)
      @parallel(
        @while(
          @moveTo(x: -.15, y: .4, speed: 400)
          @smoke()
        )
        @scale(0.5, duration: 3000)
      )
      => @entity.flipX()
      @sendToBackground(0.5, -550)
      @parallel(
        @while(
          @moveTo('MiliBase', speed: 150, offsetY: -160, offsetX: -40)
          @smoke('light')
        )
        @scale(0.2, duration: 4000)
      )
    )

  attackCycle: ->
    @repeat 4, @sequence(
      @async @placeSquad(Stage1BossRocket,
        options:
          location: @location()
          pointsOnDestroy: 0
          pointsOnHit: 0
      )
      @animate 'emptyWing', 0, 'wing'
      @parallel(
        @while(
          @moveTo(@targetLocation(offsetY: -20), x: .845)
          @smoke('medium')
        )
        @sequence(
          @animate 'reload', 0, 'wing'
          @wait 1000
        )
      )
    )

class Stage1BossBombRaid extends EntityScript
  assets: ->
    @loadAssets('mine')

  spawn: (options) ->
    location = options.location()
    @armed = options.armed
    Crafty.e('Mine').mine(
      health: 200
      x: location.x
      y: location.y + 10
      z: -4
      defaultSpeed: 400
      pointsOnHit: 10
      pointsOnDestroy: 20
      scale: options.scale ? 1.0
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    if @armed
      @sequence(
        @animate('blink', -1)
        @moveTo(y: .3 + (Math.random() * .6), easing: 'easeInOutQuad')
        @wait(200)
        => @entity.absorbDamage damage: @entity.health
      )
    else
      @sequence(
        @moveTo(y: 1.2, easing: 'easeInQuad')
      )

  onKilled: ->
    @bigExplosion()


class Stage1BossDroneRaid extends EntityScript
  assets: ->
    @loadAssets('drone')

  spawn: (options) ->
    d = Crafty.e('Drone').drone(
      health: 200
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .1
      defaultSpeed: 500
    )
    if options.shootOnSight
      d.addComponent('ShootOnSight').shootOnSight
        cooldown: 1000
        sightAngle: 8
        projectile: (x, y, angle) =>
          projectile = Crafty.e('Projectile, Color, Hostile').attr(
            w: 6
            h: 6
            speed: 650
            damage: 1
          ).color('#FFFF00')
          projectile.shoot(x, y, angle)
    d

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @pickTarget('PlayerControlledShip')
      @movePath [
        @targetLocation(offsetX: -20, offsetY: 30)
        [-160, .5]
      ]
    )

  onKilled: ->
    @smallExplosion()

class Stage1BossMineField extends EntityScript

  assets: ->
    @loadAssets('mine')

  spawn: (options) ->
    location = options.location()
    @target = options.grid.getLocation()
    @event = options.event

    Crafty.e('Mine').mine(
      x: location.x
      y: location.y + 36
      health: 300
      defaultSpeed: options.speed ? 250
      pointsOnHit: if options.points then 10 else 0
      pointsOnDestroy: if options.points then 50 else 0
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @moveTo(y: 1.05, speed: 400)
      @moveTo(x: @target.x, speed: 400, easing: 'easeOutQuad')
      @synchronizeOn 'dropped'
      @moveTo(y: @target.y, easing: 'easeOutQuad', speed: 400)
      @sequence(
        @animate('blink', -1)
        @wait 1000
        @squadOnce('bridge', => Crafty.trigger(@event, @level))
        => @entity.absorbDamage damage: @entity.health
        @endSequence()
      )
    )

  onKilled: ->
    @bigExplosion(juice: @juice)

class Stage1BossMineStomp extends EntityScript

  assets: ->
    @loadAssets('mine')

  spawn: (options) ->
    location = options.location()
    @gridPos = options.grid.getLocation()

    Crafty.e('Mine').mine(
      x: location.x
      y: location.y + 36
      health: 300
      defaultSpeed: options.speed ? 250
      pointsOnHit: if options.points then 10 else 0
      pointsOnDestroy: if options.points then 50 else 0
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @moveTo(y: 1.05, speed: 400)
      @moveTo(x: @gridPos.x, speed: 400, easing: 'easeOutQuad')
      @synchronizeOn 'dropped'
      @pickTarget('PlayerControlledShip')
      @lockTarget()
      @moveTo(y: @gridPos.y, easing: 'easeOutQuad', speed: 400)
      @sequence(
        @parallel(
          @moveThrough(@targetLocation(y: @gridPos.y), speed: 400)
          @sequence(
            @wait 500
            @animate('blink', -1)
            @wait 300
            => @entity.absorbDamage damage: @entity.health
            @endSequence()
          )
        )
      )
    )

  onKilled: ->
    @bigExplosion(juice: @juice)

class Stage1BossPopupMineField extends EntityScript
  assets: ->
    @loadAssets('mine')

  spawn: (options) ->
    location = options.location()
    @target = options.grid.getLocation()
    @index = options.index

    Crafty.e('Mine').mine(
      health: 700
      x: location.x
      y: location.y + 10
      z: -4
      defaultSpeed: options.speed ? 300
      pointsOnHit: if options.points then 10 else 0
      pointsOnDestroy: if options.points then 50 else 0
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @moveTo(x: @target.x, y: @target.y, easing: 'easeOutQuad')
      @synchronizeOn 'placed'
      @sequence(
        @wait (1 - @target.xPerc) * 1000
        @animate('blink', -1)
        @wait 1000
        => @entity.absorbDamage damage: @entity.health
        => Crafty('RiggedExplosion').trigger('BigExplosion') if @index == 0
        @endSequence()
      )
    )

  onKilled: ->
    @bigExplosion(juice: @juice)

module.exports = {
  Stage1BossAimedRocket
  Stage1BossBombRaid
  Stage1BossDroneRaid
  Stage1BossLeaving
  Stage1BossMine
  Stage1BossPopup
  Stage1BossRocket
  Stage1BossRocketStrike
  Stage1BossStage1
}
