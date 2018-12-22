levelGenerator = require('src/lib/LevelGenerator').default

cityEnemies = require('src/images/city-enemies.png')
cityEnemiesMap = require('src/images/city-enemies.map.json')
explosion = require('src/images/explosion.png')
portraits = require('src/images/portraits.png')

explosionAudio = require('src/audio/explosion.ogg')
laserHitAudio = require('src/audio/laser-hit.ogg')
laserShotAudio = require('src/audio/laser-shot.ogg')
laughAudio = require('src/audio/laugh.ogg')
powerupAudio = require('src/audio/powerup.ogg')

levelGenerator.defineAssets(
  'explosion'
  contents: ['explosion']
  spriteMap: explosion
  sprites:
    all:
      tile: 96
      tileh: 96
      map:
        explosionStart: [0, 0]
  audio:
    explosion: [explosionAudio]
    shoot: [laserShotAudio]
    hit: [laserHitAudio]
    powerup: [powerupAudio]
    laugh: [laughAudio]
)
levelGenerator.defineAssets(
  'player'
  contents: [
    'playerShip'
    'shipEngineFire'
    'mine'
    'drone'
    'rocket'
    'helicopter'
    'largeDrone'
    'laserTank'
  ]
  spriteMap: cityEnemies
  sprites:
    all: cityEnemiesMap
)
levelGenerator.defineAssets(
  'portraits'
  contents: [
    'general'
  ]
  spriteMap: portraits
  sprites:
    all:
      tile: 32
      tileh: 32
      map:
        pGeneral: [0, 0, 4, 4]
        pPilot: [0, 4, 4, 4]
)
