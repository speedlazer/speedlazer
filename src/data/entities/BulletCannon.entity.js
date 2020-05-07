export default {
  BulletCannon: {
    structure: {
      composition: "bulletCannon",
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
      shells: {
        attachments: {
          explosion: {
            particles: [
              "shells",
              { emitter: { w: 10, h: 10, amount: 170, duration: 200 } }
            ]
          }
        }
      },
      noshells: {
        attachments: {
          explosion: null
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
