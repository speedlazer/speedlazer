export default {
  "battleship.deck": {
    attributes: {
      width: 1390,
      height: 170
    },
    hitbox: [20, 60, 1280, 60, 1280, 188, 20, 188],
    sprites: [
      ["aircraftCarrierStart", { x: 0 }],
      ["aircraftCarrierTopFlat", { x: 192 }],
      ["aircraftCarrierTopFlat", { x: 320 }],
      ["aircraftCarrierTopFlat", { x: 448 }],
      ["aircraftCarrierTopFlat", { x: 576 }],
      ["aircraftCarrierTopFlat", { x: 704 }],
      ["aircraftCarrierTopFlat", { x: 832 }],
      ["aircraftCarrierTopFlat", { x: 960 }],
      ["aircraftCarrierTopFlat", { x: 1088 }],
      ["aircraftCarrierEnd", { x: 1216 }],

      ["aircraftCarrierBottomFlat", { x: 192, y: 64 }],
      ["aircraftCarrierBottomSpace", { x: 320, y: 64 }],
      ["aircraftCarrierBottomFlat", { x: 448, y: 64 }],
      ["aircraftCarrierBottomFlat", { x: 576, y: 64 }],
      ["aircraftCarrierBottomFlat", { x: 704, y: 64 }],
      ["aircraftCarrierBottomSpace", { x: 832, y: 64 }],
      ["aircraftCarrierBottomFlat", { x: 960, y: 64 }],
      ["aircraftCarrierBottomFlat", { x: 1088, y: 64 }],

      ["aircraftCarrierHole", { x: 110, y: 120, z: 1 }],
      ["aircraftCarrierHole", { x: 190, y: 120, z: 1 }],
      ["aircraftCarrierHole", { x: 270, y: 120, z: 1 }],
      ["aircraftCarrierHole", { x: 430, y: 120, z: 1 }],
      ["aircraftCarrierHole", { x: 510, y: 120, z: 1 }],
      ["aircraftCarrierHole", { x: 590, y: 120, z: 1 }],
      ["aircraftCarrierHole", { x: 670, y: 120, z: 1 }],
      ["aircraftCarrierHole", { x: 750, y: 120, z: 1 }],
      ["aircraftCarrierHole", { x: 830, y: 120, z: 1 }]
    ],
    attachHooks: [
      ["cabin1", { x: 294, y: 24, z: 7, attachAlign: ["bottom", "left"] }],
      ["heliPlace1", { x: 496, y: 24, z: 2, attachAlign: ["bottom", "left"] }],
      ["heliPlace2", { x: 652, y: 24, z: 1, attachAlign: ["bottom", "left"] }],
      ["cabin2", { x: 832, y: 24, z: 7, attachAlign: ["bottom", "left"] }],
      ["engineCore", { x: 960, y: -62, z: 8, attachAlign: ["top", "left"] }],
      ["hatch1", { x: 320, y: 32, z: 2, attachAlign: ["top", "left"] }],
      ["hatch2", { x: 512, y: 32, z: 2, attachAlign: ["top", "left"] }],
      ["hatch3", { x: 704, y: 32, z: 2, attachAlign: ["top", "left"] }],
      ["bottom", { x: 10, y: 150, z: 2, attachAlign: ["top", "left"] }],
      ["cabin1burn", { x: 314, y: -16, z: 2, attachAlign: ["top", "left"] }],
      ["cabin2burn", { x: 850, y: -16, z: 2, attachAlign: ["top", "left"] }]
    ]
  },
  "battleship.firstCabin": {
    attributes: {
      width: 192,
      height: 130
    },
    sprites: [
      [
        "aircraftCarrierCabinEnd",
        { x: -12, y: -15, flipX: true, crop: [0, 4, 0, 0] }
      ],
      ["aircraftCarrierCabinRadar", { x: 48, y: -15, flipX: true }],
      ["aircraftCarrierCabin", { x: 112, y: -15 }],
      ["aircraftCarrierCabinStart", { x: 176, y: -15, flipX: true }],
      ["aircraftCarrierRadar", { x: 64, y: -23, z: 1 }],
      ["aircraftCarrierAntenna", { x: 128, y: -65, z: 1, flipX: true }],
      ["aircraftCarrier5", { x: 128, y: 55, z: 1 }]
    ]
  },
  "battleship.firstCabinDestroyed": {
    attributes: {
      width: 192,
      height: 66
    },
    sprites: [
      ["aircraftCarrierCabinEndBroken", { x: -16, y: -15, flipX: true }],
      ["aircraftCarrierCabinRadarBroken", { x: 48, y: -15, flipX: true }],
      ["aircraftCarrierCabinBroken", { x: 112, y: -15 }],
      ["aircraftCarrierCabinStartBroken", { x: 176, y: -15, flipX: true }]
    ]
  },
  "battleship.secondCabin": {
    attributes: {
      width: 256,
      height: 130
    },
    hitbox: [0, 55, 32, 40, 32, 0, 260, 0, 260, 128, 0, 128],
    sprites: [
      [
        "aircraftCarrierCabinEnd",
        { x: -12, y: -15, flipX: true, crop: [0, 4, 0, 0] }
      ],
      ["aircraftCarrierCabinRadar", { x: 48, y: -15, flipX: true }],
      ["aircraftCarrierCabin", { x: 112, y: -15 }],
      ["aircraftCarrierCabin", { x: 176, y: -15 }],
      ["aircraftCarrierCabinStart", { x: 240, y: -15, flipX: true }],
      ["aircraftCarrierAntenna", { x: 64, y: -63, z: 1, flipX: true }],
      ["aircraftCarrierAntenna", { x: 160, y: -63, z: 1, flipX: true }],
      ["aircraftCarrierClosed", { x: 128, y: 50, z: 1 }],
      ["aircraftCarrierDoor", { x: 134, y: 56, w: 84, z: 4, key: "door" }],
      ["aircraftCarrier5", { x: 76, y: 40, z: 1 }]
    ],
    frames: {
      open: {
        door: { y: -64 }
      }
    }
  },
  "battleship.secondCabinDestroyed": {
    attributes: {
      width: 256,
      height: 66
    },
    sprites: [
      ["aircraftCarrierCabinEndBroken", { x: -16, y: -15, flipX: true }],
      ["aircraftCarrierCabinRadarBroken", { x: 48, y: -15, flipX: true }],
      ["aircraftCarrierCabinBroken", { x: 112, y: -15 }],
      ["aircraftCarrierCabinBroken", { x: 176, y: -15 }],
      ["aircraftCarrierCabinStartBroken", { x: 240, y: -15, flipX: true }]
    ]
  },
  "battleship.engine": {
    attributes: {
      width: 96,
      height: 96
    },
    hitbox: [16, 16, 80, 16, 80, 80, 16, 80],
    sprites: [["aircraftCarrierEngine", { x: 0, y: 0 }]]
  }
};
