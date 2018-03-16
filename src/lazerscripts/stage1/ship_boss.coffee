{ EntityScript } = require('src/lib/LazerScript')
{ MineCannonInActive, MineCannonActive } = require('./mine_cannon')
{ DroneShipCore } = require('./drone_ship_core');
{ TurretInActive, TurretActive } = require('./turret')
{ Swirler, Shooter, CrewShooters, Stalker, ScraperFlyer, DroneFlyer } = require('../stage1/army_drone')
{ HeliInactive, HeliFlyAway, HeliAttack } = require('./heli_attack')

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
      item.reveal()
      return item
    Crafty.e('FirstShipCabin, KeepAlive')
      .shipCabin()
      .sendToBackground(1.0, -8)

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
    Crafty.e('SecondShipCabin, KeepAlive')
      .shipCabin()
      .sendToBackground(1.0, -8)

  execute: ->
    @invincible yes

class Cabin2Active extends EntityScript
  spawn: (options) ->
    item = Crafty('SecondShipCabin').get(0)
    if item and item.health > 10
      item.reveal()
      return item
    Crafty.e('SecondShipCabin, KeepAlive')
      .shipCabin()
      .sendToBackground(1.0, -8)

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
      @wait(20000)
    )

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
    return Math.round(Math.random() * 5)

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
          # TODO: Reveal core / add explosions / smoke

          @async @placeSquad DroneShipCore,
            options:
              attach: 'DroneShipCorePlace'
        )
        @lazy(
          @popupCannon
          -> Math.floor(Math.random() * 3)
        )
      )
    )

  executeStageThree: ->
    @sequence(
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
      @moveTo(x: 0.1, easing: "easeInOutQuad")
      @while(
        @placeSquad Cabin1Active,
          options:
            attach: 'Cabin1Place'
        @lazy(
          @releaseDronesFromHatchOne
        )
      )
    )

  executeStageFive: ->
    @sequence(
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
        @moveTo(x: -0.5, easing: "easeInOutQuad", speed: 130)
      )
    )

  executeStageSix: ->
    @sequence(
      @parallel(
        @while(
          @placeSquad Cabin2Active,
            options:
              attach: 'Cabin2Place'
          @lazy(
            @releaseDronesFromHatchTwo,
            -> Math.round(Math.random() * 3 + 1)
          )
        )
      )
      @moveTo(x: -0.6, easing: "easeInOutQuad")
      @while(
        @sequence(
          @moveTo(y: 450, easing: "easeInOutQuad", speed: 20)
          @moveTo(x: -1.40, easing: "easeInOutQuad")
        )
        @sequence(
          @smallExplosion(offsetX: 600, offsetY: -50)
          @smallExplosion(offsetX: 500, offsetY: -20)
          @wait(300)
        )
      )
    )

  execute: ->
    # Start stage 1
    @sequence(
      @lazy @placeEnemiesOnShip
      @lazy @executeStageOne
      @lazy @executeStageTwo
      @lazy @executeStageThree
      #@lazy @executeStageFour
      #@lazy @executeStageFive
      #@lazy @executeStageSix
      @wait 30e3
    )

module.exports =
  default: ShipBoss
