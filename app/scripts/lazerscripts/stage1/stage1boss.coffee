Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stage1BossStage1 extends Game.EntityScript
  assets: ->
    @loadAssets('largeDrone')

  spawn: ->
    Crafty.e('LargeDrone').drone(
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .35
      speed: 100
      pointsOnHit: 10
    )

  execute: ->
    @bindSequence 'Hit', @fase2, => @entity.health < 345000
    @inventoryAdd 'item', 'lasers', ->
      Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L').color('#8080FF')
    @inventoryAdd 'item', 'diagonals', ->
      Crafty.e('PowerUp').powerUp(contains: 'diagonals', marking: 'D').color('#8080FF')

    @sequence(
      => @entity.invincible = yes
      @animate 'slow', -1, 'eye'
      @disableWeapons()
      @parallel(
        @moveTo(x: .85, y: .41)
        @sequence(
          @say('Large Drone', 'We have control now! You will suffer!')
          @say('Large Drone', 'Earths defences are in our hands!')
          @wait 500
        )
      )
      => @entity.invincible = no
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
      @repeat @attackCycle(5)
    )

  attackCycle: (speed) ->
    @sequence(
      @async @runScript(Game.Scripts.Stage1BossMine, @location())
      @moveTo(y: .41, speed: speed)
      @wait 200
      @async @placeSquad(Game.Scripts.Stage1BossRocket,
        options:
          location: @location()
          pointsOnDestroy: 0
          pointsOnHit: 0
      )
      @animate 'emptyWing', 0, 'wing'
      @animate 'reload', 0, 'wing'
      @async @runScript(Game.Scripts.Stage1BossMine, @location())
      @moveTo(y: .43, speed: speed)
      @async @placeSquad(Game.Scripts.Stage1BossRocket,
        options:
          location: @location()
          pointsOnDestroy: 0
          pointsOnHit: 0
      )
      @animate 'emptyWing', 0, 'wing'
      @wait 200
      @animate 'reload', 0, 'wing'
    )

  attackCycle3: (speed) ->
    @repeat @sequence(
      @repeat 5, @sequence(
        @pickTarget('PlayerControlledShip')
        @while(
          @moveTo(@targetLocation(offsetY: -20), x: .85)
          @sequence(
            @async @runScript(Game.Scripts.Stage1BossMine, @location())
            @wait 800
            @async @placeSquad(Game.Scripts.Stage1BossHomingRocket,
              options:
                location: @location()
                pointsOnDestroy: 0
                pointsOnHit: 0
            )
            @animate 'emptyWing', 0, 'wing'
            @animate 'reload', 0, 'wing'
            @async @runScript(Game.Scripts.Stage1BossMine, @location())
            @wait 800
            @async @placeSquad(Game.Scripts.Stage1BossHomingRocket,
              options:
                location: @location()
                pointsOnDestroy: 0
                pointsOnHit: 0
            )
            @animate 'emptyWing', 0, 'wing'
            @wait 800
            @animate 'reload', 0, 'wing'
          )
        )
        @wait(1000)
      )
      @rocketRaid()
    )

  rocketRaid: ->
    @sequence(
      => @entity.invincible = yes
      @moveTo(y: .1)
      @repeat 10, @sequence(
        @async @placeSquad(Game.Scripts.Stage1BossHomingRocket,
          options:
            location: @location()
            pointsOnDestroy: 0
            pointsOnHit: 0
        )
        @animate 'emptyWing', 0, 'wing'
        @animate 'reload', 0, 'wing'
        @wait 300
      )

      @pickTarget('PlayerControlledShip')
      @moveTo(@targetLocation(offsetY: -20), x: .85)
      => @entity.invincible = no
    )

  bombRaid: (armed = no) ->
    @sequence(
      => @entity.invincible = yes
      @moveTo(y: .1)
      @while(
        @moveTo(x: -100, speed: 200)
        @sequence(
          @async @placeSquad(Game.Scripts.Stage1BossBombRaid,
            options:
              location: @location()
              armed: no
          )
          @wait 500
        )
      )
      => @entity.flipX()
      @while(
        @moveTo(x: 1.0, speed: 200)
        @sequence(
          @async @placeSquad(Game.Scripts.Stage1BossBombRaid,
            options:
              location: @location()
              armed: armed
          )
          @wait 500
        )
      )
      @moveTo(x: 1.2, speed: 200)
      => @entity.unflipX()
      @moveTo(x: .85, y: .41, speed: 200)
      => @entity.invincible = no
    )

  fase2: ->
    # start at 345000
    @bindSequence 'Hit', @fase3, => @entity.health < 330000

    @sequence(
      @setSpeed 50
      @bombRaid(yes)
      @repeat @sequence(
        @repeat 3, @attackCycle(7)
        @laugh()
        @async @placeSquad(Game.Scripts.Stage1BossDroneRaid,
          amount: 4
          delay: 300
          options:
            shootOnSight: yes
        )
        @laugh()
      )
    )

  laugh: ->
    @sequence(
      => @entity.invincible = yes
      @repeat 5, @sequence(
        @rotate(10, 200)
        @rotate(-10, 200)
      )
      @rotate(0, 200)
      => @entity.invincible = no
    )

  fase3: ->
    # start at 330000
    @bindSequence 'Hit', @fase4, => @entity.health < 310000

    @sequence(
      @setSpeed 50
      @bombRaid(yes)
      @attackCycle3(6)
    )

  fase4: ->
    @sequence(
      @drop(location: @location(), item: 'diagonals')
      @while(
        @moveTo(x: 1.15, y: .21, speed: 50)
        @sequence(
          @explosion(@location())
          @wait 700
        )
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
      speed: 200
      pointsOnHit: 0
      pointsOnDestroy: 0
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @pickTarget('PlayerControlledShip')
      @moveTo(y: 1.1)
      => @entity.attr(z: 0)
      @moveTo(@targetLocation(), y: 1.01)
      @moveTo(@targetLocation(x: null))
      @animate 'open'
      @wait 200
      @animate 'blink', -1
      @wait 1000
      @parallel(
        @screenShake(10, duration: 200)
        @explosion(@location(), damage: 200, radius: 40)
      )
    )

  onKilled: ->
    @parallel(
      @screenShake(10, duration: 200)
      @explosion(@location(), damage: 200, radius: 40)
    )


class Game.Scripts.Stage1BossRocket extends Game.EntityScript
  spawn: (options) ->
    options = _.defaults(options,
      pointsOHit: 125
      pointsOnDestroy: 50
    )
    return null unless options.location?

    location = options.location?()
    return null unless location

    Crafty.e('Rocket').rocket(
      health: 250
      x: location.x - 30
      y: location.y - 8 + Math.round(Math.random() * 15)
      z: 0
      speed: 600
      pointsOnHit: options.pointsOnHit
      pointsOnDestroy: options.pointsOnDestroy
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @moveTo(x: -205)

  onKilled: ->
    @parallel(
      @screenShake(10, duration: 200)
      @explosion(@location(), damage: 200, radius: 40)
    )

class Game.Scripts.Stage1BossHomingRocket extends Game.EntityScript
  spawn: (options) ->
    options = _.defaults(options,
      pointsOHit: 125
      pointsOnDestroy: 50
    )
    return null unless options.location?

    location = options.location?()
    return null unless location

    Crafty.e('Rocket').rocket(
      health: 250
      x: location.x - 30
      y: location.y - 8 + Math.round(Math.random() * 15)
      z: 0
      speed: 600
      pointsOnHit: options.pointsOnHit
      pointsOnDestroy: options.pointsOnDestroy
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @pickTarget('PlayerControlledShip')
      @movePath [
        @targetLocation()
        [-160, .5]
      ]
    )

  onKilled: ->
    @parallel(
      @screenShake(10, duration: 200)
      @explosion(@location(), damage: 200, radius: 40)
    )

class Game.Scripts.Stage1BossPopup extends Game.EntityScript
  assets: ->
    @loadAssets('largeDrone')

  spawn: ->
    Crafty.e('LargeDrone').drone(
      health: 264000
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .5
      speed: 150
    )

  execute: ->
    @bindSequence 'Hit', @leaveScreen, => @entity.health < 255000
    @inventoryAdd 'item', 'xp', ->
      Crafty.e('PowerUp').powerUp(contains: 'xp', marking: 'X')

    @sequence(
      @animate 'slow', -1, 'eye'
      @pickTarget('PlayerControlledShip')
      @moveTo(@targetLocation(), x: .845, 200)
      @attackCycle()
    )

  leaveScreen: ->
    @sequence(
      @drop(location: @location(), item: 'xp')
      @while(
        @moveTo(x: 1.15, speed: 100)
        @sequence(
          @explosion(@location())
          @wait 700
        )
      )
    )

  attackCycle: ->
    @repeat @sequence(
      @async @placeSquad(Game.Scripts.Stage1BossRocket,
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

class Game.Scripts.Stage1BossLeaving extends Game.EntityScript
  assets: ->
    @loadAssets 'largeDrone'

  spawn: ->
    Crafty.e('LargeDrone, Horizon').drone(
      health: 264000
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .5
      speed: 150
    )

  execute: ->
    @inventoryAdd 'item', 'lasers', ->
      Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L').color('#8080FF')
    @entity.colorDesaturation Game.backgroundColor

    @sequence(
      @animate 'slow', -1, 'eye'
      @pickTarget('PlayerControlledShip')
      @moveTo(@targetLocation(), x: .845, speed: 200)
      @attackCycle()
      @laugh()
      @leaveScreen()
    )

  laugh: ->
    @sequence(
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
      => @entity.eye.destroy() # TODO: This is buggy when scaling enemy
      @sendToBackground(0.9, -100)
      @parallel(
        @moveTo(x: -.15, speed: 400)
        @scale(0.7, duration: 3000)
      )
      => @entity.flip('X')
      @sendToBackground(0.7, -550)
      @parallel(
        @moveTo('MiliBase', speed: 150)
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
        @moveTo(@targetLocation(offsetY: -20), x: .845)
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
      speed: 400
      pointsOnHit: 10
      pointsOnDestroy: 20
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    if @armed
      @sequence(
        @animate('blink', -1)
        @moveTo(y: .3 + (Math.random() * .6))
        @wait(150)
        @onKilled()
      )
    else
      @sequence(
        @moveTo(y: 1.2)
      )

  onKilled: ->
    @parallel(
      @screenShake(10, duration: 200)
      @explosion(@location(), damage: 300, radius: 40)
    )


class Game.Scripts.Stage1BossDroneRaid extends Game.EntityScript
  assets: ->
    @loadAssets('drone')

  spawn: (options) ->
    d = Crafty.e('Drone').drone(
      health: 200
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .1
      speed: 500
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
        @targetLocation()
        [-160, .5]
      ]
    )

  onKilled: ->
    @explosion(@location())

