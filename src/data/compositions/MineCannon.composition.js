export default {
  mineCannon: {
    attributes: {
      width: 64,
      height: 42
    },
    sprites: [
      ["turretFoot", { x: 32, y: 24, key: "foot" }],
      [
        "mineCannon",
        {
          x: 0,
          y: 0,
          key: "barrel",
          ro: [52, 24],
          hitbox: [5, 10, 64, 10, 64, 28, 5, 28]
        }
      ],
      [
        "muzzleFlash",
        {
          x: -20,
          y: 5,
          z: -1,
          alpha: 0,
          scaleY: 1.5,
          key: "flash",
          flipX: true,
          attachTo: "barrel"
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
          x: 48,
          y: 32,
          z: -1,
          attachAlign: ["center", "center"]
        }
      ],
      [
        "explosion",
        {
          x: 48,
          y: 16,
          z: 2,
          attachAlign: ["center", "center"],
          attachTo: "main"
        }
      ]
    ],
    frames: {
      dead: {
        flash: { alpha: 0 },
        barrel: { alpha: 0 }
      },
      aimHigh: {
        barrel: { rotation: 50 }
      },
      aimLow: {
        barrel: { rotation: 10 }
      },
      shotVis: {
        flash: { alpha: 1 }
      },
      shotHid: {
        flash: { alpha: 0 }
      }
    },
    animations: {
      blinking: {
        repeat: false,
        easing: "linear",
        duration: 450,
        timeline: [
          {
            start: 0.0,
            end: 0.1,
            startFrame: "shotHid",
            endFrame: "shotVis"
          },
          {
            start: 0.3,
            end: 1.0,
            startFrame: "shotVis",
            endFrame: "shotHid"
          }
        ]
      }
    }
  }
};
