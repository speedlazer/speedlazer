export default {
  "portraits.pilot": {
    attributes: {
      width: 128,
      height: 128
    },
    sprites: [["pilot1", { key: "pilot" }]],
    frames: {
      idle: {
        pilot: { sprite: "pilot1" }
      },
      talk: {
        pilot: { sprite: "pilot2" }
      }
    },
    animations: {
      talking: {
        repeat: true,
        easing: "linear",
        duration: 500,
        timeline: [
          {
            start: 0.0,
            end: 0.5,
            startFrame: "idle",
            endFrame: "talk"
          },
          {
            start: 0.5,
            end: 1.0,
            startFrame: "talk",
            endFrame: "idle"
          }
        ]
      }
    }
  },
  "portraits.general": {
    attributes: {
      width: 128,
      height: 128
    },
    sprites: [["general2", { key: "main" }]],
    frames: {
      idle: {
        main: { sprite: "general2" }
      },
      talk: {
        main: { sprite: "general1" }
      }
    },
    animations: {
      talking: {
        repeat: true,
        easing: "linear",
        duration: 500,
        timeline: [
          {
            start: 0.0,
            end: 0.5,
            startFrame: "idle",
            endFrame: "talk"
          },
          {
            start: 0.5,
            end: 1.0,
            startFrame: "talk",
            endFrame: "idle"
          }
        ]
      }
    }
  },
  "portraits.drone": {
    attributes: {
      width: 90,
      height: 68
    },
    sprites: [
      [
        "standardLargeDrone",
        { key: "portrait", w: 90, h: 58, crop: [20, 60, 50, 0] }
      ],
      [
        "sphere2",
        { z: 1, x: 5, y: 25, w: 20, h: 20, crop: [0, 0, 17, 21], key: "eye" }
      ]
    ],
    frames: {
      idle: {
        eye: {
          x: 0,
          y: 0,
          alpha: 1
        }
      },
      eyeMove: {
        eye: {
          x: 24,
          y: -16,
          alpha: 0.6
        }
      },
      eyeDisappear: {
        eye: {
          x: 24,
          y: -16,
          alpha: 0.0
        }
      },
      eyeReset: {
        eye: {
          x: 0,
          y: 0,
          alpha: 0.0
        }
      },
      eyeAppear: {
        eye: {
          x: 0,
          y: 0,
          alpha: 1.0
        }
      }
    },
    animations: {
      talking: {
        repeat: true,
        easing: "linear",
        duration: 800,
        timeline: [
          {
            start: 0.0,
            end: 0.7,
            startFrame: "eyeAppear",
            endFrame: "eyeMove"
          },
          {
            start: 0.7,
            end: 0.8,
            startFrame: "eyeMove",
            endFrame: "eyeDisappear"
          },
          {
            start: 0.8,
            end: 0.9,
            startFrame: "eyeDisappear",
            endFrame: "eyeReset"
          },
          {
            start: 0.9,
            end: 1,
            startFrame: "eyeReset",
            endFrame: "eyeAppear"
          }
        ]
      }
    }
  }
};
