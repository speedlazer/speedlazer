export default {
  bulletCannon: {
    attributes: {
      width: 100,
      height: 42
    },
    sprites: [
      ["turretFoot", { x: 64, y: 24, key: "foot" }],
      [
        "mineCannon",
        {
          x: 0,
          y: 0,
          key: "barrel",
          ro: [82, 24],
          hitbox: [5, 10, 94, 10, 94, 28, 5, 28]
        }
      ]
    ],
    attachHooks: [
      [
        "gun",
        {
          x: 0,
          y: 18,
          z: 1,
          attachAlign: ["center", "left"],
          attachTo: "barrel"
        }
      ],
      [
        "smoke",
        {
          x: 80,
          y: 32,
          z: -1,
          attachAlign: ["center", "center"]
        }
      ],
      [
        "explosion",
        {
          x: 80,
          y: 16,
          z: 2,
          attachAlign: ["center", "center"],
          attachTo: "main"
        }
      ]
    ],
    frames: {
      dead: {
        barrel: { alpha: 0 }
      },
      up: {
        barrel: { rotation: 90 }
      }
    }
  }
};
