export default {
  "city.horizon": {
    attributes: {
      width: 256,
      height: 160,
    },
    sprites: [["coast", { z: -598, horizon: [0.9, 0.8] }]],
  },
  "city.cloud": {
    attributes: {
      width: 256,
      height: 960,
    },
    sprites: [
      [
        "cloud",
        { z: -398, horizon: [0.95, 0.9], alpha: 0.9, scale: 0.5, key: "main" },
      ],
    ],
    frames: {
      close: {
        main: { scale: 0.8, horizon: [0.85, 0.85] },
      },
    },
  },
  "city.horizonStart": {
    attributes: {
      width: 256,
      height: 160,
    },
    sprites: [["coastStart", { z: -598, horizon: [0.9, 0.8] }]],
    frames: {
      flipped: {
        flipX: true,
      },
    },
  },
  "city.cityStart": {
    attributes: {
      width: 512,
      height: 288,
    },
    sprites: [["cityStart", { z: -305, horizon: [0.4, 0.4] }]],
    frames: {
      flipped: {
        flipX: true,
      },
    },
  },
  "city.city": {
    attributes: {
      width: 512,
      height: 288,
    },
    sprites: [["city", { z: -305, horizon: [0.4, 0.4] }]],
  },
  "city.cityDistance": {
    attributes: {
      width: 256,
      height: 224,
    },
    sprites: [["cityDistance", { z: -598, horizon: [0.9, 0.7] }]],
  },
  "city.layer2": {
    attributes: {
      width: 384,
      height: 256,
    },
    hitbox: [240, 120, 240, 0, 295, 0, 295, 120],
    sprites: [
      ["cityLayer2", { z: -505, horizon: [0.6, 0.6] }],
      [
        "cityLayer2",
        { z: -505, y: 256, h: 80, crop: [254, 0, 0, 0], horizon: [0.6, 0.6] },
      ],
    ],
  },
  explosion: {
    attributes: { width: 96, height: 96 },
    sprites: [["explosion1", { key: "main" }]],
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
                "explosion20",
              ],
            },
          },
        ],
      },
    },
  },
};
