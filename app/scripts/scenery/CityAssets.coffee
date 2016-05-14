
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
    'playerShip'
    'shipEngineFire'
    'mine'
    'drone'
    'rocket'
    'helicopter'
    'largeDrone'
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
        cameraHelicopter: [0, 6, 4, 2]
        standardLargeDrone: [0, 8, 3, 3]
        eyeStart: [6, 0, 1, 1]
        wingLoaded: [12, 2, 2, 1]
)

