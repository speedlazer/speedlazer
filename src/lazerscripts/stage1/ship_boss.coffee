{ EntityScript } = require('src/lib/LazerScript')
{ MineCannonInActive, MineCannonActive } = require('./mine_cannon')
{ DroneShipCore, DroneShipCoreInactive } = require('./drone_ship_core')
{ TurretInActive, TurretActive } = require('./turret')
{ Swirler, Shooter, CrewShooters, Stalker, ScraperFlyer, DroneFlyer } = require('../stage1/army_drone')
{ HeliInactive, HeliFlyAway, HeliAttack } = require('./heli_attack')
{ lookup } = require('src/lib/random')
JumpMine    = require('../stage1/jump_mine').default

class Cabin1Inactive extends EntityScript
  spawn: (options) ->
    Crafty.e('FirstShipCabin, KeepAlive')
      .shipCabin()
      .sendToBackground(1.0, -8)

  execute: ->
    @invincible yes

class Cabin1Active extends EntityScript
  spawn: (options) ->
    item = Crafty('FirstShipCabin').get(0)
    if item and item.health > 10
      item.attr({ hidden: false })
      return item
    Crafty.e('FirstShipCabin, KeepAlive')
      .shipCabin()
      .attr({ hidden: true })

  onKilled: ->
    @deathDecoy()

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @invincible no
      @wait(20000)
    )

class Cabin2Inactive extends EntityScript
  spawn: (options) ->
    entity = Crafty('SecondShipCabin').get(0) || Crafty.e('SecondShipCabin, KeepAlive').shipCabin()
    entity
      .attr({ hidden: true })
      .displayState(options.status == 'open')

  execute: ->
    @invincible yes

class Cabin2Active extends EntityScript
  spawn: (options) ->
    item = Crafty('SecondShipCabin').get(0)
    if item and item.health > 10
      item
        .displayState(options.status == 'open')
        .attr({ hidden: false })
      return item
    Crafty.e('SecondShipCabin, KeepAlive')
      .shipCabin()
      .displayState(options.status == 'open')

  onKilled: ->
    @sequence(
      @deathDecoy()
      @bigExplosion(offsetX: 40, offsetY: -200)
      @wait 200
      @bigExplosion(offsetX: 50, offsetY: -300)
      @wait 200
      @bigExplosion(offsetX: 150, offsetY: -100)
      @wait 200
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @invincible no
      @repeat(
        @wait(500)
      )
    )

class Cabin2Destroyed extends EntityScript
  spawn: (options) ->
    Crafty.e('SecondShipCabinDestroyed, KeepAlive')
      .shipCabin()
      .attr({ hidden: true })

  execute: ->
    @invincible yes


class ShipBoss extends EntityScript

  spawn: (options) ->
    Crafty.e('BattleShip').attr(
      x: Crafty.viewport.width + 180
      y: 400
      defaultSpeed: options.speed ? 85
    ).ship()
    # .setSealevel(@level.visibleHeight - 10)

  getPath: (pattern) ->
    return [
      [.156, .5]
      [.5, .833]
      [.86, .52]

      [.5, .21]
      [.156, .5]
      [.5, .833]
      [.86, .52]

      [-20, .21]
    ]

  randomAmountSpawnedDrones: ->
    return Math.round(lookup() * 5)

  placeEnemiesOnShip: ->
    @sequence(
      @async @placeSquad TurretActive,
        options:
          health: 40000
          label: 'Turret1'
          attach: 'HatchFloor1'
          onHatch: true
          attachDx: 90
      @async @placeSquad TurretActive,
        options:
          health: 40000
          label: 'Turret2'
          attach: 'HatchFloor2'
          onHatch: true
          attachDx: 90
      @async @placeSquad TurretActive,
        options:
          health: 40000
          label: 'Turret3'
          attach: 'HatchFloor3'
          onHatch: true
          attachDx: 90

      @placeSquad Cabin1Inactive,
        options:
          attach: 'Cabin1Place'
      @placeSquad Cabin2Inactive,
        options:
          attach: 'Cabin2Place'
          status: 'closed'
      @placeSquad HeliInactive,
        amount: 2
        delay: 0
        options:
          attach: 'HeliPlace'

      @action 'deactivateCannon', 0
      @action 'deactivateCannon', 1
      @action 'deactivateCannon', 2
    )

  executeStageOne: ->
    @sequence(
      @moveTo(x: 0.8, easing: "easeInOutQuad")
    )

  releaseMinesFromShip: (index) ->
    @sequence(
      @wait(2000)
      @moveTo(y: 375, easing: "linear")
      @placeSquad JumpMine,
        amount: Math.floor(lookup() * 4) + 8
        delay: 100
        options:
          gridConfig:
            x:
              start: 0.2
              steps: 8
              stepSize: 0.10
            y:
              start: 0.125
              steps: 6
              stepSize: 0.10
          points: yes
          direction: 'bottom'
      @wait(1000)
      @moveTo(y: 400, easing: "linear")
    )

  releaseDronesFromHatchTwo: (dronePattern) ->
    @sequence(
      @action 'open', 1
      @wait(500)
      @parallel(
        @placeSquad DroneFlyer,
          amount: 8,
          delay: 500
          options:
            startAt: 'ShipHatch2'
            hatchReveal: 'ShipHatch2'
            dx: 25
            dy: 20
            debug: true,
            path: @getPath(dronePattern)
        @sequence(
          @wait(1200)
          @action 'close2'
        )
      )
    )

  popupCannon: (getIndex) ->
    index = getIndex()
    @sequence(
      @action 'open', index
      @wait(1000)
      @action 'activateCannon', index
      @wait(5000)
      @action 'deactivateCannon', index
      @wait(500)
      @action 'close', index
      @wait(500)
    )

  popupCannon2: (getIndex) ->
    index = getIndex()
    @parallel(
      @popupCannon(-> index)
      @popupCannon(-> (index + 1) % 3)
    )

  executeStageTwo: ->
    @sequence(
      @moveTo(x: -0.05, easing: "easeInOutQuad")

      @while(
        @sequence(
          @placeSquad Cabin2Active,
            options:
              attach: 'Cabin2Place'
          @placeSquad Cabin2Inactive,
            options:
              attach: 'Cabin2Place'
              status: 'open'

          @placeSquad DroneShipCoreInactive,
            options:
              attach: 'DroneShipCorePlace'
        )

        @lazy(
          @popupCannon
          -> Math.floor(lookup() * 3)
        )
      )
    )

  executeStageThree: ->
    @sequence(
      @lazy(
        @releaseMinesFromShip
        -> Math.floor(lookup() * 2)
      )
      @parallel(
        @moveTo(x: -0.2, easing: "easeInOutQuad")
        @placeSquad HeliFlyAway,
          amount: 2
          delay: 1000
      )
      @parallel(
        @placeSquad HeliAttack,
          options:
            speed: 80
            path: [
              [.9, .6]
              [.7, .45]
              [.55, .4]
              [.4, .6]
              [.6, .8]
              [.8, .6]
              [.4, .8]
              [.2, .4]
              [-.2, .7]
            ]
        @placeSquad HeliAttack,
          options:
            speed: 80
            path: [
              [.9, .3]
              [.7, .25]
              [.55, .2]
              [.4, .4]
              [.6, .3]
              [.8, .3]
              [.4, .6]
              [.2, .3]
              [-.2, .4]
            ]
        @moveTo(x: -0.05, easing: "easeInOutQuad", speed: 130)
      )
    )


  executeStageFour: ->
    @sequence(
      @lazy(
        @releaseMinesFromShip
        -> Math.floor(lookup() * 2)
      )
      @moveTo(x: -0.05, easing: "easeInOutQuad")

      @while(
        @sequence(
          @placeSquad DroneShipCore,
            options:
              attach: 'DroneShipCorePlace'
        )

        @lazy(
          @popupCannon2
          -> Math.floor(lookup() * 3)
        )
      )

    )

  explosions: ->
    a = lookup()
    b = lookup()
    c = lookup()
    @sequence(
      @smallExplosion(offsetX: 400 + (a * 300), offsetY: -50)
      @bigExplosion(offsetX: 200 + (b * 250), offsetY: -50)
      @smallExplosion(offsetX: 200 + (c * 350), offsetY: -20)
      @wait(100)
    )

  executeStageFive: ->
    # Blow up cabin of core
    # Move ship slowly backwards, releasing drones in the process
    # Destroy first cabin
    # -- six, sinking ship
    @wait(100)


  executeStageSix: ->
    @sequence(
      @moveTo(x: -0.6, easing: "easeInOutQuad")
      @while(
        @moveTo(y: 450, easing: "easeInOutQuad", speed: 20)
        @lazy(@explosions)
      )
      @moveTo(x: -1.40, easing: "easeInOutQuad", speed: 130)
    )

  execute: ->
    # Start stage 1
    @sequence(
      @lazy @placeEnemiesOnShip
      @lazy @executeStageOne
      @lazy @executeStageTwo
      @lazy @executeStageThree
      @lazy @executeStageFour
      @lazy @executeStageFive
      @lazy @executeStageSix
    )

module.exports = ShipBoss
