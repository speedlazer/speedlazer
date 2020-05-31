export default {
  bulletCannon: {
    attributes: {
      width: 100,
      height: 42
    },
    hitbox: [64, 24, 96, 24, 96, 45, 64, 45],
    sprites: [
      ["turretFoot", { x: 64, y: 24, key: "foot" }],
      [
        "bulletCannon",
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
          z: 2,
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
      },
      dead1: {
        barrel: { rotation: -90, y: -100, x: 0 }
      },
      dead2: {
        barrel: { rotation: -180, y: -5, x: -40, z: -2 }
      },
      dead3: {
        barrel: { rotation: -180, y: -15, x: -40, z: -2 }
      },
      mirrored: {
        flipX: true
      }
    },
    animations: {
      dead: {
        duration: 1000,
        startEase: { duration: 250, easing: "easeOutQuad" },
        easing: "easeInQuad",
        timeline: [
          {
            start: 0,
            end: 0.5,
            startFrame: "dead1",
            endFrame: "dead2"
          },
          {
            start: 0.5,
            end: 0.75,
            startFrame: "dead2",
            endFrame: "dead3"
          },
          {
            start: 0.75,
            end: 1.0,
            startFrame: "dead3",
            endFrame: "dead2"
          }
        ]
      }
    }
  }
};
