export default {
  drone: {
    attributes: {
      width: 60,
      height: 50,
      scale: 0.7
    },
    hitbox: [0, 20, 50, 0, 60, 40, 0, 50],
    sprites: [["standardDrone", { x: -2, y: -11, key: "main" }]],
    attachHooks: [
      [
        "trail",
        {
          x: 42,
          y: 12,
          z: -2,
          attachAlign: ["center", "right"],
          attachTo: "main"
        }
      ],
      [
        "explosion",
        {
          x: 22,
          y: 18,
          z: 2,
          attachAlign: ["center", "center"],
          attachTo: "main"
        }
      ],
      [
        "smoke",
        {
          x: 22,
          y: 18,
          z: -5,
          attachAlign: ["center", "center"],
          attachTo: "main"
        }
      ]
    ],
    frames: {
      damaged: {
        main: {
          sprite: "standardDroneDamage"
        }
      },
      turned: {
        flipX: true
      },
      hidden: {
        main: {
          hidden: true,
          alpha: 0
        }
      }
    }
  }
};
