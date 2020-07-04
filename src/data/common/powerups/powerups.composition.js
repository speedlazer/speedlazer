export default {
  "powerups.life": {
    attributes: { width: 32, height: 32 },
    sprites: [
      ["powerUpBox", { key: "main", accentColor: "#900000" }],
      ["heart", { z: 1, scale: 0.7, accentColor: "#ff9999", key: "symbol" }],
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
    hitbox: [0, 0, 32, 0, 32, 32, 0, 32],
    attachHooks: [
      ["explosion", { x: 16, y: 16, z: -2, attachAlign: ["center", "center"] }]
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
      },
      pickedUp: {
        glow: {
          alpha: 0.0,
          scale: 0.4
        },
        main: { alpha: 0.0 },
        symbol: { alpha: 0.0, scale: 1.2 }
      },
      disappear: {
        glow: { alpha: 0.0 },
        main: { alpha: 0.0, scale: 0.2 },
        symbol: { alpha: 0.0, scale: 0.2 }
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
  },
  "powerups.bonus": {
    attributes: { width: 32, height: 32 },
    sprites: [
      ["powerUpBox", { key: "main", accentColor: "#a67c00" }],
      ["star", { z: 1, scale: 0.7, accentColor: "#ffdc73", key: "symbol" }],
      [
        "bigGlare",
        {
          z: -1,
          scale: 0.15,
          x: -84,
          y: -84,
          crop: [0, 24, 24, 0],
          overrideColor: "#ffdc73",
          alpha: 0.4,
          key: "glow"
        }
      ]
    ],
    hitbox: [0, 0, 32, 0, 32, 32, 0, 32],
    attachHooks: [
      ["explosion", { x: 16, y: 16, z: -2, attachAlign: ["center", "center"] }]
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
      },
      pickedUp: {
        glow: {
          alpha: 0.0,
          scale: 0.4
        },
        main: { alpha: 0.0 },
        symbol: { alpha: 0.0, scale: 1.2 }
      },
      disappear: {
        glow: { alpha: 0.0 },
        main: { alpha: 0.0, scale: 0.2 },
        symbol: { alpha: 0.0, scale: 0.2 }
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
  },
  "powerups.upgrade": {
    attributes: { width: 32, height: 32 },
    sprites: [
      ["powerUpBox", { key: "main", accentColor: "#009000" }],
      ["upgrade", { z: 1, scale: 0.7, accentColor: "#99ff99", key: "symbol" }],
      [
        "bigGlare",
        {
          z: -1,
          scale: 0.15,
          x: -84,
          y: -84,
          crop: [0, 24, 24, 0],
          overrideColor: "#99ff99",
          alpha: 0.4,
          key: "glow"
        }
      ]
    ],
    hitbox: [0, 0, 32, 0, 32, 32, 0, 32],
    attachHooks: [
      ["explosion", { x: 16, y: 16, z: -2, attachAlign: ["center", "center"] }]
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
      },
      pickedUp: {
        glow: {
          alpha: 0.0,
          scale: 0.4
        },
        main: { alpha: 0.0 },
        symbol: { alpha: 0.0, scale: 1.2 }
      },
      disappear: {
        glow: { alpha: 0.0 },
        main: { alpha: 0.0, scale: 0.2 },
        symbol: { alpha: 0.0, scale: 0.2 }
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
