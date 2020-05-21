export default {
  HeliRocket: {
    structure: {
      composition: "weapons.rocket",
      components: ["PlayerHit"],
      frame: "small",
      attachments: {
        trail: {
          particles: "missile.trail"
        },
        tip: null
      }
    },
    states: {
      hide: {
        attachments: {
          trail: null,
          tip: null
        }
      },
      explode: {
        frame: "hidden",
        attachments: {
          trail: null,
          tip: {
            weapon: {
              pattern: "mine.explosion",
              target: "PlayerShip",
              angle: 0,
              active: true
            }
          }
        }
      },
      waterHit: {
        attachments: {
          trail: null,
          tip: {
            particles: ["fountain", { emitter: { w: 60, duration: 1000 } }]
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
