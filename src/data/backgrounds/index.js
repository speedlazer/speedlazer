export default {
  night: {
    composables: [
      ["night", { key: "night" }],
      ["sky", { key: "sky", frame: "default" }]
    ],
    timeline: {
      defaultDuration: 60000,
      transitions: [
        { key: "night", start: 0.0, end: 0.4, targetFrame: "end" },
        { start: 0.0, end: 0.0, targetBackgroundColor: "#000000" },
        { key: "sky", start: 0.0, end: 0.2, targetFrame: "dawn" },
        { start: 0.0, end: 0.2, targetBackgroundColor: "#000020" },

        { key: "sky", start: 0.2, end: 0.4, targetFrame: "dawn2" },
        { start: 0.2, end: 0.4, targetBackgroundColor: "#72261b" },

        { key: "sky", start: 0.4, end: 0.6, targetFrame: "dawn3" },
        { start: 0.4, end: 0.6, targetBackgroundColor: "#d39915" },

        { key: "sky", start: 0.6, end: 0.8, targetFrame: "dawn4" },
        { start: 0.6, end: 0.8, targetBackgroundColor: "#f7e459" },

        { key: "sky", start: 0.8, end: 1.0, targetFrame: "dawn5" },
        { start: 0.8, end: 1.0, targetBackgroundColor: "#d6d5d5" }
      ]
    }
  },
  sunRise: {}
};
