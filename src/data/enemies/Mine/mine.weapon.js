export default {
  "mine.blast": {
    spawnRhythm: {
      maxBursts: 1,
      initialDelay: 1,
      burst: 1,
      shotDelay: 0,
      burstDelay: 0,
      spawns: [
        ["explosion", {}],
        ["bullet", { angleRange: { from: 45, to: 405, step: 45 } }]
      ]
    },
    spawnables: {
      explosion: {
        spawnPosition: [0.5, 0.5],
        velocity: [0, 0],
        composition: "weapons.largeExplosion",
        emitDamage: [
          {
            targets: ["Mine", "PlayerShip"],
            velocity: -1000,
            accelleration: 50,
            upperBounds: 0,
            speed: 1200,
            affects: ["health"],
            duration: 100,
            name: "Explosion"
          }
        ],
        queue: [{ duration: 100, audio: "explosion" }, { duration: 2000 }]
      },
      bullet: {
        spawnPosition: [0, 0.5],
        velocity: 100,
        composition: "weapons.bullet",
        damage: [
          {
            velocity: [-3e3, -20e3],
            affects: "health",
            duration: [2, 4],
            name: "Laser"
          }
        ],
        queue: [
          { cleanOutOfScreen: true },
          { duration: 500, velocity: 500 },
          { duration: 11000 }
        ],
        collisions: {
          PlayerShip: {
            spawns: [["spark", {}]]
          }
        }
      },
      spark: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.solidHit",
        queue: [{ duration: 100 }]
      }
    }
  },
  "mine.explosion": {
    spawnRhythm: {
      maxBursts: 1,
      initialDelay: 1,
      burst: 1,
      shotDelay: 0,
      burstDelay: 0,
      spawns: [["explosion", {}]]
    },
    spawnables: {
      explosion: {
        spawnPosition: [0.5, 0.5],
        velocity: [0, 0],
        composition: "weapons.largeExplosion",
        emitDamage: [
          {
            targets: ["Mine", "PlayerShip"],
            velocity: -1000,
            accelleration: 50,
            upperBounds: 0,
            speed: 1200,
            affects: ["health"],
            duration: 100,
            name: "Explosion"
          }
        ],
        queue: [{ duration: 100, audio: "explosion" }, { duration: 2000 }]
      }
    }
  }
};
