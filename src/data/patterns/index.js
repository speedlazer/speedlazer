export default {
  "turret.bullet": {
    spawnRhythm: {
      initialDelay: [1500, 150],
      burst: [3, 9],
      shotDelay: [150, 90],
      burstDelay: [3000, 400]
    },
    spawnables: {
      bullet: {
        spawnPosition: [0, 0.5],
        velocity: [250, 300],
        composition: "weapons.bullet",
        queue: [{ duration: 4000 }],
        collisions: {
          SolidCollision: {
            spawns: [["spark", {}]]
          },
          WaterCollision: {
            spawns: [["splash", {}]]
          }
        }
      },
      muzzleFlash: {
        spawnPosition: [0, 0.5],
        velocity: 0,
        composition: "weapons.muzzleFlash",
        queue: [{ duration: 400 }]
      },
      spark: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.solidHit",
        queue: [{ duration: 100 }]
      },
      splash: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.waterHit",
        queue: [{ duration: 305 }]
      }
    },
    spawns: [["bullet", {}], ["muzzleFlash", {}]]
  },
  "turret.doubleBullet": {
    spawnRhythm: {
      initialDelay: [1500, 150],
      burst: [3, 9],
      shotDelay: [150, 90],
      burstDelay: [3000, 400]
    },
    spawnables: {
      bullet: {
        spawnPosition: [0, 0.5],
        velocity: [250, 300],
        composition: "weapons.bullet",
        queue: [{ duration: 4000 }],
        collisions: {
          SolidCollision: {
            spawns: [["spark", {}]]
          },
          WaterCollision: {
            spawns: [["splash", {}]]
          }
        }
      },
      muzzleFlash: {
        spawnPosition: [0, 0.5],
        velocity: 0,
        composition: "weapons.muzzleFlash",
        queue: [{ duration: 400 }]
      },
      spark: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.solidHit",
        queue: [{ duration: 100 }]
      },
      splash: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.waterHit",
        queue: [{ duration: 305 }]
      }
    },
    spawns: [
      ["bullet", { angle: -2 }],
      ["bullet", { angle: 2 }],
      ["muzzleFlash", {}]
    ]
  },
  "boss.searchBullet": {
    spawnRhythm: {
      initialDelay: [1500, 150],
      burst: 1,
      shotDelay: [150, 90],
      burstDelay: [3000, 800]
    },
    spawnables: {
      bullet: {
        spawnPosition: [0, 0.5],
        velocity: [200, 600],
        composition: "weapons.bullet",
        queue: [
          {
            duration: [2000, 800],
            velocity: [0, 100],
            easing: "easeOutQuad"
          },
          { velocity: [900, 1200], aimOnTarget: true },
          { duration: 3000 }
        ],
        collisions: {
          SolidCollision: {
            spawns: [["spark", {}]]
          },
          WaterCollision: {
            spawns: [["splash", {}]]
          }
        }
      },
      muzzleFlash: {
        spawnPosition: [0, 0.5],
        velocity: 0,
        composition: "weapons.muzzleFlash",
        queue: [{ duration: 400 }]
      },
      spark: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.solidHit",
        queue: [{ duration: 100 }]
      },
      splash: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.waterHit",
        queue: [{ duration: 305 }]
      }
    },
    spawns: [
      ["bullet", { angle: 0 }],
      ["bullet", { angle: 20 }],
      ["bullet", { angle: -20 }],
      ["bullet", { angle: 40 }],
      ["bullet", { angle: -40 }],
      ["muzzleFlash", {}]
    ]
  }
};
