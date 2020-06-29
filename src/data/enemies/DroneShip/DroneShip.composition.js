export default {
  "droneShip.main": {
    attributes: {
      width: 600,
      height: 160
    },
    hitbox: [10, 60, 525, 60, 525, 188, 10, 188],
    sprites: [
      ["aircraftCarrierStart", { x: 0 }],
      ["aircraftCarrierTopFlat", { x: 192 }],
      ["aircraftCarrierTopFlat", { x: 320 }],
      ["aircraftCarrierBottomFlat", { x: 192, y: 64 }],
      ["aircraftCarrierBottomSpace", { x: 320, y: 64 }],
      ["aircraftCarrierEnd", { x: 448, y: 0 }],
      ["aircraftCarrierLowCabinStart", { x: 168, y: -28, flipX: true }],
      ["aircraftCarrierLowCabin", { x: 200, y: -28 }],
      ["aircraftCarrierLowCabin", { x: 232, y: -28 }],
      ["aircraftCarrierLowCabinStart", { x: 264, y: -28 }]
    ],
    attachHooks: [
      ["boxLocation1", { x: 420, y: 30, z: 13 }],
      ["radar", { x: 228, y: -6, z: 1, attachAlign: ["bottom", "center"] }],
      ["hatch1", { x: 220, y: 32, z: 2, attachAlign: ["top", "left"] }],
      ["bottom", { x: 10, y: 130, z: 2, attachAlign: ["top", "left"] }],
      ["gun", { x: 360, y: 90, z: 22, attachAlign: ["bottom", "center"] }]
    ]
  },
  "droneShip.radar": {
    attributes: {
      width: 64,
      height: 28
    },
    hitbox: [4, 24, 32, 0, 60, 24, 32, 42],
    sprites: [
      ["aircraftCarrierRadar", { x: 0, y: -6, key: "main" }],
      [
        "aircraftCarrierRadarEmit",
        { x: 0, y: 0, z: -1, key: "emit", scale: 0.9 }
      ]
    ],
    attachHooks: [
      [
        "smoke",
        {
          x: 32,
          y: 28,
          z: 1,
          attachAlign: ["center", "left"]
        }
      ],
      [
        "explosion",
        {
          x: 32,
          y: 28,
          z: 1,
          attachAlign: ["center", "center"]
        }
      ]
    ],
    frames: {
      emitStart: {
        emit: { x: 0, y: 0, alpha: 1, scale: 0.9 }
      },
      emitEnd: {
        emit: { x: 0, y: -32, alpha: 0.0, scale: 3.0 }
      },
      broken: {
        emit: { x: 0, y: -32, alpha: 0.0, scale: 3.0 },
        main: { hidden: true, sprite: "aircraftCarrierRadarBroken" }
      }
    },
    animations: {
      pulse: {
        repeat: true,
        easing: "linear",
        duration: 1500,
        timeline: [
          {
            start: 0.0,
            end: 1.0,
            startFrame: "emitStart",
            endFrame: "emitEnd"
          }
        ]
      }
    }
  }
};
