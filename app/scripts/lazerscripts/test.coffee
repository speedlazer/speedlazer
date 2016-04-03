Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Test extends Game.LazerScript
  assets: ->
    @loadAssets('playerShip')

  execute: ->
    @sequence(
      @setShipType('PlayerControlledCube')
      @setScenery 'OceanOld'
      @setSpeed 50
      @wait 3000
      @testEnemy(1)
      @testEnemy(3)
    )

  testEnemy: (amount) ->
    @placeSquad Game.Scripts.EnemyTestScript,
      amount: amount
      delay: 500
      options:
        entityName: 'NewEnemyNameHere'
        assetsName: 'newEnemyNameHere'

class Game.Scripts.EnemyTestScript extends Game.EntityScript
  assets: (options) ->
    @loadAssets(options.assetsName ? 'shadow')

  spawn: (options) ->
    enemy = Crafty.e(options.entityName).initEnemy(
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height / 2
    )

  execute: ->
    @sequence(
      @wait 2000
      @movePath [
        [.5, .21]
        [.156, .5]
        [.5, .833]
        [.86, .52]
        [-20, .21]
      ]
    )

Crafty.c 'NewEnemyNameHere',
  init: ->
    @requires 'Enemy, droneBody'

  initEnemy: (attr = {}) ->
    @attr _.defaults(attr,
      w: 60,
      h: 40,
      health: 200
      speed: 200
    )
    @origin 'center'
    @attr weaponOrigin: [2, 25]
    @enemy()
    this

Game.levelGenerator.defineAssets(
  'newAwesomeSpriteSheet'
  contents: ['newEnemyNameHere']
  spriteMap: 'high-drone.png'
  sprites:
    newEnemyNameHere:
      tile: 64
      tileh: 64
      map:
        droneBody: [0,0,3,2]
)

