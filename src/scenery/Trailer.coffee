levelGenerator = require('src/lib/LevelGenerator').default
LevelScenery = require('src/lib/LevelScenery').default

levelGenerator.defineBlock class extends LevelScenery
  name: 'Trailer.Dino'
  delta:
    x: 1024
    y: 0

  generate: ->
    super

    h = 50
    @add(0, @level.visibleHeight - h, Crafty.e('2D, WebGL, ShipSolid, BulletSolid, Color').color('#1fb93c').attr({ w: 1024, h: h }))
    h = 170
    @add(0, @level.visibleHeight - h, Crafty.e('2D, WebGL, Color').color('#1fb93c').attr({ w: 1024, h: h, z: -10 }))


dinosaur = require('src/images/dino.png')

levelGenerator.defineAssets(
  'dino'
  contents: [
    'dinosaur'
  ]
  spriteMap: dinosaur
  sprites:
    all:
      tile: 32
      tileh: 32
      map:
        dinoHead: [0, 0, 3, 2]
        dinoBody: [3, 0, 5, 4]
        dinoArm: [1, 4, 2, 2]
        dinoNeck: [3, 4, 2, 2]
        dinoJaw: [0, 2, 3, 2]
        dinoTopLeg: [5, 4, 2, 2]
        dinoTail: [2, 6, 4, 2]
)
