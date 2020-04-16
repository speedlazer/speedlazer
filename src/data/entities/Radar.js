export default {
  Radar: {
    structure: {
      composition: "droneShip.radar",
      frame: "emitEnd",
      components: ["DamageSupport", "SolidCollision", "PlayerEnemy"]
    },
    states: {
      pulse: {
        animation: "pulse"
      },
      stopPulse: {
        animation: null,
        frame: "emitEnd"
      },
      dead: {
        animation: null,
        audio: "explosion",
        removeComponents: ["SolidCollision", "PlayerEnemy"],
        frame: "broken",
        attachments: {
          explosion: {
            composition: "explosion",
            animation: "default"
          },
          smoke: {
            particles: [
              "smoke",
              { emitter: { w: 10, h: 2, amount: 100, duration: 3000 } }
            ]
          }
        }
      }
    }
  }
};
