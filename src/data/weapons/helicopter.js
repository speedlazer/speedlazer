export default {
  "heli.rocket": {
    spawnRhythm: {
      initialDelay: [3500, 2500],
      burst: 1,
      shotDelay: [500, 250],
      burstDelay: [3000, 2000],
      spawns: [["rocket", { angle: -90, autoRotate: false }]]
    },
    spawnables: {
      rocket: {
        spawnPosition: [0, 0.5],
        velocity: [400, 500],
        entity: "HeliRocket",
        damage: [
          {
            velocity: [-20e3, -30e3],
            affects: "health",
            duration: [4, 8],
            name: "Blast"
          }
        ],
        queue: [
          { duration: 130 },
          { velocity: 0, angle: 0, autoRotate: true },
          { duration: 500 },
          { velocity: [450, 500], steering: 110, sight: 25 },
          { duration: 6000 }
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
  "heli.gun": {
    aiming: {
      offsetAimAngle: -5,
      sight: 25,
      resetOnDeactivation: true,
      rotateSpeed: 60,
      range: [10, -50]
    },
    spawnRhythm: {
      initialDelay: [1500, 150],
      burst: [5, 9],
      shotDelay: [100, 60],
      burstDelay: [3000, 400],
      spawns: [
        ["bullet", {}],
        ["muzzleFlash", {}]
      ]
    },
    spawnables: {
      bullet: {
        spawnPosition: [0, 0.5],
        velocity: [350, 500],
        composition: "weapons.bullet",
        queue: [{ duration: 4000 }],
        damage: [
          {
            velocity: [-10e3, -15e3],
            affects: "health",
            duration: [2, 4],
            name: "Laser"
          }
        ],
        collisions: {
          PlayerShip: {
            spawns: [["spark", {}]]
          },
          WaterCollision: {
            spawns: [["splash", {}]]
          }
        }
      },
      muzzleFlash: {
        spawnPosition: [0, 0.5],
        attached: true,
        velocity: 0,
        composition: "weapons.muzzleFlash",
        queue: [{ duration: 400 }]
      },
      spark: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.solidHit",
        queue: [{ duration: 100, audio: "hit" }]
      },
      splash: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.waterHit",
        queue: [{ duration: 305 }]
      }
    }
  }
};
