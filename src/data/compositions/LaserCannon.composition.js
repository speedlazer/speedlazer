export default {
  laserCannon: {
    attributes: {
      width: 100,
      height: 42
    },
    hitbox: [64, 24, 96, 24, 96, 45, 64, 45],
    sprites: [
      ["turretFoot", { x: 64, y: 24, key: "foot" }],
      [
        "laserGunHandle",
        {
          x: 32,
          y: 0,
          key: "barrel",
          ro: [50, 24],
          hitbox: [5, 10, 94, 10, 94, 28, 5, 28]
        }
      ],
      [
        "laserGunBarrel",
        {
          x: 0,
          y: 0,
          key: "top",
          attachTo: "barrel",
          ro: [30, 8],
          crop: [0, 0, 16, 0]
        }
      ],
      [
        "laserGunBarrel",
        {
          x: 0,
          y: 15,
          key: "bottom",
          attachTo: "barrel",
          ro: [30, 8],
          crop: [14, 0, 0, 0]
        }
      ],
      [
        "laserGunCore",
        {
          x: 6,
          y: 0,
          z: -2,
          key: "core1",
          attachTo: "barrel"
        }
      ],
      [
        "laserGunCore",
        {
          x: 35,
          y: 0,
          z: -3,
          key: "core2",
          attachTo: "core1"
        }
      ]
    ],
    attachHooks: [
      [
        "gun",
        {
          x: 5,
          y: 18,
          z: -1,
          attachAlign: ["center", "left"],
          attachTo: "barrel"
        }
      ],
      [
        "charge",
        {
          x: 62,
          y: 15,
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
      down: {
        barrel: { rotation: 0 }
      },
      half: {
        barrel: { rotation: 45 }
      },
      up: {
        barrel: { rotation: 90 }
      },
      open: {
        top: { rotation: -2, ry: -5 },
        bottom: { rotation: 2, ry: 5 },
        core1: { rx: -3 },
        core2: { overrideColor: null }
      },
      charge: {
        top: { rotation: -2, ry: -5 },
        bottom: { rotation: 2, ry: 5 },
        core1: { rx: -3, overrideColor: "#ff8040" },
        core2: { overrideColor: "#ff8040" }
      },
      done: {
        core1: { overrideColor: null },
        core2: { overrideColor: null }
      },
      close: {
        top: { rotation: 0, ry: 0 },
        bottom: { rotation: 0, ry: 0 },
        core1: { rx: 0 }
      },
      dead1: {
        barrel: { rotation: -90, y: -100, x: 0 },
        core1: { x: -3, overrideColor: "#505050" },
        core2: { overrideColor: "#505050" }
      },
      dead2: {
        foot: { z: 5 },
        barrel: { rotation: -180, y: -15, x: -40 }
      },
      dead3: {
        foot: { z: 5 },
        barrel: { rotation: -180, y: -25, x: -40 }
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
