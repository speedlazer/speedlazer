export default {
  Mine: {
    structure: {
      composition: "mine",
      components: [
        ["DamageSupport", { weight: 20 }],
        "SolidCollision",
        ["SubmergeSupport", { submergeSprite: "shadow" }],
        "PlayerEnemy",
        ["Rotating", { vr: 0 }]
      ],
      attachments: {
        explosion: {}
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
      dead: {
        components: [["Rotating", { vr: 0 }]],
        frame: "hidden",
        removeComponents: ["SolidCollision", "PlayerEnemy"],
        attachments: {
          explosion: {
            weapon: {
              pattern: "mine.explosion",
              target: "PlayerShip",
              angle: 0,
              active: true
            }
          },
          smoke: {
            particles: { emitter: "drone.smoke" }
          }
        }
      },
      explode: {
        components: [["Rotating", { vr: 0 }]],
        frame: "hidden",
        removeComponents: ["SolidCollision", "PlayerEnemy"],
        attachments: {
          explosion: {
            weapon: {
              pattern: "mine.blast",
              target: "PlayerShip",
              angle: 0,
              active: true
            }
          },
          smoke: {
            particles: { emitter: "drone.smoke" }
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
