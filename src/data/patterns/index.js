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
        speed: [250, 300],
        composition: "weapons.bullet",
        timeline: [{ start: 0, end: 4000 }],
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
        speed: 0,
        composition: "weapons.muzzleFlash",
        timeline: [{ start: 0, end: 400 }]
      },
      spark: {
        spawnPosition: "outside",
        speed: 0,
        composition: "weapons.solidHit",
        timeline: [{ start: 0, end: 100 }]
      },
      splash: {
        spawnPosition: "outside",
        speed: 0,
        composition: "weapons.waterHit",
        timeline: [{ start: 0, end: 305 }]
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
        speed: [250, 300],
        composition: "weapons.bullet",
        timeline: [{ start: 0, end: 4000 }],
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
        speed: 0,
        composition: "weapons.muzzleFlash",
        timeline: [{ start: 0, end: 400 }]
      },
      spark: {
        spawnPosition: "outside",
        speed: 0,
        composition: "weapons.solidHit",
        timeline: [{ start: 0, end: 100 }]
      },
      splash: {
        spawnPosition: "outside",
        speed: 0,
        composition: "weapons.waterHit",
        timeline: [{ start: 0, end: 305 }]
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
      burstDelay: [3000, 400]
    },
    spawnables: {
      bullet: {
        spawnPosition: [0, 0.5],
        speed: 200,
        composition: "weapons.bullet",
        timeline: [
          { start: 0, end: 1000, speed: 0, ease: "easeOut" },
          { start: 1000, end: 4000, speed: 400 }
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
        speed: 0,
        composition: "weapons.muzzleFlash",
        timeline: [{ start: 0, end: 400 }]
      },
      spark: {
        spawnPosition: "outside",
        speed: 0,
        composition: "weapons.solidHit",
        timeline: [{ start: 0, end: 100 }]
      },
      splash: {
        spawnPosition: "outside",
        speed: 0,
        composition: "weapons.waterHit",
        timeline: [{ start: 0, end: 305 }]
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
