export default {
  turretGun: {
    spawnRhythm: {
      initialDelay: [1500, 150],
      repeat: [150, 150, [3000, 150]]
    },
    spawnables: {
      bullet: {
        spawnPosition: [0, 0.5],
        speed: 300,
        composition: "weapons.bullet",
        timeline: [{ start: 0, end: 5000 }],
        collisions: {
          Solid: {
            spawns: [["spark", {}]]
          },
          Water: {
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
      spark: {},
      splash: {}
    },
    spawns: [["bullet", {}], ["muzzleFlash", {}]]
  }
};
