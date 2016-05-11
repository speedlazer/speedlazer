
# Import
generator = @Game.levelGenerator

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
      tile: 96
      tileh: 96
      map:
        explosionStart: [0, 0]
  audio:
    explosion: ['explosion.ogg']
    shoot: ['laser-shot.ogg']
    hit: ['laser-hit.ogg']
    powerup: ['powerup.ogg']
    laugh: ['laugh.ogg']
)
generator.defineAssets(
  'player'
  contents: [
    'playerShip',
    'shipEngineFire',
    'mine',
    'drone',
    'rocket'
  ]
  spriteMap: 'city-enemies.png'
  sprites:
    all:
      tile: 32
      tileh: 32
      map:
        playerShip: [0, 0, 3, 2]
        playerShipDamaged: [0, 2, 3, 2]
        shipEngineFire: [3, 0, 3, 1]
        freddie: [3, 1, 3, 2]
        standardMine: [3, 3, 1, 1]
        standardDrone: [0, 4, 2, 2]
        standardRocket: [4, 4, 2, 1]
)
