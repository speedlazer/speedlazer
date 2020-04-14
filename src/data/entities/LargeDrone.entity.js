export default {
  LargeDrone: {
    structure: {
      composition: "droneBoss",
      components: [
        "DamageSupport",
        "GravitySupport",
        "SolidCollision",
        "PlayerEnemy"
      ],
      attachments: {
        trail: {
          particles: ["drone.trail", { particle: { startSize: 15 } }]
        }
      }
    },
    states: {
      damaged: {
        frame: "damaged",
        attachments: {
          trail: null
        }
      },
      turned: {
        frame: "turned"
      },
      dead: {
        frame: "hidden",
        audio: "explosion",
        removeComponents: ["SolidCollision", "PlayerEnemy"],
        attachments: {
          trail: null,
          explosion: {
            composition: "explosion",
            animation: "default"
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
        background: ["City.Sunrise", 1]
      }
    ]
  },
  LargeBackgroundDrone: {
    structure: {
      composition: "droneBoss",
      frame: "background",
      components: [],
      attachments: {
        trail: {
          particles: ["drone.trail", { particle: { startSize: 15 } }]
        },
        gun: {
          weapon: {
            pattern: "largeDrone.takeover",
            target: "IntroHeliBackground"
          }
        }
      }
    },
    states: {
      eyeMove: {
        animation: "eye"
      },
      turned: {},
      shoot: {
        attachments: {
          gun: { weapon: { active: true } }
        }
      }
    },
    habitats: [
      {
        name: "Ocean",
        scenery: "City.Ocean",
        scrollSpeed: { vx: -100, vy: 0 },
        background: ["City.Sunrise", 1]
      }
    ]
  }
};
