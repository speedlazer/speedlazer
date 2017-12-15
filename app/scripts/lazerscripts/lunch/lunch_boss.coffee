Game = require('src/scripts/game')
Game.Scripts ||= {}

class Game.Scripts.LunchBoss extends Game.EntityScript
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

class Game.Scripts.LunchBossStage1 extends Game.Scripts.LunchBoss
  spawn: ->
    Crafty.e('LargeDrone, Horizon').drone(
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .35
      defaultSpeed: 100
      health: 45000
      pointsOnHit: 10
    )

  execute: ->
    @bindSequence 'Hit', @fase2, => @entity.healthBelow .8

    @sequence(
      @setScenery('UnderBridge')
      @invincible yes
      @animate 'slow', -1, 'eye'
      @disableWeapons()

      @moveTo(x: .75, y: .41)

      @say('Drone Commander', 'We have control now! You will suffer!')
      @say('Drone Commander', 'Earths defences are in our hands!')
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
      @moveTo(y: .43, speed: 50)
      @repeat @attackCycle(25)
    )

  attackCycle: (speed) ->
    @sequence(
      @async @runScript(Game.Scripts.Stage1BossMine, @location())
      @moveTo(y: .36, easing: 'easeInOutQuad', speed: speed)
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
      @moveTo(y: .58, easing: 'easeInOutQuad', speed: speed)
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

  fase2: ->
    @bindSequence 'Hit', @fase3, => @entity.healthBelow .5

    @sequence(
      @setSpeed 75
      @bombRaid(yes)
      @repeat @sequence(
        @repeat 3, @attackCycle(50)
        @laugh()
        @async @placeSquad(Game.Scripts.Stage1BossDroneRaid,
          amount: 6
          delay: 300
          options:
            shootOnSight: yes
        )
        @laugh()
      )
    )

  fase3: ->
    @bindSequence 'Hit', @dramaDeath, => @entity.healthBelow .2

    @sequence(
      @setSpeed 150
      @bombRaid(yes)
      @parallel(
        @sequence(
          @setScenery 'Skyline'
          @gainHeight(300, duration: 4000)
        )
        @repeat @sequence(
          @repeat 2, @attackCycleAir()
          @airBashAttack()
        )
      )
    )

  attackCycleAir: ->
    @repeat 5, @sequence(
      @async @placeSquad(Game.Scripts.Stage1BossHomingRocket,
        options:
          z: 5
          offsetY: 100
          location: @location()
      )
      @animate 'emptyWing', 0, 'wing'
      @async @placeSquad(Game.Scripts.Stage1BossHomingRocket,
        options:
          z: -5
          offsetY: -100
          location: @location()
      )
      @parallel(
        @moveTo(@targetLocation(offsetY: -20), x: .845)
        @sequence(
          @animate 'reload', 0, 'wing'
          @wait 1000
        )
      )
    )

  airBashAttack: ->
    @sequence(
      @moveTo(y: .5, x: 0.95, speed: 100, 'easeInOutQuad')

      @async @placeSquad(Game.Scripts.LunchBossMineField,
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
      @async @placeSquad(Game.Scripts.LunchBossMineField,
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
      @invincible yes
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
      @turnAround()
      @sendToBackground(0.7, -150)
      @while(
        @moveTo(x: 1.1, speed: 300)
        @smoke('light')
      )
      @invincible no
      @turnAround()
      @scale(1.0, duration: 0)
      @reveal()
      @moveTo(x: .85, y: .41, speed: 200)
    )

  dramaDeath: ->
    @sequence(
      => @entity.colorOverride '#FF8080'
      @invincible yes
      @parallel(
        @gainHeight(300, duration: 4000)
        @say 'Drone Commander', 'You will never stop us!!'
        @while(
          @moveTo(x: .5, y: .4, speed: 100)
          @sequence(
            @smallExplosion()
            @while(
              @wait 300
              @smoke()
            )
          )
        )
      )
      @bigExplosion()
      @wait 50
      @bigExplosion()
      @bigExplosion()
      @wait 500
      => Crafty('RiggedExplosion').trigger('BigExplosion')
      @explosionBurst(100)
      @bigExplosion()
      @explosionBurst(200)
      @bigExplosion()
      @explosionBurst(300)
      @explosionBurst(30)
      => @entity.colorOverride '#403030'
      @parallel(
        @moveTo(y: 1.1, speed: 300, easing: 'easeInOutQuad')
        @rotate 180, 1000
      )
    )

  explosionBurst: (offset) ->
    @parallel(
      @bigExplosion(offsetX: offset, offsetY: offset)
      @bigExplosion(offsetX: -offset, offsetY: offset)
      @bigExplosion(offsetX: offset, offsetY: -offset)
      @bigExplosion(offsetX: -offset, offsetY: -offset)
    )

  laugh: ->
    @sequence(
      => Crafty.audio.play('laugh')
      @repeat 5, @sequence(
        @rotate(10, 200)
        @rotate(-10, 200)
      )
      @rotate(0, 200)
    )

  bombRaid: (armed = no) ->
    @sequence(
      @invincible yes
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
      @turnAround()
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
      @turnAround()
      @moveTo(x: .85, y: .41, speed: 200)
      @invincible no
    )


class Game.Scripts.LunchBossMineField extends Game.EntityScript
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
        => @entity.absorbDamage @entity.health
        => Crafty('RiggedExplosion').trigger('BigExplosion') if @index == 0
        @endSequence()
      )
    )

  onKilled: ->
    @bigExplosion(juice: @juice)

