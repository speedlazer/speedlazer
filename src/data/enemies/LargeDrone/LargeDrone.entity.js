export default {
  LargeDrone: {
    structure: {
      composition: "largeDrone",
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
        },
        rockets: {
          weapon: {
            pattern: "largeDrone.homingRocket",
            target: "PlayerShip"
          }
        },
        rockets2: {
          weapon: {
            pattern: "largeDrone.rockets",
            target: "PlayerShip"
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
      shootRockets: {
        attachments: {
          rockets: {
            weapon: {
              active: true,
              maxBursts: 1
            }
          }
        }
      },
      rocketStrike: {
        attachments: {
          rockets2: {
            weapon: {
              active: true,
              maxBursts: 1
            }
          }
        }
      },
      fireRocket: {
        animation: "rocketShot"
      },
      reloadRocket: {
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
      },
      {
        name: "Bridge",
        scenery: "City.Bridge",
        scrollSpeed: { vx: 0, vy: 0 },
        background: ["City.Sunrise", 3]
      }
    ]
  },
  LargeBackgroundDrone: {
    structure: {
      composition: "largeDrone",
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
