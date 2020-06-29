export default {
  "player.ship": {
    attributes: {
      width: 80,
      height: 38
    },
    sprites: [
      [
        "playerShip",
        {
          flipX: true,
          key: "main",
          accentColor: "#ff0000",
          w: 80,
          h: 50
        }
      ]
    ],
    hitbox: [10, 14, 64, 18, 75, 38, 20, 38],
    attachHooks: [
      [
        "explosion",
        {
          x: 26,
          y: 18,
          z: 2,
          attachAlign: ["center", "center"],
          attachTo: "main"
        }
      ],
      [
        "mainWeapon",
        {
          x: 48,
          y: 36,
          z: 4,
          attachAlign: ["center", "right"],
          attachTo: "main"
        }
      ],
      [
        "laserWeapon",
        {
          x: 48,
          y: 36,
          z: 4,
          attachAlign: ["center", "right"],
          attachTo: "main"
        }
      ],
      [
        "laserCharge",
        {
          x: 48,
          y: 36,
          z: 4,
          attachAlign: ["center", "right"],
          attachTo: "main"
        }
      ],
      [
        "trail",
        {
          x: 0,
          y: 22,
          z: 4,
          attachAlign: ["center", "left"],
          attachTo: "main"
        }
      ],
      [
        "reverseTrail",
        {
          x: 38,
          y: 42,
          z: 1,
          attachAlign: ["center", "right"],
          attachTo: "main"
        }
      ],
      [
        "reverseTrail2",
        {
          x: 38,
          y: 32,
          z: -3,
          attachAlign: ["center", "right"],
          attachTo: "main"
        }
      ]
    ],
    frames: {
      normal: {
        main: {
          sprite: "playerShip"
        }
      },
      turn: {
        main: {
          sprite: "playerShipTurning"
        }
      },
      front: {
        main: {
          sprite: "playerShipFront"
        }
      },
      damaged: {
        main: {
          sprite: "playerShipDamaged"
        }
      },
      turnDamaged: {
        main: {
          sprite: "playerShipDamagedTurning"
        }
      },
      hidden: {
        main: {
          hidden: true,
          alpha: 0
        }
      },
      turned: {
        flipX: true
      }
    },
    animations: {
      turnAround: {
        easing: "linear",
        duration: 500,
        timeline: [
          {
            start: 0.0,
            end: 0.33,
            startFrame: "normal",
            endFrame: "turn"
          },
          {
            start: 0.33,
            end: 0.6,
            startFrame: "front",
            endFrame: "front"
          },
          {
            start: 0.6,
            end: 0.66,
            startFrame: "front",
            endFrame: "turned"
          },
          {
            start: 0.66,
            end: 0.95,
            startFrame: "turn",
            endFrame: "turn"
          },
          {
            start: 0.95,
            end: 1,
            startFrame: "turn",
            endFrame: "normal"
          }
        ]
      },
      turnAroundDamaged: {
        easing: "linear",
        duration: 500,
        timeline: [
          {
            start: 0.0,
            end: 0.33,
            startFrame: "damaged",
            endFrame: "turnDamaged"
          },
          {
            start: 0.33,
            end: 0.6,
            startFrame: "front",
            endFrame: "front"
          },
          {
            start: 0.6,
            end: 0.66,
            startFrame: "front",
            endFrame: "turned"
          },
          {
            start: 0.66,
            end: 0.95,
            startFrame: "turnDamaged",
            endFrame: "turnDamaged"
          },
          {
            start: 0.95,
            end: 1,
            startFrame: "turnDamaged",
            endFrame: "damaged"
          }
        ]
      }
    }
  }
};
