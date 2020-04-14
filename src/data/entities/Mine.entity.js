export default {
  Mine: {
    structure: {
      composition: "mine",
      components: [
        ["DamageSupport", { weight: 20 }],
        "SolidCollision",
        "PlayerEnemy",
        ["Rotating", { vr: 0 }]
      ],
      attachments: {
        explosion: {
          weapon: {
            pattern: "mine.explosion",
            target: "PlayerShip",
            angle: 0
          }
        }
      }
    },
    states: {
      rotate: {
        components: [["Rotating", { vr: 40 }]]
      },
      open: {
        animation: "opening"
      },
      blinking: {
        components: [["Rotating", { vr: 120 }]],
        animation: "blinking"
      },
      explode: {
        components: [["Rotating", { vr: 0 }]],
        frame: "hidden",
        removeComponents: ["SolidCollision", "PlayerEnemy"],
        attachments: {
          explosion: {
            weapon: {
              active: true
            }
          },
          smoke: {
            particles: "drone.smoke"
          }
        }
      }
    },
    habitats: [
      {
        name: "Ocean",
        scenery: "City.Ocean",
        scrollSpeed: { vx: -100, vy: 0 },
        background: ["City.Sunrise", 2]
      }
    ]
  }
};
