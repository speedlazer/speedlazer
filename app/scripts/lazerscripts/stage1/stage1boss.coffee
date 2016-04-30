Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stage1Boss extends Game.EntityScript
  assets: ->
    @loadAssets('largeDrone')

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
          rotation: @rotation + 1
          alpha: Math.max(0, @alpha - .003)
          lightness: -> Math.max(.2, @lightness - .05)
          y: @y - (Math.random() * 2)
      )
      @wait -> options.wait + (Math.random() * 50)
    )

class Game.Scripts.Stage1BossStage1 extends Game.Scripts.Stage1Boss
  spawn: ->
    Crafty.e('LargeDrone, Horizon').drone(
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .35
      defaultSpeed: 100
      health: 30000
      #defaultSpeed: 50
      pointsOnHit: 10
    )

  execute: ->
    @bindSequence 'Hit', @fase2, => @entity.healthBelow .5

    @sequence(
      @invincible yes
      @animate 'slow', -1, 'eye'
      @disableWeapons()
      @parallel(
        @moveTo(x: .75, y: .41)
        @sequence(
          @say('Drone Commander', 'We have control now! You will suffer!')
          @say('Drone Commander', 'Earths defences are in our hands!')
          @wait 500
        )
      )
      @laugh()
      @invincible no
      @enableWeapons()
      @async @placeSquad(Game.Scripts.Stage1BossRocket,
        options:
          location: @location()
          pointsOnDestroy: 0
          pointsOnHit: 0
      )
      @animate 'emptyWing', 0, 'wing'
      @animate 'reload', 0, 'wing'
      @moveTo(y: .43, speed: 5)

      # fase 1
      @repeat @sequence(
        @repeat 2, @rocketStrikeDance()
        @mineFieldStrike()
      )
    )

  mineFieldStrike: ->
    @sequence(
      @parallel(
        @sequence(
          @moveTo(x: -.2, y: .8, speed: 400, easing: 'easeInQuad')
          @turnAround()
          @movePath([
            [.2, .2]
            [.9, .6]
            [1.2, .4]
          ], speed: 400)
          @turnAround()
          @movePath([
            [.8, .2]
            [.5, .5]
            [1.2, .6]
          ], speed: 400)
        )
        @placeSquad(Game.Scripts.Stage1BossMineField,
          amount: 30
          delay: 300
          options:
            location: @location()
            gridConfig:
              x:
                start: 0.1
                steps: 9
                stepSize: 0.1
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

  rocketStrikeDance: (homing = no) ->
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

  fireRockets: (amount, homing) ->
    script = Game.Scripts.Stage1BossRocket
    if homing
      script = Game.Scripts.Stage1BossHomingRocket

    @sequence(
      @async @placeSquad(script,
        options:
          z: 5
          offsetX: 0
          offsetY: 50
          location: @location()
      )
      @animate 'emptyWing', 0, 'wing'
      @async @placeSquad(script,
        options:
          z: -5
          offsetX: 0
          offsetY: -50
          location: @location()
      )
      @if(( -> amount > 2)
        @async @placeSquad(Game.Scripts.Stage1BossRocket,
          options:
            z: -5
            offsetX: 30
            offsetY: -100
            location: @location()
        )
      )
      @if(( -> amount > 3)
        @async @placeSquad(Game.Scripts.Stage1BossRocket,
          options:
            z: -5
            offsetX: 30
            offsetY: 100
            location: @location()
        )
      )
      @wait 500
      @animate 'reload', 0, 'wing'
    )

  bombRaid: (armed = no) ->
    @sequence(
      @moveTo(y: .1, speed: 200, easing: 'easeInOutQuad')
      @while(
        @moveTo(x: -100, speed: 400)
        @sequence(
          @async @placeSquad(Game.Scripts.Stage1BossBombRaid,
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
          @async @placeSquad(Game.Scripts.Stage1BossBombRaid,
            options:
              location: @location()
              armed: armed
          )
          @wait 300
        )
      )
      @moveTo(x: 1.2, speed: 400)
      @turnAround()
      @moveTo(x: .85, y: .41, speed: 400)
    )

  fase2: ->
    # start at .6
    @bindSequence 'Hit', @endOfFight, => @entity.healthBelow .2

    @sequence(
      @setSpeed 200
      @repeat @sequence(
        @bombRaid(yes)
        @while(
          @rocketStrikeDance(yes)
          @sequence(
            @async @runScript(Game.Scripts.Stage1BossMine, @location())
            @wait 900
          )
        )
        @wait 500
      )
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
      @turnAround()
      @sendToBackground(0.7, -150)
      @while(
        @moveTo(x: 1.1, speed: 500, easing: 'easeInQuad')
        @smoke('medium')
      )
    )

class Game.Scripts.Stage1BossMine extends Game.EntityScript
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
      => @entity.absorbDamage @entity.health
      @endSequence()
    )

  onKilled: ->
    @bigExplosion()


class Game.Scripts.Stage1BossRocketStrike extends Game.EntityScript
  spawn: (options) ->
    options = _.defaults(options,
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

class Game.Scripts.Stage1BossRocket extends Game.EntityScript
  spawn: (options) ->
    options = _.defaults(options,
      pointsOHit: 125
      pointsOnDestroy: 50
      offsetY: 0
      offsetX: 0
    )
    return null unless options.location?

    location = options.location?()
    return null unless location

    @offsetY = options.offsetY
    @offsetX = options.offsetX

    Crafty.e('Rocket').rocket(
      health: 250
      x: location.x - 30
      y: location.y - 8 + Math.round(Math.random() * 15)
      z: 5
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

class Game.Scripts.Stage1BossHomingRocket extends Game.EntityScript
  spawn: (options) ->
    options = _.defaults(options,
      pointsOHit: 125
      pointsOnDestroy: 50
      z: 5
      offsetY: 0
    )
    return null unless options.location?

    location = options.location?()
    return null unless location
    @offsetY = options.offsetY

    Crafty.e('Rocket').rocket(
      health: 250
      x: location.x - 30
      y: location.y - 8 + Math.round(Math.random() * 15)
      z: options.z
      defaultSpeed: 500
      pointsOnHit: options.pointsOnHit
      pointsOnDestroy: options.pointsOnDestroy
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @pickTarget('PlayerControlledShip')
      @moveTo @location(offsetY: @offsetY)
      @wait 500
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

class Game.Scripts.Stage1BossPopup extends Game.Scripts.Stage1Boss
  spawn: ->
    Crafty.e('LargeDrone, Horizon').drone(
      health: 264000
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .5
      defaultSpeed: 150
    )

  execute: ->
    @bindSequence 'Hit', @leaveScreen, => @entity.health < 258000

    @sequence(
      @animate 'slow', -1, 'eye'
      @pickTarget('PlayerControlledShip')
      @moveTo(@targetLocation(), x: .845, 200)
      @attackCycle()
    )

  leaveScreen: ->
    @sequence(
      @drop(location: @location(), item: 'pool')
      @moveTo(x: 0.95, speed: 100)
      @while(
        @moveTo(x: -.15, speed: 500)
        @sequence(
          @smallExplosion()
          @while(
            @wait 300
            @smoke()
          )
        )
      )
      => @entity.flipX()
      @sendToBackground(0.7, -150)
      @while(
        @moveTo(x: 1.1, speed: 300)
        @smoke('light')
      )
    )

  attackCycle: ->
    @repeat @sequence(
      @async @placeSquad(Game.Scripts.Stage1BossHomingRocket,
        options:
          location: @location()
      )
      @animate 'emptyWing', 0, 'wing'
      @parallel(
        @moveTo(@targetLocation(offsetY: -20), x: .845)
        @sequence(
          @animate 'reload', 0, 'wing'
          @wait 1000
        )
      )
    )

class Game.Scripts.Stage1BossLeaving extends Game.Scripts.Stage1Boss

  spawn: ->
    Crafty.e('LargeDrone, Horizon').drone(
      health: 264000
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .5
      defaultSpeed: 150
    )

  execute: ->
    @inventoryAdd 'item', 'lasers', ->
      Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L').color('#8080FF')
    @entity.colorDesaturation Game.backgroundColor

    @sequence(
      @animate 'slow', -1, 'eye'
      @pickTarget('PlayerControlledShip')
      @while(
        @moveTo(@targetLocation(), x: .845, speed: 200)
        @smoke('medium')
      )
      @attackCycle()
      @laugh()
      @leaveScreen()
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

  leaveScreen: ->
    @sequence(
      @animate 'emptyWing', 0, 'wing'
      @sendToBackground(0.9, -100)
      @parallel(
        @while(
          @moveTo(x: -.15, y: .5, speed: 400)
          @smoke()
        )
        @scale(0.7, duration: 3000)
      )
      => @entity.flipX()
      @sendToBackground(0.7, -550)
      @parallel(
        @while(
          @moveTo('MiliBase', speed: 150)
          @smoke('light')
        )
        @scale(0.3, duration: 4000)
      )
    )

  attackCycle: ->
    @repeat 4, @sequence(
      @async @placeSquad(Game.Scripts.Stage1BossRocket,
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

class Game.Scripts.Stage1BossBombRaid extends Game.EntityScript
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
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    if @armed
      @sequence(
        @animate('blink', -1)
        @moveTo(y: .3 + (Math.random() * .6), easing: 'easeInOutQuad')
        @wait(200)
        => @entity.absorbDamage @entity.health
      )
    else
      @sequence(
        @moveTo(y: 1.2, easing: 'easeInQuad')
      )

  onKilled: ->
    @bigExplosion()


class Game.Scripts.Stage1BossDroneRaid extends Game.EntityScript
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
          projectile = Crafty.e('Projectile, Color, Enemy').attr(
            w: 6
            h: 6
            speed: 650
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

class Game.Scripts.Stage1BossMineField extends Game.EntityScript

  assets: ->
    @loadAssets('mine')

  spawn: (options) ->
    location = options.location()
    @target = options.grid.getLocation()

    Crafty.e('Mine').mine(
      x: location.x
      y: location.y + 36
      defaultSpeed: options.speed ? 200
      pointsOnHit: if options.points then 10 else 0
      pointsOnDestroy: if options.points then 50 else 0
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @moveTo(y: 1.05, speed: 400)
      @moveTo(x: @target.x, easing: 'easeOutQuad')
      @synchronizeOn 'dropped'
      @moveTo(y: @target.y, easing: 'easeOutQuad')
      @sequence(
        @wait 1000
        @animate('blink', -1)
        @wait 1000
        => Crafty.trigger('BridgeCollapse', @level)
        => @entity.absorbDamage @entity.health
        @endSequence()
      )
    )

  onKilled: ->
    @bigExplosion(juice: @juice)

