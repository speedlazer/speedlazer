const compositions = {
  jinte: {
    attributes: {
      width: 160,
      height: 192,
    },
    hitbox: [
      80, 32, 92, 32, 140, 90, 150, 108, 120, 128, 105, 143, 105, 166, 40, 166,
      28, 128, 28, 100, 65, 80,
    ],
    sprites: [
      ["playerTop", { x: 0, y: 0, key: "upper", w: 160, h: 128 }],
      ["playerBottom1", { x: 0, y: 128, key: "lower", w: 160, h: 64 }],
    ],
    frames: {
      fly1: {
        lower: { sprite: "playerBottom1" },
      },
      fly2: {
        lower: { sprite: "playerBottom2" },
      },
      hidden: {
        upper: {
          hidden: true,
          alpha: 0,
        },
        lower: {
          hidden: true,
          alpha: 0,
        },
      },
    },
    attachHooks: [
      ["gun", { x: 84, y: 82, attachAlign: ["center", "right"] }],
      ["frontFoot", { x: 102, y: 162, attachAlign: ["center", "center"] }],
      ["backFoot", { x: 32, y: 162, attachAlign: ["center", "center"] }],
      ["center", { x: 70, y: 110, attachAlign: ["center", "center"] }],
    ],

    animations: {
      flying: {
        repeat: true,
        easing: "linear",
        startEase: { easing: "linear", duration: 250 },
        duration: 500,
        timeline: [
          { start: 0.0, end: 0.5, startFrame: "fly1", endFrame: "fly2" },
          { start: 0.5, end: 1.0, startFrame: "fly2", endFrame: "fly1" },
        ],
      },
    },
  },
  "portraits.jinte": {
    attributes: {
      width: 128,
      height: 128,
    },
    sprites: [["portraitJinte1", { key: "face" }]],
    frames: {
      idle: {
        face: { sprite: "portraitJinte1" },
      },
      talk: {
        face: { sprite: "portraitJinte2" },
      },
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
            endFrame: "talk",
          },
          {
            start: 0.5,
            end: 1.0,
            startFrame: "talk",
            endFrame: "idle",
          },
        ],
      },
    },
  },
  "portraits.jonas": {
    attributes: {
      width: 128,
      height: 224,
    },
    sprites: [["portraitJonas", { key: "face" }]],
    frames: {
      idle: {
        face: {},
      },
      talk: {
        face: {},
      },
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
            endFrame: "talk",
          },
          {
            start: 0.5,
            end: 1.0,
            startFrame: "talk",
            endFrame: "idle",
          },
        ],
      },
    },
  },
  "weapons.carrot": {
    attributes: {
      width: 32,
      height: 32,
      ro: [4, 14],
    },
    hitbox: [2, 14, 28, 14, 28, 20, 2, 20],
    sprites: [["carrot", { z: -2 }]],
  },
  "title.jinte": {
    attributes: {
      width: 416,
      height: 480,
      ro: [208, 240],
    },
    sprites: [["title", { z: 0, key: "jinte" }]],
    frames: {
      close: {
        jinte: {
          scale: 1.0,
        },
      },
      far: {
        jinte: {
          scale: 0.3,
        },
      },
    },
  },
};

export default compositions;
