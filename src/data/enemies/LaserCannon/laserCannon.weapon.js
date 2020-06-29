export default {
  "cannon.laser": {
    aiming: {
      offsetAimAngle: 0,
      sight: 95,
      resetOnDeactivation: true,
      rotateSpeed: 60,
      range: [70, -2]
    },
    spawnRhythm: {
      initialDelay: [500, 150],
      burst: 1,
      shotDelay: 1,
      burstDelay: 1000,
      shot: [
        { state: "charge", audio: "laser-charge", duration: 1200 },
        { stopAiming: true, state: "charged", duration: 500 },
        { duration: 100 },
        { spawn: true, duration: 100, audio: "laser-fire" },
        { state: "discharge", duration: 500 },
        { duration: 500 },
        { stopAiming: false, duration: 0 }
      ],
      spawns: [
        ["laser", { angle: 180 }],
        ["laser", { angle: 200 }],
        ["laser", { angle: 160 }],
        ["laser", { angle: 220 }],
        ["laser", { angle: 140 }]
      ]
    },
    spawnables: {
      laser: {
        spawnPosition: [0, 0.5],
        beam: true,
        attached: true,
        velocity: 2500,
        composition: "weapons.laser",
        queue: [
          {
            duration: 350
          },
          { velocity: 0 },
          { duration: 150 },
          { duration: 300, frame: "disappear" }
        ],
        damage: [
          {
            velocity: [-2e3, -4e3],
            affects: "health",
            duration: [2, 4],
            name: "Laser"
          }
        ],
        collisions: {
          LaserSolid: {
            cooldown: 10,
            spawns: [["sparks", { angle: 180 }]],
            remove: false
          },
          PlayerShip: {
            cooldown: 10,
            spawns: [["sparks", { angle: 180 }]],
            remove: false
          }
        }
      },
      splash: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.waterHit",
        queue: [{ duration: 305 }]
      },
      sparks: {
        attached: true,
        spawnPosition: "outside",
        velocity: 0,
        particles: "laserHit",
        queue: [{ duration: 50 }]
      }
    }
  }
};
