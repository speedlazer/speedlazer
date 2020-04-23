export default {
  "background.night": {
    attributes: {
      width: 1024,
      height: 576
    },
    sprites: [
      [
        "stars",
        {
          z: 0,
          y: -100,
          w: 672,
          h: 288,
          key: "topleft",
          ro: [672, 288]
        }
      ],
      [
        "stars",
        {
          z: 0,
          w: 672,
          h: 288,
          x: 672,
          y: -100,
          key: "topright",
          attachTo: "topleft"
        }
      ],
      [
        "stars",
        {
          z: 0,
          w: 672,
          h: 288,
          x: 0,
          y: 188,
          key: "bottomleft",
          attachTo: "topleft"
        }
      ],
      [
        "stars",
        {
          z: 0,
          w: 672,
          h: 288,
          x: 672,
          y: 188,
          key: "bottomright",
          attachTo: "topleft"
        }
      ]
    ],
    frames: {
      middle: {
        topleft: { rotation: -3 }
      },
      end: {
        topleft: { alpha: 0.5, rotation: -6 },
        topright: { alpha: 0.5 },
        bottomleft: { alpha: 0.5 },
        bottomright: { alpha: 0.5 }
      }
    }
  },
  "background.horizon": {
    attributes: {
      width: 1024,
      height: 50
    },
    gradients: [
      {
        z: 2,
        w: 1024,
        h: 50,
        key: "sky",
        topColor: ["#dddd00", 0],
        bottomColor: ["#dddd00", 1]
      }
    ],
    frames: {
      dawn: {
        sky: {
          h: 80,
          topColor: ["#dddd00", 0.0],
          bottomColor: ["#dddd00", 0.6]
        }
      }
    }
  },
  "background.sky": {
    attributes: {
      width: 1024,
      height: 576
    },
    gradients: [
      {
        z: 2,
        w: 1024,
        h: 400,
        key: "sky",
        topColor: ["#000000", 0],
        bottomColor: ["#000000", 0]
      }
    ],
    frames: {
      dawn: {
        sky: { topColor: ["#000020", 0.3], bottomColor: ["#213a9e", 0.6] }
      },
      dawn2: {
        sky: { topColor: ["#0f1630", 0.5], bottomColor: ["#5e6d9f", 0.8] }
      },
      dawn3: {
        sky: { topColor: ["#191f3d", 0.8], bottomColor: ["#8b8289", 1.0] }
      },
      dawn4: {
        sky: { topColor: ["#27273d", 1.0], bottomColor: ["#cb8946", 1.0] }
      },
      dawn5: {
        sky: { topColor: ["#3e2d30", 1.0], bottomColor: ["#fd7321", 1.0] }
      },
      dawn6: {
        sky: { topColor: ["#383b65", 1.0], bottomColor: ["#fdab3a", 1.0] }
      },
      dawn7: {
        sky: { topColor: ["#354898", 1.0], bottomColor: ["#fcc67b", 1.0] }
      },
      dawn8: {
        sky: { topColor: ["#3856c1", 1.0], bottomColor: ["#f3d7b1", 1.0] }
      },
      dawn9: {
        sky: { topColor: ["#477cfc", 1.0], bottomColor: ["#babcd9", 1.0] }
      }
    }
  },
  "background.sun": {
    attributes: {
      width: 96,
      height: 96,
      scale: 0.6
    },
    sprites: [
      ["sun", { x: 0, y: 0, z: 4, crop: [1, 1, 1, 1] }],
      [
        "directGlare",
        {
          x: -40,
          y: -40,
          z: 2000,
          crop: [1, 1, 1, 1],
          alpha: 0,
          key: "glare"
        }
      ]
    ],
    frames: {
      noGlare: {
        glare: { maxAlpha: 0 }
      },
      full: {
        attributes: { scale: 1.0 },
        glare: { maxAlpha: 1 }
      },
      large: {
        attributes: { scale: 1.2 },
        glare: { maxAlpha: 0 }
      }
    }
  }
};
