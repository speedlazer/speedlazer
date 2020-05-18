export default {
  "intro.ship": {
    attributes: {
      width: 800,
      height: 108
    },
    sprites: [
      ["aircraftCarrierBottomFlat", { x: -64, y: 10, z: 5 }],
      ["aircraftCarrierBottomSpace", { x: 64, y: 10, z: 5 }],
      ["aircraftCarrierBottomFlat", { x: 192, y: 10, z: 5 }],
      ["aircraftCarrierBottomFlat", { x: 320, y: 10, z: 5 }],
      ["aircraftCarrierBottomFlat", { x: 448, y: 10, z: 5 }],
      ["aircraftCarrierBottomFlat", { x: 576, y: 10, z: 5 }],
      ["aircraftCarrierEnd", { x: 704, y: -54 }],

      ["aircraftCarrierTopFlat", { x: -64, y: -54 }],
      ["aircraftCarrierTopFlat", { x: 64, y: -54 }],
      ["aircraftCarrierTopFlat", { x: 192, y: -54 }],
      ["aircraftCarrierTopFlat", { x: 320, y: -54 }],
      ["aircraftCarrierTopFlat", { x: 448, y: -54 }],
      ["aircraftCarrierTopFlat", { x: 576, y: -54 }],
      ["boxes", { x: 622, y: -64, z: 5 }],

      ["aircraftCarrierCabinStart", { x: 96, y: -178, z: 6 }],
      ["aircraftCarrierCabinRadar", { x: 128, y: -178, z: 6 }],
      ["aircraftCarrierCabin", { x: 192, y: -178, z: 6 }],
      ["aircraftCarrierCabinRadar", { x: 256, y: -178, z: 6 }],
      ["aircraftCarrierCabin", { x: 320, y: -178, z: 6 }],
      ["aircraftCarrierCabinEnd", { x: 384, y: -178, z: 6 }],

      ["aircraftCarrierRadar", { x: 232, y: -185, z: 6 }],
      ["aircraftCarrierAntenna", { x: 316, y: -227, z: 6 }],
      ["aircraftCarrierAntenna", { x: 158, y: -227, z: 6 }],
      ["aircraftCarrier7", { x: 192, y: -116, z: 6 }],
      ["aircraftCarrier7", { x: 320, y: -116, z: 6 }]
    ],
    attachHooks: [
      ["boxLocation1", { x: 650, y: -10, z: 23 }],
      ["boxLocation2", { x: 714, y: -16, z: 23 }],
      ["hatch1", { x: 220, y: -20, z: 2, attachAlign: ["top", "left"] }],
      [
        "heliStart",
        { x: 612, y: -20, z: 6, attachAlign: ["bottom", "center"] }
      ],
      ["hatch2", { x: 412, y: -20, z: 2, attachAlign: ["top", "left"] }],
      ["bottom", { x: -64, y: 70, z: 21, attachAlign: ["top", "left"] }]
    ]
  },
  "intro.boxes": {
    attributes: {
      width: 32,
      height: 32
    },
    hitbox: [0, 7, 32, 7, 32, 32, 0, 32],
    sprites: [["boxes", { x: 0, y: 0, key: "main" }]],
    frames: {
      falling: {
        main: { sprite: "boxesFalling" }
      }
    }
  },
  "intro.parachute": {
    attributes: {
      width: 32,
      height: 32,
      rotation: 0,
      ro: [14, 2]
    },
    sprites: [["chute", { x: 0, y: 0, horizon: [0.6, 0.6] }]],
    frames: {
      left: {
        attributes: {
          rotation: 20
        }
      },
      right: {
        attributes: {
          rotation: -20
        }
      }
    },
    animations: {
      default: {
        repeat: true,
        easing: "linear",
        duration: 5000,
        timeline: [
          {
            start: 0.0,
            end: 0.5,
            startFrame: "left",
            endFrame: "right"
          },
          {
            start: 0.5,
            end: 1,
            startFrame: "right",
            endFrame: "left"
          }
        ]
      }
    }
  }
};
