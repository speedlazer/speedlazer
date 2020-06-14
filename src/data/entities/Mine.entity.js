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
            particles: {
              emitter: [
                "drone.smoke",
                {
                  emitter: {
                    w: 80,
                    h: 80,
                    amount: 500,
                    duration: 600
                  },
                  particle: { startSize: 30, endSize: 20 }
                }
              ]
            }
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
            particles: {
              emitter: [
                "drone.smoke",
                {
                  emitter: {
                    w: 80,
                    h: 80,
                    amount: 500,
                    duration: 600
                  },
                  particle: { startSize: 30, endSize: 20 }
                }
              ]
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
        background: ["City.Sunrise", 2]
      }
    ]
  }
};
