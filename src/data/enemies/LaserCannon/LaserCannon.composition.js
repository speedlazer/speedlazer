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
        "laserGunCore",
        {
          x: 35,
          y: 0,
          z: 0,
          crop: [0, 13, 0, 0],
          key: "core1",
          attachTo: "barrel"
        }
      ],
      [
        "laserGunCore",
        {
          x: 6,
          y: 0,
          z: 0,
          crop: [0, 13, 0, 0],
          key: "core2",
          attachTo: "core1"
        }
      ],
      [
        "laserGunHandle",
        {
          x: 54,
          y: 0,
          key: "barrel",
          ro: [23, 15],
          hitbox: [-49, 10, 40, 0, 40, 28, -49, 28],
          crop: [0, 0, 0, 22]
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
      ]
    ],
    attachHooks: [
      [
        "gun",
        {
          x: 5,
          y: 15,
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
        "discharge",
        {
          x: 62,
          y: 15,
          z: -10,
          attachAlign: ["center", "left"],
          attachTo: "barrel"
        }
      ],
      [
        "smoke",
        {
          x: 80,
          y: 32,
          z: 4,
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
        core1: { rx: -6 },
        core2: { overrideColor: null }
      },
      charge: {
        core1: { rx: -6, overrideColor: "#ff8040" },
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
        foot: { z: 5 },
        barrel: { rotation: -90, y: -100, x: 0, overrideColor: "#606060" },
        core1: { x: -3, overrideColor: "#505050" },
        core2: { overrideColor: "#505050" },
        top: { overrideColor: "#606060" },
        bottom: { overrideColor: "#606060" }
      },
      dead2: {
        foot: { z: 5 },
        core1: { x: -3, overrideColor: "#505050" },
        core2: { overrideColor: "#505050" },
        barrel: { rotation: -180, y: -5, x: -40, overrideColor: "#606060" }
      },
      dead3: {
        foot: { z: 5 },
        core1: { x: -3, overrideColor: "#505050" },
        core2: { overrideColor: "#505050" },
        barrel: { rotation: -180, y: -9, x: -40, overrideColor: "#606060" }
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
