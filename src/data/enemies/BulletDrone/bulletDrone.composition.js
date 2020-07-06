export default {
  bulletDrone: {
    attributes: {
      width: 53,
      height: 32
    },
    hitbox: [0, 20, 20, 0, 50, 5, 50, 32, 5, 30],
    sprites: [
      ["bulletDrone", { x: -7, key: "main" }],
      ["helicopterGun", { x: 25, y: 15, z: -1, key: "gun", ro: [20, 10] }]
    ],
    attachHooks: [
      [
        "trail",
        {
          x: 55,
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
          y: 15,
          z: 2,
          attachAlign: ["center", "center"],
          attachTo: "main"
        }
      ],
      [
        "smoke",
        {
          x: 22,
          y: 15,
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
