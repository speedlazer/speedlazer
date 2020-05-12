export default {
  "powerups.health": {
    attributes: { width: 32, height: 32 },
    sprites: [
      ["powerUpBox", { key: "main", accentColor: "#900000" }],
      ["heart", { z: 1, scale: 0.7, accentColor: "#ff9999" }],
      [
        "bigGlare",
        {
          z: -1,
          scale: 0.15,
          x: -84,
          y: -84,
          crop: [0, 24, 24, 0],
          overrideColor: "#ff9999",
          alpha: 0.4,
          key: "glow"
        }
      ]
    ],
    frames: {
      startGlow: {
        glow: {
          alpha: 0.4,
          scale: 0.15
        }
      },
      endGlow: {
        glow: {
          alpha: 0.0,
          scale: 0.4
        }
      }
    },
    animations: {
      default: {
        duration: 2000,
        repeat: true,
        timeline: [
          {
            start: 0.0,
            end: 1.0,
            spriteAnimation: {
              key: "main",
              sprites: [
                "powerUpBox",
                "powerUpBox2",
                "powerUpBox3",
                "powerUpBox2"
              ]
            }
          },
          {
            start: 0.0,
            end: 1.0,
            startFrame: "startGlow",
            endFrame: "endGlow"
          }
        ]
      }
    }
  }
};
