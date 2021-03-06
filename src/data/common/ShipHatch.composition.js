export default {
  shipHatch: {
    attributes: {
      width: 128,
      height: 32
    },
    sprites: [
      ["aircraftCarrierOpenHatch", { y: -4, x: 0 }],
      [
        "aircraftCarrierHatchLid",
        { y: -2, x: 0, key: "lid", crop: [2, 0, 0, 0], z: 1 }
      ],
      ["aircraftCarrierWires", { x: 68, y: -20, z: -1 }],
      [
        "aircraftCarrierHatchLid",
        {
          x: 3,
          y: 80,
          z: 1,
          key: "floor",
          crop: [18, 3, 0, 0],
          hideBelow: 28
        }
      ]
    ],
    attachHooks: [
      [
        "payload",
        {
          x: 64,
          y: 86,
          z: 6,
          attachAlign: ["bottom", "center"],
          attachTo: "floor"
        }
      ]
    ],
    frames: {
      open: {
        lid: { x: -30, y: 16 },
        floor: { x: 0, y: 0 }
      },
      closed: {
        lid: { x: 0, y: 0 },
        floor: { x: 0, y: 0 }
      },
      risen: {
        lid: { x: -30, y: 16 },
        floor: { y: -65 }
      }
    }
  }
};
