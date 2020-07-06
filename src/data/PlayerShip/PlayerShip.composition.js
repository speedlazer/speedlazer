const scale = 0.8;

export default {
  "player.ship": {
    attributes: {
      width: 80 * scale,
      height: 38 * scale
    },
    sprites: [
      [
        "playerShip",
        {
          flipX: true,
          key: "main",
          accentColor: "#ff0000",
          w: 80 * scale,
          h: 50 * scale
        }
      ]
    ],
    hitbox: [
      10 * scale,
      14 * scale,
      64 * scale,
      18 * scale,
      75 * scale,
      38 * scale,
      20 * scale,
      38 * scale
    ],
    attachHooks: [
      [
        "explosion",
        {
          x: 26 * scale,
          y: 18 * scale,
          z: 2,
          attachAlign: ["center", "center"]
        }
      ],
      [
        "mainWeapon",
        {
          x: 48 * scale,
          y: 36 * scale,
          z: 1,
          attachAlign: ["center", "right"]
        }
      ],
      [
        "laserWeapon",
        {
          x: 48 * scale,
          y: 36 * scale,
          z: 4,
          attachAlign: ["center", "right"]
        }
      ],
      [
        "laserCharge",
        {
          x: 48 * scale,
          y: 36 * scale,
          z: 4,
          attachAlign: ["center", "right"]
        }
      ],
      [
        "trail",
        {
          x: 0 * scale,
          y: 22 * scale,
          z: 4,
          attachAlign: ["center", "left"]
        }
      ],
      [
        "reverseTrail",
        {
          x: 38 * scale,
          y: 42 * scale,
          z: 1,
          attachAlign: ["center", "right"]
        }
      ],
      [
        "reverseTrail2",
        {
          x: 38 * scale,
          y: 32 * scale,
          z: -3,
          attachAlign: ["center", "right"]
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
