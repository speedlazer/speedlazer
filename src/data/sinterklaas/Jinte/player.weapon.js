export default {
  "player.carrots": {
    spawnRhythm: {
      initialDelay: 1,
      burst: 1,
      shotDelay: [120, 60],
      burstDelay: 1,
      spawns: [
        ["bullet", { angleRange: { from: [0, -5], to: [1, 5], step: 3 } }],
        ["muzzleFlash", {}],
      ],
    },
    spawnables: {
      bullet: {
        spawnPosition: [0, 0.5],
        velocity: [1050, 1200],
        composition: "weapons.carrot",
        damage: [
          {
            velocity: [-20e3, -30e3],
            affects: "health",
            duration: [2, 4],
            name: "Bullet",
          },
        ],
        queue: [{ cleanOutOfScreen: true }, { duration: 4000 }],
        collisions: {
          SolidCollision: {
            spawns: [
              ["sparkHit", {}],
              ["sparks", { emitter: { duration: 100 } }],
            ],
          },
          WaterCollision: {
            spawns: [["splash", {}]],
          },
        },
      },
      muzzleFlash: {
        spawnPosition: [0, 0.5],
        attached: true,
        velocity: 0,
        composition: "weapons.muzzleFlash",
        queue: [{ duration: 120, audio: "laser-shot" }],
      },
      sparkHit: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.solidHit",
        queue: [{ duration: 100, audio: "laser-hit" }],
      },
      sparks: {
        spawnPosition: "outside",
        velocity: 0,
        particles: "sparks",
        queue: [{ duration: 500 }],
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
