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
      damaged: {
        main: {
          sprite: "playerShipDamaged"
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
    }
  }
};
