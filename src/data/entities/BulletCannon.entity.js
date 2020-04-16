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
      dead: {
        frame: ["dead", { duration: 0 }],
        animation: null,
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
