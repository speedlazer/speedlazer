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
        topColor: ["#DDDD00", 0],
        bottomColor: ["#DDDD00", 1]
      }
    ],
    frames: {
      dawn: {
        sky: {
          h: 80,
          topColor: ["#DDDD00", 0.0],
          bottomColor: ["#DDDD00", 0.6]
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
        sky: { topColor: ["#000020", 0.3], bottomColor: ["#213A9E", 0.6] }
      },
      dawn2: {
        sky: { topColor: ["#0F1630", 0.5], bottomColor: ["#5E6D9F", 0.8] }
      },
      dawn3: {
        sky: { topColor: ["#191F3D", 0.8], bottomColor: ["#8B8289", 1.0] }
      },
      dawn4: {
        sky: { topColor: ["#27273D", 1.0], bottomColor: ["#CB8946", 1.0] }
      },
      dawn5: {
        sky: { topColor: ["#3E2D30", 1.0], bottomColor: ["#FD7321", 1.0] }
      },
      dawn6: {
        sky: { topColor: ["#383B65", 1.0], bottomColor: ["#FDAB3A", 1.0] }
      },
      dawn7: {
        sky: { topColor: ["#354898", 1.0], bottomColor: ["#FCC67B", 1.0] }
      },
      dawn8: {
        sky: { topColor: ["#3856C1", 1.0], bottomColor: ["#F3D7B1", 1.0] }
      },
      dawn9: {
        sky: { topColor: ["#477CFC", 1.0], bottomColor: ["#BABCD9", 1.0] }
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
