export default {
  ExtraLife: {
    structure: {
      composition: "powerups.life",
      animation: "default",
      components: ["DamageSupport", "PlayerHit"]
    },
    states: {
      pickedUp: {
        frame: "pickedUp",
        animation: null,
        audio: "powerup",
        attachments: { explosion: { particles: { emitter: "powerup.pickup" } } }
      },
      disappear: {
        animation: null,
        frame: "disappear"
      }
    }
  },
  Bonus: {
    structure: {
      composition: "powerups.bonus",
      animation: "default",
      components: ["DamageSupport", "PlayerHit"]
    },
    states: {
      pickedUp: {
        frame: "pickedUp",
        animation: null,
        audio: "powerup",
        attachments: {
          explosion: {
            particles: {
              emitter: [
                "powerup.pickup",
                {
                  particle: {
                    startColor: [0.65, 0.48, 0.0, 0.6],
                    endColor: [0.65, 0.48, 0.0, 0]
                  }
                }
              ]
            }
          }
        }
      },
      disappear: {
        animation: null,
        frame: "disappear"
      }
    }
  },
  Upgrade: {
    structure: {
      composition: "powerups.upgrade",
      animation: "default",
      components: ["DamageSupport", "PlayerHit"]
    },
    states: {
      pickedUp: {
        frame: "pickedUp",
        animation: null,
        audio: "powerup",
        attachments: {
          explosion: {
            particles: {
              emitter: [
                "powerup.pickup",
                {
                  particle: {
                    startColor: [0.1, 0.7, 0.1, 0.6],
                    endColor: [0.3, 0.7, 0.3, 0]
                  }
                }
              ]
            }
          }
        }
      },
      disappear: {
        animation: null,
        frame: "disappear"
      }
    }
  }
};
