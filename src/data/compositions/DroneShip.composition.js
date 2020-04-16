export default {
  "droneShip.main": {
    attributes: {
      width: 600,
      height: 160
    },
    sprites: [
      ["aircraftCarrierStart", { x: 0 }],
      ["aircraftCarrierTopFlat", { x: 192 }],
      ["aircraftCarrierTopFlat", { x: 320 }],
      ["aircraftCarrierBottomFlat", { x: 192, y: 64 }],
      ["aircraftCarrierBottomSpace", { x: 320, y: 64 }],
      ["aircraftCarrierEnd", { x: 448, y: 0 }]
    ],
    attachHooks: [
      ["boxLocation1", { x: 420, y: 30, z: 13 }],
      ["cabin1", { x: 164, y: 24, z: 7, attachAlign: ["bottom", "left"] }],
      ["hatch1", { x: 220, y: 32, z: 2, attachAlign: ["top", "left"] }],
      ["bottom", { x: 10, y: 130, z: 2, attachAlign: ["top", "left"] }],
      ["gun", { x: 360, y: 90, z: 22, attachAlign: ["bottom", "center"] }]
    ]
  },
  "droneShip.cabin": {
    attributes: {
      width: 104,
      height: 44
    },
    sprites: [
      ["aircraftCarrierLowCabinStart", { x: -12, y: 0, flipX: true }],
      ["aircraftCarrierLowCabin", { x: 20, y: 0 }],
      ["aircraftCarrierLowCabin", { x: 52, y: 0 }],
      ["aircraftCarrierLowCabinStart", { x: 84, y: 0 }]
    ],
    attachHooks: [
      ["radar", { x: 48, y: 22, z: 7, attachAlign: ["bottom", "center"] }]
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
