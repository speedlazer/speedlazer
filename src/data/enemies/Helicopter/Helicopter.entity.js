export default {
  Helicopter: {
    structure: {
      composition: "helicopter",
      components: ["DamageSupport", "GravitySupport", "SunBlock"],
      attachments: {
        gun: {
          weapon: {
            pattern: "heli.gun",
            target: "PlayerShip",
            angle: -5,
            barrel: "barrel"
          }
        },
        rockets: {
          weapon: {
            pattern: "heli.rocket",
            target: "PlayerShip"
          }
        },
        smoke: null
      }
    },
    states: {
      damaged: {
        frame: "damaged"
      },
      fire: {
        attachments: {
          fire: {
            particles: {
              emitter: "helicopter.fire"
            }
          }
        }
      },
      crashed: {
        frame: "damaged",
        attachments: {
          smoke: {
            particles: {
              emitter: [
                "smoke",
                { emitter: { w: 50, h: 10, amount: 100, duration: 2000 } }
              ]
            }
          }
        }
      },
      landed: {
        frame: "landed"
      },
      foreground: {
        frame: "foreground"
      },
      dead: {
        frame: "damaged",
        animation: null,
        audio: "explosion",
        removeComponents: ["SolidCollision", "PlayerEnemy"],
        attachments: {
          rockets: {
            weapon: {
              active: false
            },
            composition: "explosion",
            animation: "default"
          },
          smoke: {
            particles: {
              emitter: ["smoke", { emitter: { w: 50, h: 10, amount: 100 } }]
            }
          },
          gun: null
        }
      },
      flying: {
        animation: "flying"
      },
      toForeground: {
        animation: "turning"
      },
      tilted: {
        frame: "tilted"
      },
      leveled: {
        frame: "leveled"
      },
      turning: {
        animation: "turnAround",
        gun: {
          weapon: {
            active: false
          }
        },
        rockets: {
          weapon: {
            active: false
          }
        }
      },
      shooting: {
        animation: "flying",
        attachments: {
          gun: {
            weapon: {
              active: true
            }
          },
          rockets: {
            weapon: {
              active: true
            }
          }
        }
      }
    },
    habitats: [
      {
        name: "Ocean",
        scenery: "City.Ocean",
        scrollSpeed: { vx: -100, vy: 0 },
        background: ["City.Sunrise", 1]
      }
    ]
  }
};
