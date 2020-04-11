export default {
  "heli.rocket": {
    spawnRhythm: {
      initialDelay: [3500, 2500],
      burst: 1,
      shotDelay: [500, 250],
      burstDelay: [3000, 2000],
      spawns: [["rocket", { angle: -90, autoRotate: false }]]
    },
    spawnables: {
      rocket: {
        spawnPosition: [0, 0.5],
        velocity: [400, 500],
        entity: "HeliRocket",
        damage: [
          {
            velocity: [-20e3, -30e3],
            affects: "health",
            duration: [4, 8],
            name: "Blast"
          }
        ],
        queue: [
          { duration: 130 },
          { velocity: 0, angle: 0, autoRotate: true },
          { duration: 500 },
          { velocity: [450, 500], steering: 110, sight: 25 },
          { duration: 6000 }
        ],
        collisions: {
          PlayerShip: {
            state: "hide",
            spawns: [["hit", {}]]
          },
          GravityLiquid: {
            state: "waterHit",
            spawns: [["hit", {}]]
          }
        }
      },
      hit: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.explosion",
        queue: [{ duration: 100, audio: "explosion" }, { duration: 2000 }]
      }
    }
  },
  "heli.gun": {
    aiming: {
      offsetAimAngle: -5,
      sight: 25,
      resetOnDeactivation: true,
      rotateSpeed: 60,
      range: [10, -50]
    },
    spawnRhythm: {
      initialDelay: [1500, 150],
      burst: [5, 9],
      shotDelay: [100, 60],
      burstDelay: [3000, 400],
      spawns: [
        ["bullet", {}],
        ["muzzleFlash", {}]
      ]
    },
    spawnables: {
      bullet: {
        spawnPosition: [0, 0.5],
        velocity: [350, 500],
        composition: "weapons.bullet",
        queue: [{ duration: 4000 }],
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
        queue: [{ duration: 100, audio: "hit" }]
      },
      splash: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.waterHit",
        queue: [{ duration: 305 }]
      }
    }
  },
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
        queue: [{ duration: 4000 }],
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
        queue: [{ duration: 400 }]
      },
      sparks: {
        spawnPosition: "outside",
        velocity: 0,
        particles: "sparks",
        queue: [{ duration: 200 }]
      },
      sparkHit: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.solidHit",
        queue: [{ duration: 100, audio: "hit" }]
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
  "mine.explosion": {
    spawnRhythm: {
      initialDelay: 1,
      burst: 1,
      shotDelay: 0,
      burstDelay: 0,
      spawns: [
        ["explosion", {}],
        ["bullet", { angleRange: { from: 45, to: 405, step: 90 } }]
      ]
    },
    spawnables: {
      explosion: {
        spawnPosition: [0.5, 0.5],
        velocity: [0, 0],
        composition: "weapons.explosion",
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
        velocity: 400,
        composition: "weapons.bullet",
        damage: [
          {
            velocity: [-20e3, -30e3],
            affects: "health",
            duration: [2, 4],
            name: "Laser"
          }
        ],
        queue: [{ cleanOutOfScreen: true }, { duration: 13000 }],
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
        queue: [{ duration: 4000 }],
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
        queue: [{ duration: 120, audio: "shot" }]
      },
      sparkHit: {
        spawnPosition: "outside",
        velocity: 0,
        composition: "weapons.solidHit",
        queue: [{ duration: 100, audio: "hit" }]
      },
      sparks: {
        spawnPosition: "outside",
        velocity: 0,
        particles: "sparks",
        queue: [{ duration: 200 }]
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
