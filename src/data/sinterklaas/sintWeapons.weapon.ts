const weapons = {
  "chimney.presents": {
    aiming: {
      offsetAimAngle: 0,
      sight: 95,
      resetOnDeactivation: true,
      rotateSpeed: 0,
      range: [70, -2],
    },
    spawnRhythm: {
      initialDelay: [1, 1],
      burst: [5, 5],
      shotDelay: [400, 400],
      burstDelay: [400, 400],
      shot: [{ spawn: true, duration: 50 }],
      spawns: [["bullet", { angle: 90 }]],
    },
    spawnables: {
      bullet: {
        spawnPosition: [0, 0.5],
        velocity: [200, 300],
        composition: "sinterklaas.present",
        queue: [
          // { cleanOutOfScreen: true },
          { duration: 4000, audio: ["gun-shot", { volume: 0.8 }] },
        ],
        damage: [
          {
            velocity: [-15e3, -45e3],
            affects: "health",
            duration: [4, 4],
            name: "Laser",
          },
        ],
        collisions: {
          Jinte: {
            spawns: [["spark", {}]],
          },
          WaterCollision: {
            spawns: [["splash", {}]],
          },
        },
        autoRotate: false,
      },
      spark: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.solidHit",
        queue: [{ duration: 100, audio: "laser-hit" }],
      },
      splash: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.waterHit",
        queue: [{ duration: 305 }],
      },
    },
  },
  "seagull.flatsCannon": {
    aiming: {
      offsetAimAngle: -5,
      sight: 0,
      resetOnDeactivation: true,
      rotateSpeed: 90,
      range: [-30, 150],
    },
    spawnRhythm: {
      initialDelay: 100,
      burst: 2,
      shotDelay: 300,
      burstDelay: 1000,
      spawns: [["flats", { angle: 30, autoRotate: true }]],
    },
    spawnables: {
      flats: {
        spawnPosition: [0, 0.5],
        velocity: [350, 500],
        composition: "flats",
        queue: [
          { cleanOutOfScreen: true },
          { aimOnTarget: true, duration: 0 },
          { duration: 4000, audio: ["gun-shot", { volume: 0.8 }] },
        ],
        damage: [
          {
            velocity: [-2e3, -15e3],
            affects: "health",
            duration: [2, 4],
            name: "Laser",
          },
        ],
        collisions: {
          Jinte: {
            spawns: [["spark", {}]],
          },
          WaterCollision: {
            spawns: [["splash", {}]],
          },
        },
      },
      spark: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.solidHit",
        queue: [{ duration: 100, audio: "laser-hit" }],
      },
      splash: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.waterHit",
        queue: [{ duration: 305 }],
      },
    },
  },
};

export default weapons;
