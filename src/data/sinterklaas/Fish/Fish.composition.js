export default {
  fish: {
    attributes: {
      width: 64,
      height: 64,
    },
    hitbox: [0, 5, 32, 0, 64, 32, 50, 40, 0, 20],
    sprites: [["fish", { x: -2, y: -11, z: -80, key: "main" }]],
    attachHooks: [
      [
        "trail",
        {
          x: 54,
          y: 28,
          z: -82,
          attachAlign: ["center", "right"],
          attachTo: "main",
        },
      ],
      [
        "explosion",
        {
          x: 22,
          y: 18,
          z: 2,
          attachAlign: ["center", "center"],
          attachTo: "main",
        },
      ],
      [
        "smoke",
        {
          x: 22,
          y: 18,
          z: -5,
          attachAlign: ["center", "center"],
          attachTo: "main",
        },
      ],
    ],
    frames: {
      damaged: {
        main: {
          sprite: "fish",
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
};
