export default {
  LaserCannon: {
    structure: {
      composition: "laserCannon",
      attachments: {
        gun: {
          weapon: {
            pattern: "cannon.gun",
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
      close: { frame: "close" },
      open: { frame: "open" },
      charge: { frame: "charge" },
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
