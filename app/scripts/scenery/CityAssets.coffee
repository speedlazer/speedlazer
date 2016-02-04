
# Import
generator = @Game.levelGenerator

generator.defineAssets(
  'drone-mine'
  contents: ['drone', 'mine']
  spriteMap: 'drone.png'
  sprites:
    drone:
      tile: 80
      tileh: 80
      map:
        standardDrone: [0,0]
      paddingX: 1
    mine:
      tile: 25
      tileh: 25
      map:
        standardMine: [0,3]
      paddingY: 2
      paddingX: 1
)

generator.defineAssets(
  'general'
  contents: ['cloud', 'shadow', 'rocket']
  spriteMap: 'general.png'
  sprites:
    all:
      tile: 1
      tileh: 1
      map:
        shadow: [1, 18, 35, 20]
        standardRocket: [1, 1, 45, 15]
        cloud: [48, 0, 250, 100]
)

generator.defineAssets(
  'sun'
  contents: ['sun']
  spriteMap: 'sun.png'
  sprites:
    all:
      tile: 1
      tileh: 1
      map:
        sun: [0,0,35,35]
        directGlare: [0,81,175,175]
        redGlare: [0,36,10,10]
        blueGlare: [120, 0, 80, 80]
        bigGlare: [0, 256, 200, 200]
)

generator.defineAssets(
  'helicopter'
  contents: ['helicopter']
  spriteMap: 'camera-helicopter.png'
  sprites:
    all:
      tile: 120
      tileh: 50
      map:
        cameraHelicopter: [0,0]
      paddingX: 1
)

generator.defineAssets(
  'largeDrone'
  contents: ['largeDrone']
  spriteMap: 'large-drone.png'
  sprites:
    body:
      tile: 90
      tileh: 70
      map:
        standardLargeDrone: [0,0]
        damage1LargeDrone: [1,0]
        damage2LargeDrone: [2,0]
        damage3LargeDrone: [3,0]
      paddingX: 1
    eye:
      tile: 20
      tileh: 26
      map:
        eyeStart: [0,3]
      paddingX: 1
      paddingY: 1
    wing:
      tile: 46
      tileh: 21
      map:
        wingLoaded: [5,4]
      paddingX: 1
      paddingY: 0

)

generator.defineAssets(
  'explosion'
  contents: ['explosion']
  spriteMap: 'explosion.png'
  sprites:
    all:
      tile: 64
      tileh: 64
      map:
        explosionStart: [0, 0]
)
