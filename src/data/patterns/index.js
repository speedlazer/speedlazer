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
        velocity: 0,
        composition: "weapons.muzzleFlash",
        timeline: [{ start: 0, end: 400 }]
      },
      spark: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.solidHit",
        timeline: [{ start: 0, end: 100 }]
      },
      splash: {
        spawnPosition: "outside",
        velocity: 0,
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
        velocity: [250, 300],
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
        velocity: 0,
        composition: "weapons.muzzleFlash",
        timeline: [{ start: 0, end: 400 }]
      },
      spark: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.solidHit",
        timeline: [{ start: 0, end: 100 }]
      },
      splash: {
        spawnPosition: "outside",
        velocity: 0,
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
      burstDelay: [3000, 800]
    },
    spawnables: {
      bullet: {
        spawnPosition: [0, 0.5],
        velocity: [200, 600],
        composition: "weapons.bullet",
        timeline: [
          {
            start: 0,
            end: [2000, 800],
            velocity: [0, 100],
            easing: "easeOutQuad"
          },
          { start: [2500, 810], end: [2550, 850], velocity: [900, 1200] },
          { start: 3000, end: 4000 }
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
        timeline: [{ start: 0, end: 400 }]
      },
      spark: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.solidHit",
        timeline: [{ start: 0, end: 100 }]
      },
      splash: {
        spawnPosition: "outside",
        velocity: 0,
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
