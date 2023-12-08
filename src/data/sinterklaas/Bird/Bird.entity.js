export default {
  WarBird: {
    structure: {
      composition: "bird",
      components: [
        "DamageSupport",
        "GravitySupport",
        "SolidCollision",
        "SunBlock",
        "PlayerEnemy",
        "PlayerHit",
      ],
      attachments: {
        trail: {
          particles: { emitter: "bird.trail" },
        },
      },
    },
    states: {
      damaged: {
        frame: "damaged",
        attachments: {
          trail: null,
        },
      },
      turned: {
        frame: "turned",
      },
      dead: {
        frame: "hidden",
        audio: "explosion",
        removeComponents: ["SolidCollision", "PlayerEnemy"],
        attachments: {
          trail: null,
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
        name: "Garden",
        scenery: "garden.Grass",
        scrollSpeed: { vx: -100, vy: 0 },
        background: ["city.Sunrise", 2],
      },
      {
        name: "Bay",
        scenery: "city.Bay",
        scrollSpeed: { vx: -100, vy: 0 },
        background: ["city.Sunrise", 3],
      },
    ],
  },
};
