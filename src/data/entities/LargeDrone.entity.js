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
          particles: {
            emitter: ["drone.trail", { particle: { startSize: 15 } }]
          }
        }
      }
    },
    states: {
      eyeMove: {
        animation: "eye",
        attachments: {
          trail: {
            particles: {
              emitter: ["drone.trail", { particle: { startSize: 20 } }]
            }
          }
        }
      },
      laugh: {
        animation: "laugh",
        audio: "laugh"
      },
      reload: {
        animation: "rocketReload"
      },
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
          particles: {
            emitter: ["drone.trail", { particle: { startSize: 15 } }]
          }
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
      turned: {
        frame: "turned"
      },
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
