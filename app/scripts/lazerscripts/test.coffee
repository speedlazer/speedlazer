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
      @testEnemy(1)
      @testEnemy(3)
    )

  testEnemy: (amount) ->
    @placeSquad Game.Scripts.EnemyTestScript,
      amount: amount
      delay: 2500
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
      @setLocation x: .5, y: .5
      @wait 2000
      => @entity.flipX()
      @wait 2000
      @moveTo x: 1.1, y: .5

      => @entity.unflipX()
      @movePath [
        [.5, .21]
        [.156, .5]
        [.5, .833]
        [.86, .52]
        [-100, .21]
      ]
    )


Crafty.c 'EnemyPart',
  autoAdjustSize: ->
    w = @w // 32
    h = @h // 32

    tz = 16
    @attr w: w * tz, h: h * tz

Crafty.c 'NewEnemyNameHere',
  init: ->
    @requires 'Enemy, droneBody, EnemyPart'
    @parts = {}

  initEnemy: (attr = {}) ->
    @attr _.defaults(attr,
      health: 200
      speed: 100
    )
    @autoAdjustSize()

    @definePart 'tfWing', 'droneTopFrontWing', 30, -3, 1
    @parts['tfWing'].origin 5, 10

    @definePart 'tbWing', 'droneTopBackWing', 15, -1, -1
    @definePart 'bfWing', 'droneBottomFrontWing', 30, 15, 1
    @definePart 'bbWing', 'droneBottomBackWing', 20, 15, -1
    @definePart 'blades', 'droneRotorBlades', 20, 3, 2
    @parts['blades'].origin 'center'

    @origin 'center'
    @attr weaponOrigin: [2, 25]
    @enemy()
    this

  definePart: (id, sprite, x, y, z) ->
    ent = Crafty.e('WebGL, EnemyPart').addComponent(sprite)
    @parts[id] = ent
    ent.autoAdjustSize()
    ent.attr(
      x: @x + x
      y: @y + y
      z: @z + z
    )
    @attach ent

  updateMovementVisuals: (rotation, dx, dy, dt) ->
    speed = Math.abs((1000 / dt) * dx)

    if dx > 0
      @flipX()
    else
      @unflipX()

    @updateBladeRotation rotation, dx
    @updateWingRotation speed, dx

  updateBladeRotation: (rotation, dx) ->
    if dx > 0
      rotation += 180
    rotation = (360 + rotation) % 360

    # rotate slowly
    if rotation < 180
      rotation /= 2
    else
      rotation = ((rotation - 360) / 2) + 360
    @parts['blades'].rotation = - rotation

  updateWingRotation: (speed, dx) ->
    m = if dx > 0 then -1 else 1
    # Range -20 .. 0 .. 25
    @parts['tfWing'].rotation = @wingRotation(speed, -20, 25) * m

  wingRotation: (speed, min, max) ->
    if speed < @speed
      ((@speed - speed) / @speed) * -20
    else
      maxSpeed = @speed * 2
      ((maxSpeed - @speed) / maxSpeed) * 25

Game.levelGenerator.defineAssets(
  'newAwesomeSpriteSheet'
  contents: ['newEnemyNameHere']
  spriteMap: 'high-drone.png'
  sprites:
    newEnemyNameHere:
      tile: 32
      tileh: 32
      map:
        droneBody: [0,0,3,2]
        droneTopFrontWing: [3, 0, 2, 1]
        droneBottomFrontWing: [3, 1, 2, 1]
        droneBottomBackWing: [2, 2, 2, 1]
        droneTopBackWing: [4, 2, 2, 1]
        droneRotorBlades: [0, 2, 2, 1]
)

