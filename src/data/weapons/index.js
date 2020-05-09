export default {
  "largeDrone.takeover": {
    spawnRhythm: {
      initialDelay: 10,
      burst: 2,
      shotDelay: 200,
      burstDelay: 8000,
      spawns: [
        ["bullet", {}],
        ["muzzleFlash", {}]
      ]
    },
    spawnables: {
      bullet: {
        spawnPosition: [0, 0.5],
        velocity: 400,
        composition: "weapons.sphere",
        damage: [
          {
            velocity: [-20e3, -30e3],
            affects: "health",
            duration: [2, 4],
            name: "Laser"
          }
        ],
        queue: [
          { cleanOutOfScreen: true },
          { aimOnTarget: true, duration: 0 },
          { duration: 4000 }
        ],
        collisions: {
          IntroHeliBackground: {
            spawns: [
              ["sparks", {}],
              ["sparkHit", {}]
            ]
          }
        }
      },
      muzzleFlash: {
        spawnPosition: [0, 0.5],
        attached: true,
        velocity: 0,
        composition: "weapons.muzzleFlash",
        queue: [{ duration: 400, audio: "laser-shot" }]
      },
      sparks: {
        spawnPosition: "outside",
        velocity: 0,
        particles: "sparks",
        queue: [{ duration: 500 }]
      },
      sparkHit: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.solidHit",
        queue: [{ duration: 100, audio: "laser-hit" }]
      }
    }
  },
  "boss.searchBullet": {
    spawnRhythm: {
      initialDelay: [1500, 150],
      burst: 1,
      shotDelay: [150, 90],
      burstDelay: [3000, 800],
      spawns: [
        ["bullet", { angle: 0 }],
        ["bullet", { angle: 20 }],
        ["bullet", { angle: -20 }],
        ["bullet", { angle: 40 }],
        ["bullet", { angle: -40 }],
        ["muzzleFlash", {}]
      ]
    },
    spawnables: {
      bullet: {
        spawnPosition: [0, 0.5],
        velocity: [200, 600],
        composition: "weapons.bullet",
        queue: [
          {
            duration: [2000, 800],
            velocity: [0, 100],
            easing: "easeOutQuad"
          },
          { velocity: [900, 1200], aimOnTarget: true },
          { duration: 3000 }
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
  "boss.extreme-search": {
    spawnRhythm: {
      initialDelay: [1500, 150],
      burst: 1,
      shotDelay: 4000,
      burstDelay: [1500, 500],
      spawns: [["bullet", { angleRange: { from: 0, to: 360, step: 8 } }]]
    },
    spawnables: {
      bullet: {
        spawnPosition: [0, 0.5],
        velocity: 200,
        composition: "weapons.bullet",
        queue: [
          { cleanOutOfScreen: true },
          { duration: 200 },
          { duration: 500, velocity: 0 },
          { velocity: [900, 1200], aimOnTarget: true },
          { duration: 3000 }
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
  "boss.extreme-test": {
    spawnRhythm: {
      initialDelay: [1500, 150],
      burst: [5, 30],
      shotDelay: 200,
      burstDelay: [2000, 10],
      spawns: [["bullet", { angleRange: { from: 0, to: 360, step: 8 } }]]
    },
    spawnables: {
      bullet: {
        spawnPosition: [0, 0.5],
        velocity: 200,
        composition: "weapons.bullet",
        queue: [{ cleanOutOfScreen: true }, { duration: 13000 }],
        collisions: {
          SolidCollision: {
            spawns: [["spark", {}]]
          },
          WaterCollision: {
            spawns: [["splash", {}]]
          }
        }
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
  "boss.spawn": {
    spawnRhythm: {
      initialDelay: [1500, 150],
      burst: [3, 5],
      shotDelay: [350, 250],
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
        composition: "weapons.sphere",
        queue: [{ duration: 1500, velocity: 20 }, { duration: 4000 }],
        collisions: {
          SolidCollision: {
            spawns: [["spark", {}]]
          },
          WaterCollision: {
            spawns: [["splash", {}]]
          }
        }
      },
      subSpawn: {
        spawnPosition: [0, 0.5],
        velocity: [250, 300],
        composition: "weapons.bullet",
        queue: [{ duration: 1500 }],
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
  "mine.blast": {
    spawnRhythm: {
      initialDelay: 1,
      burst: 1,
      shotDelay: 0,
      burstDelay: 0,
      spawns: [
        ["explosion", {}],
        ["bullet", { angleRange: { from: 45, to: 405, step: 45 } }]
      ]
    },
    spawnables: {
      explosion: {
        spawnPosition: [0.5, 0.5],
        velocity: [0, 0],
        composition: "weapons.largeExplosion",
        emitDamage: [
          {
            targets: ["Mine", "PlayerShip"],
            velocity: -1000,
            accelleration: 50,
            upperBounds: 0,
            speed: 2000,
            affects: ["health"],
            duration: 100,
            name: "Explosion"
          }
        ],
        queue: [{ duration: 100, audio: "explosion" }, { duration: 2000 }]
      },
      bullet: {
        spawnPosition: [0, 0.5],
        velocity: 100,
        composition: "weapons.bullet",
        damage: [
          {
            velocity: [-10e3, -30e3],
            affects: "health",
            duration: [2, 4],
            name: "Laser"
          }
        ],
        queue: [
          { cleanOutOfScreen: true },
          { duration: 500, velocity: 500 },
          { duration: 11000 }
        ],
        collisions: {
          PlayerShip: {
            spawns: [["spark", {}]]
          }
        }
      },
      spark: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.solidHit",
        queue: [{ duration: 100 }]
      }
    }
  },
  "mine.explosion": {
    spawnRhythm: {
      initialDelay: 1,
      burst: 1,
      shotDelay: 0,
      burstDelay: 0,
      spawns: [["explosion", {}]]
    },
    spawnables: {
      explosion: {
        spawnPosition: [0.5, 0.5],
        velocity: [0, 0],
        composition: "weapons.largeExplosion",
        emitDamage: [
          {
            targets: ["Mine", "PlayerShip"],
            velocity: -1000,
            accelleration: 50,
            upperBounds: 0,
            speed: 2000,
            affects: ["health"],
            duration: 100,
            name: "Explosion"
          }
        ],
        queue: [{ duration: 100, audio: "explosion" }, { duration: 2000 }]
      }
    }
  },
  "building.explosion": {
    spawnRhythm: {
      initialDelay: 1,
      burst: 14,
      shotDelay: 200,
      burstDelay: 0,
      spawns: [
        [
          "explosion",
          {
            spawnBox: { w: 150, h: 100 }
          }
        ]
      ]
    },
    spawnables: {
      explosion: {
        spawnPosition: [0.5, 0.5],
        velocity: [0, 0],
        composition: "weapons.largeExplosion",
        emitDamage: [
          {
            targets: ["PlayerShip"],
            velocity: -1000,
            accelleration: 50,
            upperBounds: 0,
            speed: 2000,
            affects: ["health"],
            duration: 100,
            name: "Explosion"
          }
        ],
        queue: [{ duration: 100, audio: "explosion" }, { duration: 1000 }]
      }
    }
  },
  "building.explosion2": {
    spawnRhythm: {
      initialDelay: 1,
      burst: 18,
      shotDelay: 180,
      burstDelay: 0,
      spawns: [
        [
          "explosion",
          {
            spawnBox: { w: 250, h: 100 }
          }
        ]
      ]
    },
    spawnables: {
      explosion: {
        spawnPosition: [0.5, 0.5],
        velocity: [0, 0],
        composition: "weapons.largeExplosion",
        emitDamage: [
          {
            targets: ["PlayerShip"],
            velocity: -1000,
            accelleration: 50,
            upperBounds: 0,
            speed: 2000,
            affects: ["health"],
            duration: 100,
            name: "Explosion"
          }
        ],
        queue: [{ duration: 100, audio: "explosion" }, { duration: 1000 }]
      }
    }
  },
  "ship.bullets": {
    spawnRhythm: {
      initialDelay: 1,
      burst: 1,
      shotDelay: 120,
      burstDelay: 1,
      spawns: [
        ["bullet", { angleRange: { from: [0, -6], to: [1, 6], step: 3 } }],
        ["muzzleFlash", {}]
      ]
    },
    spawnables: {
      bullet: {
        spawnPosition: [0, 0.5],
        velocity: [1050, 1200],
        composition: "weapons.lightBullet",
        damage: [
          {
            velocity: [-20e3, -30e3],
            affects: "health",
            duration: [2, 4],
            name: "Laser"
          }
        ],
        queue: [{ cleanOutOfScreen: true }, { duration: 4000 }],
        collisions: {
          SolidCollision: {
            spawns: [
              ["sparkHit", {}],
              ["sparks", { emitter: { duration: 100 } }]
            ]
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
        queue: [{ duration: 120, audio: "laser-shot" }]
      },
      sparkHit: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.solidHit",
        queue: [{ duration: 100, audio: "laser-hit" }]
      },
      sparks: {
        spawnPosition: "outside",
        velocity: 0,
        particles: "sparks",
        queue: [{ duration: 500 }]
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
