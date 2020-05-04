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
      burst: [5, 7],
      shotDelay: [150, 100],
      burstDelay: [1000, 400],
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
            velocity: [-10e3, -15e3],
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
      shotDelay: 4000,
      burstDelay: 1,
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
          { duration: 1000 }
          //{ duration: 1000, frame: "disappear" }
        ],
        damage: [
          {
            velocity: [-10e3, -15e3],
            affects: "health",
            duration: [2, 4],
            name: "Laser"
          }
        ],
        collisions: {
          PlayerShip: {
            cooldown: 300,
            spawns: [["sparks", {}]],
            remove: false
          },
          WaterCollision: {
            cooldown: 300,
            spawns: [["splash", {}]],
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
        particles: "sparks",
        queue: [{ duration: 500 }]
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
