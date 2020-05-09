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

      ["aircraftCarrierHole", { x: 220, y: 120, z: 1 }],
      ["aircraftCarrierHole", { x: 310, y: 120, z: 1 }],
      ["aircraftCarrierHole", { x: 450, y: 120, z: 1 }],
      ["aircraftCarrierHole", { x: 540, y: 120, z: 1 }],
      ["aircraftCarrierHole", { x: 630, y: 120, z: 1 }],
      ["aircraftCarrierHole", { x: 720, y: 120, z: 1 }],
      ["aircraftCarrierHole", { x: 810, y: 120, z: 1 }],
      ["aircraftCarrierHole", { x: 960, y: 120, z: 1 }],
      ["aircraftCarrierHole", { x: 1050, y: 120, z: 1 }]
    ],
    attachHooks: [
      [
        "mineCannon",
        { x: 120, y: 48, z: 8, attachAlign: ["bottom", "center"] }
      ],
      ["deckGun1", { x: 356, y: 90, z: 20, attachAlign: ["bottom", "center"] }],
      ["deckGun2", { x: 866, y: 90, z: 20, attachAlign: ["bottom", "center"] }],
      ["deckGun3", { x: 1200, y: 50, z: 3, attachAlign: ["bottom", "center"] }],
      ["package", { x: 1170, y: 70, z: 2, attachAlign: ["bottom", "center"] }],
      ["cabin1", { x: 294, y: 24, z: 6, attachAlign: ["bottom", "left"] }],
      ["heliPlace1", { x: 540, y: 24, z: 2, attachAlign: ["bottom", "left"] }],
      ["heliPlace2", { x: 700, y: 24, z: 1, attachAlign: ["bottom", "left"] }],
      ["cabin2", { x: 832, y: 24, z: 6, attachAlign: ["bottom", "left"] }],
      ["engineCore", { x: 960, y: -62, z: 8, attachAlign: ["top", "left"] }],
      ["hatch1", { x: 420, y: 32, z: 2, attachAlign: ["top", "left"] }],
      ["hatch2", { x: 612, y: 32, z: 2, attachAlign: ["top", "left"] }],
      ["hatch3", { x: 804, y: 32, z: 2, attachAlign: ["top", "left"] }],
      ["bottom", { x: 10, y: 135, z: 21, attachAlign: ["top", "left"] }],
      ["cabin1burn", { x: 314, y: -16, z: 2, attachAlign: ["top", "left"] }],
      ["cabin2burn", { x: 850, y: -16, z: 2, attachAlign: ["top", "left"] }],
      [
        "cabin1explode",
        { x: 360, y: -56, z: 10, attachAlign: ["bottom", "center"] }
      ],
      [
        "cabin2explode",
        { x: 950, y: -56, z: 14, attachAlign: ["bottom", "center"] }
      ]
    ],
    frames: {
      risen: {
        bottom: { y: 25 }
      },
      lowered: {
        bottom: { y: 0 }
      }
    }
  },
  "battleship.firstCabin": {
    attributes: {
      width: 192,
      height: 130
    },
    hitbox: [0, 128, 0, 50, 32, 32, 32, 0, 193, 0, 193, 128],
    sprites: [
      [
        "aircraftCarrierCabinEnd",
        { x: -12, y: -15, flipX: true, crop: [0, 4, 0, 0] }
      ],
      ["aircraftCarrierCabinRadar", { x: 48, y: -15, flipX: true }],
      ["aircraftCarrierCabin", { x: 112, y: -15 }],
      ["aircraftCarrierCabinStart", { x: 176, y: -15, flipX: true }],
      ["aircraftCarrierAntenna", { x: 128, y: -65, z: 1, flipX: true }],
      ["aircraftCarrier5", { x: 128, y: 55, z: 1 }]
    ],
    attachHooks: [
      ["radar", { x: 72, y: 11, z: 1, attachAlign: ["bottom", "center"] }]
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
      [
        "aircraftCarrierDoor",
        { x: 134, y: 56, w: 84, z: 4, key: "door", hideAbove: 56 }
      ],
      ["aircraftCarrier5", { x: 76, y: 40, z: 1 }]
    ],
    frames: {
      open: {
        door: { y: -68 }
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
    sprites: [
      ["aircraftCarrierEngine", { x: 0, y: 0, key: "cabin" }],
      [
        "aircraftCarrierEngineMeter",
        { x: 32, y: 26, ro: [16, 22], key: "meter", attachTo: "cabin" }
      ]
    ],
    attachHooks: [["smoke", { x: 36, y: 52, z: -1 }]],
    frames: {
      perc0: { meter: { rotation: -90 } },
      perc25: { meter: { rotation: -45 } },
      perc50: { meter: { rotation: 0 } },
      perc75: { meter: { rotation: 45 } },
      perc100: { meter: { rotation: 90 } },
      shake1: { cabin: { x: 2, y: -1 }, meter: { rotation: 90 } },
      shake2: { cabin: { x: -2, y: 1 }, meter: { rotation: 85 } },
      shake3: { cabin: { x: 1 } },
      shake4: { cabin: { x: -1 } }
    },
    animations: {
      shake: {
        repeat: true,
        duration: 500,
        timeline: [
          {
            start: 0,
            end: 0.5,
            startFrame: "shake3",
            endFrame: "shake4"
          },
          {
            start: 0.5,
            end: 1,
            startFrame: "shake4",
            endFrame: "shake3"
          }
        ]
      },
      heavyShake: {
        repeat: true,
        duration: 100,
        timeline: [
          {
            start: 0,
            end: 0.5,
            startFrame: "shake1",
            endFrame: "shake2"
          },
          {
            start: 0,
            end: 1,
            startFrame: "shake1",
            endFrame: "shake2"
          }
        ]
      }
    }
  }
};
