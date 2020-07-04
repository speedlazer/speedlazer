export default {
  "title.ship": {
    attributes: {
      width: 288,
      height: 160,
      scale: 1.0,
      ro: [144, 110]
    },
    sprites: [["titleShip", { key: "main", horizon: [0.0, 0.0], z: 200 }]],
    frames: {
      far: {
        attributes: {
          scale: 0.1,
          rotation: 0
        },
        main: {
          horizon: [1.0, 1.0]
        }
      },
      close: {
        attributes: {
          scale: 1.5,
          rotation: 20
        },
        main: {
          horizon: [0.0, 0.0]
        }
      }
    }
  },
  "title.gradient": {
    attributes: {
      width: 1230,
      height: 576
    },
    gradients: [
      {
        z: 2,
        w: 1230,
        h: 600,
        key: "sky",
        topColor: ["#000000", 1],
        bottomColor: ["#000000", 1]
      }
    ],
    frames: {
      reveal: {
        sky: { topColor: ["#000020", 0.0], bottomColor: ["#000000", 1.0] }
      }
    }
  }
};
