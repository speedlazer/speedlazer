{ LazerScript, EntityScript } = require('src/lib/LazerScript')
{ StartOfDawn, Morning } = require('./stage1/sunrise')
{ Swirler, Shooter } = require('./stage1/army_drone')
{ Stage1BossRocketStrike } = require('./stage1/stage1boss')
ShipBoss = require('./benchmark/ship_boss').default
DroneShip   = require('./stage1/drone_ship').default

class SolidTest extends EntityScript
  spawn: ->
    Crafty.e('2D, WebGL, Color, ShipSolid, BulletSolid, Choreography')
      .attr(
        x: Crafty.viewport.width + 200
        y: Crafty.viewport.height * .3
        w: 40
        h: 200
        defaultSpeed: 150
      ).color('#808080')

  execute: ->
    @sequence(
      @moveTo x: 0.4
      @wait 15000
      @moveTo x: -0.2
    )

class Test extends LazerScript
  assets: ->
    @loadAssets('playerShip')

  execute: ->
    @inventoryAdd 'weapon', 'lasers', marking: 'L'
    @inventoryAdd 'ship', 'points', marking: 'P', icon: 'star'
    Crafty.e('DebugInfo')

    @sequence(
      #@setShipType('PlayerControlledCube')

      @setWeapons(['lasers'])
      @setSpeed 300
      @setScenery 'Ocean'
      #@panCamera(y: 120, 0)
      @async @runScript(Morning, speed: 1)
      @placeSquad DroneShip

      @wait 1500
      #@panCamera(y: -120, 4000)
      #@wait 1500
      #@placeSquad SolidTest
      @setScenery 'CoastStart'
      #@gainHeight 20, duration: 1000
      #@gainHeight 60, duration: 4000
      @placeSquad ShipBoss,
        options:
          speed: 100

      #@wait 10000
      #@gainHeight -80, duration: 4000
      @repeat(8, @waitingRocketStrike())
      @repeat(8, @sequence(
        @placeSquad(Swirler, {
          amount: 4,
          delay: 250,
          options: {
            shootOnSight: yes
          }
        }),
        @wait(2000)
      ))
      @repeat(8, @sequence(
        @placeSquad(Shooter, {
          amount: 4,
          delay: 250,
          options: {
            shootOnSight: yes
          }
        }),
        @wait(2000)
      ))
      @repeat(8, @sequence(
        @parallel(
          @placeSquad(Shooter, {
            amount: 4,
            delay: 250,
            options: {
              shootOnSight: yes
            }
          })
          @placeSquad(Swirler, {
            amount: 4,
            delay: 250,
            options: {
              shootOnSight: yes
            }
          })
        )
        @wait(2000)
      ))

    )

  waitingRocketStrike: ->
    @sequence(
      @placeSquad Stage1BossRocketStrike,
        amount: 6
        delay: 150
        options:
          gridConfig:
            x:
              start: 1.1
              steps: 1
              stepSize: 0.05
            y:
              start: 0.125
              steps: 12
              stepSize: 0.05
      @wait 200
    )

module.exports =
  default: Test
