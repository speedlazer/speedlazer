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
        frame: "close",
        attachments: {
          gun: null,
          charge: null
        }
      },
      open: { frame: "open" },
      charge: {
        frame: "charge",
        attachments: {
          charge: {
            particles: "laserCharge"
          }
        }
      },
      charged: {
        attachments: {
          charge: null
        }
      },
      discharge: {
        frame: "done",
        attachments: {
          charge: null,
          discharge: {
            particles: [
              "smoke",
              { emitter: { w: 10, h: 2, amount: 200, duration: 300 } }
            ]
          }
        }
      },
      dead: {
        animation: "dead",
        audio: "explosion",
        removeComponents: ["SolidCollision", "PlayerEnemy"],
        attachments: {
          smoke: {
            particles: [
              "smoke",
              { emitter: { w: 10, h: 2, amount: 100, duration: 3000 } }
            ]
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
        name: "Test walls",
        scenery: "Test.Walls",
        position: {
          rx: 0.4,
          ry: 0.6
        },
        scrollSpeed: { vx: 0, vy: 0 }
      }
    ]
  }
};
