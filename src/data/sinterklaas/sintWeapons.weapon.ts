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
      shot: [
        { state: "shells", duration: 0 },
        { spawn: true, duration: 50 },
        { state: "noshells", duration: 0 },
      ],
      spawns: [["bullet", { angle: 90 }]],
    },
    spawnables: {
      bullet: {
        spawnPosition: [0, 0.5],
        velocity: [200, 300],
        composition: "sinterklaas.present",
        queue: [{ duration: 4000, audio: ["gun-shot", { volume: 0.8 }] }],
        damage: [
          {
            velocity: [-15e3, -45e3],
            affects: "health",
            duration: [4, 4],
            name: "Laser",
          },
        ],
        collisions: {
          PlayerShip: {
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
};

export default weapons;
