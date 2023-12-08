export default {
  bird: {
    attributes: {
      width: 60,
      height: 50,
    },
    hitbox: [0, 17, 50, 15, 40, 40, 0, 25],
    sprites: [["bird", { x: -2, y: -11, key: "main" }]],
    attachHooks: [
      [
        "trail",
        {
          x: 32,
          y: 18,
          z: -2,
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
          sprite: "bird",
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
