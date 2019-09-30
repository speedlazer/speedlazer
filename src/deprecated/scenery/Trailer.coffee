levelGenerator = require('src/lib/LevelGenerator')
trailerScenery = require('src/images/dino.png')
trailerSceneryMap = require('src/images/dino.map.json')
LevelScenery = require('src/lib/LevelScenery').default

class TrailerScenery extends LevelScenery
  assets: ->
    sprites:
      "#{trailerScenery}": trailerSceneryMap

levelGenerator.defineElement 'jurassicGrass', ->
  h = 64
  @add(0, @level.visibleHeight - h, Crafty.e('2D, WebGL, SunBlock, ShipSolid, BulletSolid, Color').color('#1fb93c').attr({ w: 1024, h: h }))
  h = 160
  @add(0, @level.visibleHeight - h, Crafty.e('2D, WebGL, Color, SunBlock').color('#1fb93c').attr({ w: 1024, h: h, z: -10 }))

  h2 = 64
  @addBackground(
    0,
    @level.visibleHeight - h - h2,
    Crafty.e('2D, WebGL, Color, ColorEffects, Horizon')
      .color('#1fb93c')
      .colorDesaturation(Game.backgroundColor)
      .saturationGradient(1.0, .2)
      .attr({ w: 512, h: h2, z: -100 }),
    .5
  )

  @addBackground(
    0,
    @level.visibleHeight - h - h2 - h2,
    Crafty.e('2D, WebGL, Color, ColorEffects, Horizon')
      .color('#1fb93c')
      .colorDesaturation(Game.backgroundColor)
      .saturationGradient(.2, .2)
      .attr({ w: 256, h: h2, z: -200 }),
    .25
  )

levelGenerator.defineBlock class extends TrailerScenery
  name: 'Trailer.Dino'
  autoNext: 'Trailer.DinoWoods'
  delta:
    x: 10
    y: 0

  generate: ->
    super
    @addBackground(0, @level.visibleHeight - 500, Crafty.e('2D, WebGL, backgroundPlanet')
      .attr({ w: 256, h: 256, z: -400, alpha: 0.3 }),
        .01
    )

levelGenerator.defineBlock class extends TrailerScenery
  name: 'Trailer.DinoWoods'
  delta:
    x: 1024
    y: 0

  generate: ->
    super
    @addElement 'jurassicGrass'

    h = 576
    @add(50, @level.visibleHeight - h, Crafty.e('2D, WebGL, Color, SunBlock').color('#8e5605').attr({ w: 196, h: h - 128, z: -10 }))

    h = 576
    @add(550, @level.visibleHeight - h, Crafty.e('2D, WebGL, Color, SunBlock').color('#8e5605').attr({ w: 196, h: h - 128, z: -10 }))

levelGenerator.defineBlock class extends TrailerScenery
  name: 'Trailer.DinoVulcano'
  autoNext: 'Trailer.DinoPlains'
  delta:
    x: 1024
    y: 0

  generate: ->
    super
    @addElement 'jurassicGrass'

    h = 352
    @addBackground(
      250,
      @level.visibleHeight - h,
      Crafty.e('2D, WebGL, Color').color('#8e5605').attr({ w: 196, h: h - 256, z: -50 }),
      .25
    )

levelGenerator.defineBlock class extends TrailerScenery
  name: 'Trailer.DinoPlains'
  delta:
    x: 1024
    y: 0

  generate: ->
    super
    @addElement 'jurassicGrass'

