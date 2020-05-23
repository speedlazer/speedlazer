export default {
  PlayerShip: {
    structure: {
      composition: "player.ship",
      components: ["ViewportLocked", "DamageSupport", "SunBlock", "LaserSolid"],
      animation: null,
      attachments: {
        mainWeapon: {
          weapon: {
            pattern: "player.bullets",
            target: "PlayerEnemy",
            angle: 180
          }
        },
        laserWeapon: {
          weapon: {
            pattern: "player.laser",
            target: "PlayerEnemy",
            angle: 180
          }
        },
        trail: null,
        reverseTrail: null,
        reverseTrail2: null
      }
    },
    states: {
      dead: {
        frame: "hidden",
        audio: "explosion",
        attachments: {
          trail: null,
          reverseTrail: null,
          reverseTrail2: null,
          mainWeapon: null,
          explosion: {
            composition: "weapons.largeExplosion",
            animation: "default"
          }
        }
      },
      damaged: {
        frame: "damaged"
      },
      shooting: {
        attachments: {
          mainWeapon: {
            weapon: {
              active: true
            }
          }
        }
      },
      noShooting: {
        attachments: {
          mainWeapon: {
            weapon: {
              active: false
            }
          }
        }
      },
      laserShooting: {
        attachments: {
          laserWeapon: {
            weapon: {
              active: true
            }
          }
        }
      },
      noLaserShooting: {
        attachments: {
          laserCharge: null,
          laserWeapon: {
            weapon: {
              active: false
            }
          }
        }
      },
      laserCharge: {
        attachments: {
          laserCharge: {
            particles: "player.laserCharge"
          }
        }
      },
      stopLaserCharge: {
        attachments: {
          laserCharge: null
        }
      },
      starting: {
        attachments: {
          trail: {
            particles: [
              "player.trail",
              {
                particle: { velocity: 50, startSize: 10 },
                emitter: { amount: 100 }
              }
            ]
          },
          reverseTrail: null,
          reverseTrail2: null
        }
      },
      flying: {
        attachments: {
          trail: {
            particles: "player.trail"
          },
          reverseTrail: null,
          reverseTrail2: null
        }
      },
      reverse: {
        attachments: {
          trail: null,
          reverseTrail: {
            particles: "player.reverse"
          },
          reverseTrail2: {
            particles: "player.reverse"
          }
        }
      },
      turned: {
        frame: "turned"
      }
    },
    habitats: [
      {
        name: "Ocean",
        scenery: "City.Ocean",
        position: {
          x: 200,
          y: 380
        },
        scrollSpeed: { vx: -100, vy: 0 },
        background: ["City.Sunrise", 3]
      }
    ]
  }
};
