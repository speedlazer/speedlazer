export default {
  Radar: {
    structure: {
      composition: "droneShip.radar",
      frame: "emitEnd"
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
            particles: {
              emitter: [
                "smoke",
                { emitter: { w: 10, h: 2, amount: 100, duration: 3000 } }
              ]
            }
          }
        }
      }
    }
  }
};
