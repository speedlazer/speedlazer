export default {
  "largeDrone.takeover": {
    spawnRhythm: {
      maxBursts: 1,
      initialDelay: 10,
      burst: 2,
      shotDelay: 200,
      burstDelay: 8000,
      spawns: [
        ["bullet", {}],
        ["muzzleFlash", {}]
      ]
    },
    spawnables: {
      bullet: {
        spawnPosition: [0, 0.5],
        velocity: 400,
        composition: "weapons.sphere",
        damage: [
          {
            velocity: [-20e3, -30e3],
            affects: "health",
            duration: [2, 4],
            name: "Laser"
          }
        ],
        queue: [
          { cleanOutOfScreen: true },
          { aimOnTarget: true, duration: 0 },
          { duration: 4000 }
        ],
        collisions: {
          IntroHeliBackground: {
            spawns: [
              ["sparks", {}],
              ["sparkHit", {}]
            ]
          }
        }
      },
      muzzleFlash: {
        spawnPosition: [0, 0.5],
        attached: true,
        velocity: 0,
        composition: "weapons.muzzleFlash",
        queue: [{ duration: 400, audio: "laser-shot" }]
      },
      sparks: {
        spawnPosition: "outside",
        velocity: 0,
        particles: "sparks",
        queue: [{ duration: 500 }]
      },
      sparkHit: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.solidHit",
        queue: [{ duration: 100, audio: "laser-hit" }]
      }
    }
  },
  "largeDrone.rockets": {
    spawnRhythm: {
      initialDelay: 500,
      burst: 16,
      shotDelay: 10,
      burstDelay: 1000,
      shot: [
        { spawn: true, duration: 100 },
        { state: "fireRocket", duration: 200 },
        { duration: 20 },
        { state: "reloadRocket", duration: 300 }
      ],
      spawns: [["rocket", { angle: 0, autoRotate: false }]]
    },
    spawnables: {
      rocket: {
        spawnPosition: [0, 0.5],
        velocity: 250,
        entity: "HeliRocket",
        damage: [
          {
            velocity: [-10e3, -30e3],
            affects: "health",
            duration: [4, 8],
            name: "Blast"
          }
        ],
        queue: [
          { cleanOutOfScreen: true },
          { velocity: [450, 500] },
          { duration: 4000 },
          { collide: "PlayerShip" }
        ],
        collisions: {
          PlayerShip: {
            state: "hide",
            spawns: [["hit", {}]]
          },
          GravityLiquid: {
            state: "waterHit",
            spawns: [["hit", {}]]
          }
        }
      },
      hit: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.explosion",
        queue: [{ duration: 100, audio: "explosion" }, { duration: 2000 }]
      }
    }
  },
  "largeDrone.homingRocket": {
    spawnRhythm: {
      initialDelay: 1000,
      burst: 3,
      shotDelay: 500,
      burstDelay: 1000,
      shot: [
        { spawn: true, duration: 100 },
        { state: "fireRocket", duration: 200 },
        { duration: 1000 },
        { state: "reloadRocket", duration: 1500 }
      ],
      spawns: [
        ["rocket", { angle: -90, autoRotate: false }],
        ["rocket", { angle: 90, autoRotate: false }],
        ["wideRocket", { angle: -120, autoRotate: false }],
        ["wideRocket", { angle: 120, autoRotate: false }]
      ]
    },
    spawnables: {
      rocket: {
        spawnPosition: [0, 0.5],
        velocity: 250,
        entity: "HeliRocket",
        damage: [
          {
            velocity: [-10e3, -30e3],
            affects: "health",
            duration: [4, 8],
            name: "Blast"
          }
        ],
        queue: [
          { duration: 220 },
          { velocity: 0, angle: 0, autoRotate: true },
          { duration: 500 },
          { velocity: [450, 500], steering: 180, sight: 360 },
          { duration: 3000 },
          { collide: "PlayerShip" }
        ],
        collisions: {
          PlayerShip: {
            state: "hide",
            spawns: [["hit", {}]]
          },
          GravityLiquid: {
            state: "waterHit",
            spawns: [["hit", {}]]
          }
        }
      },
      wideRocket: {
        spawnPosition: [0, 0.5],
        velocity: 250,
        entity: "HeliRocket",
        damage: [
          {
            velocity: [-10e3, -30e3],
            affects: "health",
            duration: [4, 8],
            name: "Blast"
          }
        ],
        queue: [
          { cleanOutOfScreen: true },
          { duration: 550 },
          { velocity: 0, angle: 0 },
          { duration: 170 },
          { velocity: [450, 500] },
          { duration: 4000 },
          { collide: "PlayerShip" }
        ],
        collisions: {
          PlayerShip: {
            state: "hide",
            spawns: [["hit", {}]]
          },
          GravityLiquid: {
            state: "waterHit",
            spawns: [["hit", {}]]
          }
        }
      },
      hit: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.explosion",
        queue: [{ duration: 100, audio: "explosion" }, { duration: 2000 }]
      }
    }
  }
};
