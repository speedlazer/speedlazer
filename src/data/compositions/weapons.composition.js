export default {
  "weapons.bullet": {
    attributes: {
      width: 26,
      height: 16,
      ro: [4, 8]
    },
    hitbox: [2, 3, 14, 3, 14, 12, 2, 12],
    sprites: [["sphere1", { z: -2, crop: [17, 6, 0, 0], flipX: true }]]
  },
  "weapons.lightBullet": {
    attributes: {
      width: 32,
      height: 32,
      ro: [4, 14]
    },
    hitbox: [2, 12, 28, 12, 28, 18, 2, 18],
    sprites: [["lightBullet", { z: -2 }]]
  },
  "weapons.laser": {
    attributes: {
      width: 20,
      height: 5,
      ro: [2, 3]
    },
    sprites: [
      [
        "lightBullet",
        {
          alpha: 1,
          x: 0,
          y: -7,
          h: 20,
          w: 5,
          z: -2,
          crop: [0, 15, 0, 0],
          key: "beam1"
        }
      ],
      [
        "lightBullet",
        {
          alpha: 1,
          x: 5,
          y: -7,
          h: 20,
          w: 10,
          z: -2,
          stretch: [0, 1, 0, 0],
          crop: [0, 15, 0, 15],
          key: "beam2"
        }
      ],
      [
        "lightBullet",
        {
          alpha: 1,
          x: 15,
          y: -7,
          h: 20,
          w: 5,
          z: -2,
          stretch: [0, 1, 0, 1],
          crop: [0, 0, 0, 15],
          key: "beam3"
        }
      ]
    ],
    frames: {
      short: {
        attributes: { w: 200 }
      },
      reset: {
        beam1: { alpha: 1 },
        beam2: { alpha: 1 },
        beam3: { alpha: 1 }
      },
      disappear: {
        beam1: { alpha: 0 },
        beam2: { alpha: 0 },
        beam3: { alpha: 0 }
      },
      long: {
        attributes: { w: 500 }
      },
      rotate: {
        attributes: { rotation: 10 }
      },
      rotate2: {
        attributes: { rotation: -50 }
      }
    }
  },
  "player.bullet": {
    attributes: {
      width: 52,
      height: 8,
      ro: [4, 4]
    },
    hitbox: [2, 3, 14, 3, 14, 12, 2, 12],
    sprites: [
      [
        "sphere1",
        {
          z: -2,
          crop: [17, 6, 0, 0],
          flipX: true,
          w: 52,
          h: 8,
          overrideColor: "#ff8080"
        }
      ]
    ]
  },
  "weapons.sphere": {
    attributes: {
      width: 16,
      height: 16,
      ro: [8, 8]
    },
    sprites: [["sphere1", { z: -2, crop: [0, 17, 17, 0], key: "main" }]],
    animations: {
      default: {
        repeat: true,
        duration: 300,
        timeline: [
          {
            start: 0.0,
            end: 1.0,
            spriteAnimation: {
              key: "main",
              sprites: ["sphere1", "sphere2"]
            }
          }
        ]
      }
    }
  },
  "weapons.rocket": {
    attributes: {
      width: 47,
      height: 16,
      ro: [4, 8],
      scale: 1
    },
    hitbox: [2, 3, 45, 3, 45, 12, 2, 12],
    sprites: [["standardRocket", { z: 1 }]],
    attachHooks: [
      ["trail", { x: 47, y: 8, z: -1, attachAlign: ["center", "left"] }],
      ["tip", { x: 0, y: 8, z: 1, attachAlign: ["center", "left"] }]
    ],
    frames: {
      small: {
        attributes: {
          scale: 0.8
        }
      }
    }
  },
  "weapons.explosion": {
    attributes: {
      width: 96,
      height: 96,
      ro: [48, 48]
    },
    sprites: [["explosion1", { scale: 1, x: 0, y: 0, key: "main" }]],
    animations: {
      default: {
        duration: 350,
        timeline: [
          {
            start: 0.0,
            end: 1.0,
            spriteAnimation: {
              key: "main",
              sprites: [
                "explosion1",
                "explosion2",
                "explosion3",
                "explosion4",
                "explosion5",
                "explosion6",
                "explosion7",
                "explosion8",
                "explosion9",
                "explosion10",
                "explosion11",
                "explosion12",
                "explosion13",
                "explosion14",
                "explosion15",
                "explosion16",
                "explosion17",
                "explosion18",
                "explosion19",
                "explosion20"
              ]
            }
          }
        ]
      }
    }
  },
  "weapons.largeExplosion": {
    attributes: {
      width: 96,
      height: 96,
      scale: 1.75,
      ro: [84, 84]
    },
    sprites: [["explosion1", { scale: 1, x: 0, y: 0, key: "main" }]],
    animations: {
      default: {
        duration: 350,
        timeline: [
          {
            start: 0.0,
            end: 1.0,
            spriteAnimation: {
              key: "main",
              sprites: [
                "explosion1",
                "explosion2",
                "explosion3",
                "explosion4",
                "explosion5",
                "explosion6",
                "explosion7",
                "explosion8",
                "explosion9",
                "explosion10",
                "explosion11",
                "explosion12",
                "explosion13",
                "explosion14",
                "explosion15",
                "explosion16",
                "explosion17",
                "explosion18",
                "explosion19",
                "explosion20"
              ]
            }
          }
        ]
      }
    }
  },
  "weapons.solidHit": {
    attributes: {
      width: 8,
      height: 8
    },
    sprites: [["explosion1", { scale: 0.25, x: -45, y: -45, key: "main" }]],
    animations: {
      default: {
        duration: 100,
        timeline: [
          {
            start: 0.0,
            end: 1.0,
            spriteAnimation: {
              key: "main",
              sprites: [
                "explosion1",
                "explosion3",
                "explosion5",
                "explosion7",
                "explosion9",
                "explosion11",
                "explosion13",
                "explosion15",
                "explosion17"
              ]
            }
          }
        ]
      }
    }
  },
  "weapons.waterHit": {
    attributes: {
      width: 8,
      height: 8
    },
    sprites: [
      [
        "explosion5",
        {
          scaleX: 0.25,
          scaleY: 0.25,
          x: -45,
          y: -45,
          overrideColor: "#ffffff",
          key: "main"
        }
      ]
    ],
    frames: {
      high: {
        main: { scaleX: 0.25, scaleY: 0.75, y: -27 }
      },
      end: {
        main: { scaleX: 0.25, scaleY: 0.25, y: -45, alpha: 0 }
      }
    },
    animations: {
      default: {
        duration: 300,
        timeline: [
          {
            start: 0.0,
            end: 0.3,
            startFrame: "default",
            endFrame: "high"
          },
          {
            start: 0.6,
            end: 1.0,
            startFrame: "high",
            endFrame: "end"
          }
        ]
      }
    }
  },
  "weapons.muzzleFlash": {
    attributes: {
      width: 32,
      height: 32,
      ro: [28, 16]
    },
    sprites: [["muzzleFlash", { z: 20, flipX: true, key: "flash" }]],
    frames: {
      normal: {
        flash: { alpha: 1.0 }
      },
      end: {
        flash: { alpha: 0 }
      }
    },
    animations: {
      default: {
        repeat: false,
        easing: "linear",
        duration: 300,
        timeline: [
          {
            start: 0.0,
            end: 0.3,
            startFrame: "end",
            endFrame: "normal"
          },
          {
            start: 0.7,
            end: 1.0,
            startFrame: "normal",
            endFrame: "end"
          }
        ]
      }
    }
  }
};
