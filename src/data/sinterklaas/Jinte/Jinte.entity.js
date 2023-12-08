export default {
  Jinte: {
    structure: {
      composition: "jinte",
      components: ["ViewportLocked", "DamageSupport", "SunBlock", "LaserSolid"],
      animation: null,
      attachments: {
        gun: {
          weapon: {
            pattern: "player.carrots",
            target: "PlayerEnemy",
            angle: 180,
          },
        },
        frontFoot: null,
        backFoot: null,
      },
    },
    states: {
      dead: {
        frame: "hidden",
        audio: "explosion",
        attachments: {
          frontFoot: null,
          backFoot: null,
          gun: null,
          center: {
            composition: "weapons.largeExplosion",
            animation: "default",
          },
        },
      },
      damaged: {
        frame: "damaged",
      },
      shooting: {
        attachments: {
          gun: {
            weapon: {
              active: true,
            },
          },
        },
      },
      noShooting: {
        attachments: {
          gun: {
            weapon: {
              active: false,
            },
          },
        },
      },
      starting: {
        animation: "flying",
        attachments: {
          frontFoot: {
            particles: {
              emitter: [
                "jinte.trail",
                {
                  particle: { velocity: 50, startSize: 10 },
                  emitter: { amount: 100 },
                },
              ],
            },
          },
          backFoot: {
            particles: {
              emitter: [
                "jinte.trail",
                {
                  particle: { velocity: 50, startSize: 10 },
                  emitter: { amount: 100 },
                },
              ],
            },
          },
        },
      },
      flying: {
        animation: "flying",
        attachments: {
          frontFoot: {
            particles: { emitter: "jinte.trail" },
          },
          backFoot: {
            particles: { emitter: "jinte.trail" },
          },
        },
      },
      reverse: {
        attachments: {},
      },
      turned: {
        frame: "turned",
      },
      turning: {
        animation: "turnAround",
      },
      turningDamaged: {
        animation: "turnAroundDamaged",
      },
    },
    habitats: [
      {
        name: "Ocean",
        scenery: "City.Ocean",
        position: {
          x: 200,
          y: 380,
        },
        scrollSpeed: { vx: -100, vy: 0 },
        background: ["City.Sunrise", 3],
      },
    ],
  },
};
