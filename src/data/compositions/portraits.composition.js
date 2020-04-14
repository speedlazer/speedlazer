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
  }
};
