export default {
  cloth: {
    attributes: {
      width: 128,
      height: 96
    },
    sprites: [
      ["clothBottom", { x: 0, y: 69 }],
      ["cloth", { x: 0, y: 0, z: 4, hideBelow: 88, key: "cloth" }]
    ],
    frames: {
      up: {
        cloth: { y: 0 }
      },
      medium: {
        cloth: { y: 10 }
      },
      down: {
        cloth: { y: 100 }
      }
    }
  }
};
