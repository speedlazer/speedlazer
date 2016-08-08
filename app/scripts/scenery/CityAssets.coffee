
# Import
generator = @Game.levelGenerator

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
        muzzleFlash: [10, 0, 1, 1]
        shipEngineFire: [3, 0, 3, 1]
        freddie: [3, 1, 3, 2]
        standardMine: [3, 3, 1, 1]
        standardDrone: [0, 4, 2, 2]
        standardRocket: [4, 4, 2, 1]
        helicopter: [0, 6, 4, 2]
        heliDamaged: [8, 6, 4, 2]
        standardLargeDrone: [0, 8, 3, 3]
        eyeStart: [6, 0, 1, 1]
        wingLoaded: [12, 2, 2, 1]
)

