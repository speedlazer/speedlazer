export default {
  "turret.bullet": {
    spawnRhythm: {
      initialDelay: [1500, 150],
      //repeat: [150, 150, [3000, 150]]
      repeat: [3000]
    },
    spawnables: {
      bullet: {
        spawnPosition: [0, 0.5],
        speed: 300,
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
        sprite: "explosion10",
        timeline: [{ start: 0, end: 800 }]
      },
      splash: {
        spawnPosition: "outside",
        speed: 0,
        sprite: "explosion10",
        timeline: [{ start: 0, end: 800 }]
      }
    },
    spawns: [
      ["bullet", {}]
      //, ["muzzleFlash", {}]
    ]
  }
};
