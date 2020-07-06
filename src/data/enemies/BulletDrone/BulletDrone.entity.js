export default {
  BulletDrone: {
    structure: {
      composition: "bulletDrone",
      components: [
        "DamageSupport",
        "GravitySupport",
        "SolidCollision",
        "PlayerEnemy",
        "PlayerHit"
      ],
      attachments: {
        trail: {
          particles: { emitter: "drone.trail" }
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
