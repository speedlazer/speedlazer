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
        frame: ["charge", { duration: 4000 }],
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
    }
  }
};
