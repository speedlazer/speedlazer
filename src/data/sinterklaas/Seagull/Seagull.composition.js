export default {
  seagull: {
    attributes: {
      width: 96,
      height: 80,
    },
    hitbox: [19, 37, 50, 15, 80, 50, 40, 60, 5, 45],
    sprites: [["seagull", { x: -2, y: -11, key: "main" }]],
    attachHooks: [
      [
        "gun",
        {
          x: 65,
          y: 53,
          z: -2,
          attachAlign: ["center", "right"],
          attachTo: "main",
        },
      ],
      [
        "explosion",
        {
          x: 42,
          y: 38,
          z: 2,
          attachAlign: ["center", "center"],
          attachTo: "main",
        },
      ],
      [
        "smoke",
        {
          x: 42,
          y: 38,
          z: -5,
          attachAlign: ["center", "center"],
          attachTo: "main",
        },
      ],
    ],
    frames: {
      damaged: {
        main: {
          sprite: "seagull",
        },
      },
      turned: {
        flipX: true,
      },
      hidden: {
        main: {
          hidden: true,
          alpha: 0,
        },
      },
    },
  },
  flats: {
    attributes: {
      width: 32,
      height: 32,
      ro: [28, 4],
    },
    hitbox: [26, 2, 0, 20, 5, 30, 16, 26, 28, 4],
    sprites: [["flats", { key: "main", scale: 0.7 }]],
  },
};
