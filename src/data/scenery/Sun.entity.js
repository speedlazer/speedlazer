export default {
  Sun: {
    structure: {
      composition: "background.sun",
      components: [
        ["LightGlare", { glareAlphaLink: "glare" }],
        ["Overlap", { checkCollission: "SunBlock", applyAlphaTo: "glare" }],
      ],
    },
    states: {
      full: {
        frame: "full",
      },
      large: {
        frame: "large",
      },
    },
    habitats: [],
  },
  Moon: {
    structure: {
      composition: "background.moon",
    },
    states: {
      full: {
        frame: "full",
      },
      large: {
        frame: "large",
      },
    },
    habitats: [],
  },
};
