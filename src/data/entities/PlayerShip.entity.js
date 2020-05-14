export default {
  PlayerShip: {
    structure: {
      composition: "player.ship",
      components: ["ViewportLocked", "DamageSupport", "SunBlock", "LaserSolid"],
      animation: null,
      attachments: {
        mainWeapon: {
          weapon: {
            pattern: "ship.bullets",
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
      starting: {
        attachments: {
          trail: {
            particles: [
              "ship.trail",
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
            particles: "ship.trail"
          },
          reverseTrail: null,
          reverseTrail2: null
        }
      },
      reverse: {
        attachments: {
          trail: null,
          reverseTrail: {
            particles: "ship.reverse"
          },
          reverseTrail2: {
            particles: "ship.reverse"
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
