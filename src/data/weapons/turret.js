export default {
  "cannon.gun": {
    aiming: {
      offsetAimAngle: 0,
      sight: 95,
      resetOnDeactivation: true,
      rotateSpeed: 60,
      range: [70, -2]
    },
    spawnRhythm: {
      initialDelay: [500, 150],
      burst: [3, 7],
      shotDelay: [150, 100],
      burstDelay: [1000, 400],
      shot: [
        { state: "shells", duration: 0 },
        { spawn: true, duration: 50 },
        { state: "noshells", duration: 0 }
      ],
      spawns: [
        ["bullet", {}],
        ["muzzleFlash", {}]
      ]
    },
    spawnables: {
      bullet: {
        spawnPosition: [0, 0.5],
        velocity: [400, 500],
        composition: "weapons.bullet",
        queue: [{ duration: 4000, audio: ["gun-shot", { volume: 0.8 }] }],
        damage: [
          {
            velocity: [-3e3, -15e3],
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
        queue: [{ duration: 100, audio: "laser-hit" }]
      },
      splash: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.waterHit",
        queue: [{ duration: 305 }]
      }
    }
  },
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
        { state: "charge", duration: 1200 },
        { stopAiming: true, state: "charged", duration: 500 },
        { duration: 100 },
        { spawn: true, duration: 100 },
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
        attached: true,
        velocity: 2500,
        composition: "weapons.laser",
        queue: [
          {
            duration: 300
          },
          { velocity: 0 },
          { duration: 200 },
          { duration: 300, frame: "disappear" }
        ],
        damage: [
          {
            velocity: [-20e3, -45e3],
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
        spawnPosition: "outside",
        velocity: 0,
        particles: "laserHit",
        queue: [{ duration: 1500 }]
      }
    }
  },
  "turret.bullet": {
    spawnRhythm: {
      initialDelay: [1500, 150],
      burst: [3, 9],
      shotDelay: [150, 90],
      burstDelay: [3000, 400],
      spawns: [
        ["bullet", {}],
        ["muzzleFlash", {}]
      ]
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
        attached: true,
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
    }
  },
  "turret.doubleBullet": {
    spawnRhythm: {
      initialDelay: [1500, 150],
      burst: [3, 9],
      shotDelay: [150, 90],
      burstDelay: [3000, 400],
      spawns: [
        ["bullet", { angle: -2 }],
        ["bullet", { angle: 2 }],
        ["muzzleFlash", {}]
      ]
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
        attached: true,
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
    }
  }
};
