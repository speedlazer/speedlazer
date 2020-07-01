export default {
  LaserCannon: {
    structure: {
      composition: "laserCannon",
      attachments: {
        gun: {
          weapon: {
            pattern: "cannon.laser",
            target: "PlayerShip",
            angle: 0,
            barrel: "barrel"
          }
        },
        smoke: null
      }
    },
    states: {
      mirrored: { frame: "mirrored" },
      close: {
        frame: ["close", { duration: 300 }],
        attachments: {
          gun: null,
          charge: null
        }
      },
      open: { frame: ["open", { duration: 300 }] },
      charge: {
        attachments: {
          charge: {
            particles: { emitter: "laserCharge" }
          }
        }
      },
      charged: {
        frame: "charge",
        attachments: {
          charge: null
        }
      },
      discharge: {
        frame: "done",
        attachments: {
          charge: null,
          discharge: {
            particles: {
              emitter: [
                "smoke",
                { emitter: { w: 10, h: 2, amount: 200, duration: 300 } }
              ]
            }
          }
        }
      },
      dead: {
        animation: "dead",
        audio: "explosion",
        removeComponents: ["SolidCollision", "PlayerEnemy"],
        attachments: {
          smoke: {
            particles: {
              emitter: [
                "smoke",
                { emitter: { w: 10, h: 2, amount: 100, duration: 3000 } }
              ]
            }
          },
          charge: null,
          gun: null,
          explosion: {
            composition: "explosion",
            animation: "default"
          }
        }
      },
      shooting: {
        attachments: {
          gun: {
            weapon: {
              active: true
            }
          }
        }
      }
    },
    habitats: [
      {
        name: "test walls",
        scenery: "test.Walls",
        position: {
          rx: 0.4,
          ry: 0.6
        },
        scrollSpeed: { vx: 0, vy: 0 }
      }
    ]
  },
  LaserCannonForceField: {
    structure: {
      particles: {
        emitter: ["forceField", { emitter: { w: 140, h: 75, amount: 200 } }]
      },
      components: ["SolidCollision"]
    },
    states: {
      stopped: {
        particles: {
          emitter: [
            "forceFieldDisperse",
            { emitter: { w: 140, h: 75, amount: 200, warmed: true } }
          ]
        }
      },
      started: { particles: { active: true } }
    }
  }
};
