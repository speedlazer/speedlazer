export default {
  Seagull: {
    structure: {
      composition: "seagull",
      components: [
        "DamageSupport",
        "GravitySupport",
        "SolidCollision",
        "SunBlock",
        "PlayerEnemy",
        "PlayerHit",
      ],
      attachments: {
        gun: {
          weapon: {
            pattern: "seagull.flatsCannon",
            target: "Jinte",
          },
        },
      },
    },
    states: {
      shooting: {
        attachments: {
          gun: {
            weapon: {
              active: true,
            },
          },
        },
      },
      damaged: {
        frame: "damaged",
      },
      turned: {
        frame: "turned",
      },
      dead: {
        frame: "hidden",
        audio: "explosion",
        removeComponents: ["SolidCollision", "PlayerEnemy"],
        attachments: {
          gun: null,
          explosion: {
            composition: "explosion",
            animation: "default",
          },
          smoke: {
            particles: { emitter: "drone.smoke" },
          },
        },
      },
    },
    habitats: [
      {
        name: "Bay",
        scenery: "city.Bay",
        scrollSpeed: { vx: -100, vy: 0 },
        background: ["city.Sunrise", 3],
      },
    ],
  },
};
