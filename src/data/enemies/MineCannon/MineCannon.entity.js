export default {
  MineCannon: {
    structure: {
      composition: "mineCannon",
      attachments: {
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
            particles: {
              emitter: [
                "smoke",
                { emitter: { w: 10, h: 2, amount: 100, duration: 3000 } }
              ]
            }
          },
          gun: null,
          explosion: {
            composition: "explosion",
            animation: "default"
          }
        }
      },
      aimLow: {
        frame: ["aimLow", { duration: 1500 }]
      },
      aimHigh: {
        frame: ["aimHigh", { duration: 1500 }]
      },
      shoot: {
        animation: "blinking",
        audio: "explosion"
      }
    }
  }
};
