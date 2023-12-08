export default {
  WarFish: {
    structure: {
      composition: "fish",
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
          particles: { emitter: "fish.trail" },
        },
      },
    },
    states: {
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
        scenery: "garden.Pond",
        scrollSpeed: { vx: -100, vy: 0 },
        background: ["city.Sunset", 1],
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
