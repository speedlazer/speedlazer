export default {
  "city.Sunset": {
    checkpoints: [
      {
        composables: [
          ["background.sky", { key: "sky", frame: "dawn9", relativeX: -0.1 }],
        ],
        entities: [
          [
            "Sun",
            { key: "sun", state: "default", relativeX: 0.4, relativeY: 0.1 },
          ],
        ],
        backgroundColor: "#babcd9",
        timeline: {
          defaultDuration: 60_000,
          transitions: [
            { key: "sky", start: 0.0, end: 0.5, targetFrame: "dawn8" },
            { key: "sky", start: 0.5, end: 1.0, targetFrame: "dawn7" },
            { start: 0.0, end: 0.5, targetBackgroundColor: "#f3d7b1" },
            { start: 0.5, end: 1.0, targetBackgroundColor: "#fcc67b" },
            { start: 0.0, end: 1.0, key: "sun", targetState: "full" },
            {
              key: "sun",
              start: 0.0,
              end: 1.0,
              path: {
                name: "sunset",
                start: 0.0,
                end: 0.6,
              },
            },
          ],
        },
      },
      {
        composables: [
          ["background.sky", { key: "sky", frame: "dawn7", relativeX: -0.1 }],
        ],
        entities: [
          [
            "Sun",
            { key: "sun", state: "full", relativeX: 0.8, relativeY: 0.3 },
          ],
          [
            "Moon",
            { key: "moon", state: "default", relativeX: 0.2, relativeY: 0.7 },
          ],
        ],
        backgroundColor: "#fcc67b",
        timeline: {
          defaultDuration: 10_000,
          transitions: [
            { key: "sky", start: 0.0, end: 0.5, targetFrame: "dawn6" },
            { key: "sky", start: 0.5, end: 1.0, targetFrame: "dawn5" },
            { start: 0.0, end: 0.5, targetBackgroundColor: "#fdab3a" },
            { start: 0.5, end: 1.0, targetBackgroundColor: "#fd7321" },
            { start: 0.0, end: 1.0, key: "sun", targetState: "full" },
            {
              key: "moon",
              start: 0.0,
              end: 1.0,
              path: {
                name: "moonrise",
                start: 0.0,
                end: 0.25,
              },
            },
            {
              key: "sun",
              start: 0.0,
              end: 1.0,
              path: {
                name: "sunset",
                start: 0.6,
                end: 0.75,
              },
            },
          ],
        },
      },
      {
        composables: [
          ["background.night", { key: "night", frame: "end" }],
          ["background.sky", { key: "sky", frame: "dawn5", relativeX: -0.1 }],
        ],
        entities: [
          [
            "Sun",
            { key: "sun", state: "large", relativeX: 0.848, relativeY: 0.42 },
          ],
          [
            "Moon",
            { key: "moon", state: "default", relativeX: 0.3, relativeY: 0.4 },
          ],
        ],
        backgroundColor: "#fd7321",
        timeline: {
          defaultDuration: 10_000,
          transitions: [
            { key: "night", start: 0.0, end: 1.0, targetFrame: "middle" },
            { key: "sky", start: 0.0, end: 0.3, targetFrame: "dawn4" },
            { key: "sky", start: 0.3, end: 0.7, targetFrame: "dawn3" },
            { key: "sky", start: 0.7, end: 1.0, targetFrame: "dawn2" },
            { start: 0.0, end: 0.15, targetBackgroundColor: "#27273d" },
            { start: 0.15, end: 0.7, targetBackgroundColor: "#191f3d" },
            { start: 0.7, end: 1.0, targetBackgroundColor: "#0f1630" },
            {
              key: "moon",
              start: 0.0,
              end: 1.0,
              path: {
                name: "moonrise",
                start: 0.25,
                end: 0.45,
              },
            },
            {
              key: "sun",
              start: 0.0,
              end: 0.5,
              path: {
                name: "sunset",
                start: 0.75,
                end: 1.0,
              },
            },
          ],
        },
      },
      {
        composables: [
          ["background.night", { key: "night", frame: "middle" }],
          ["background.sky", { key: "sky", frame: "dawn2", relativeX: -0.1 }],
        ],
        entities: [
          [
            "Sun",
            { key: "sun", state: "large", relativeX: 0.9, relativeY: 0.7 },
          ],
          [
            "Moon",
            { key: "moon", state: "default", relativeX: 0.4, relativeY: 0.1 },
          ],
        ],
        backgroundColor: "#0f1630",
        timeline: {
          defaultDuration: 10_000,
          transitions: [
            { key: "night", start: 0.0, end: 1.0, targetFrame: "default" },
            { key: "sky", start: 0.0, end: 0.5, targetFrame: "dawn" },
            { key: "sky", start: 0.5, end: 1.0, targetFrame: "default" },
            { start: 0.0, end: 0.5, targetBackgroundColor: "#030820" },
            { start: 0.5, end: 1.0, targetBackgroundColor: "#000010" },
            {
              key: "moon",
              start: 0.0,
              end: 1.0,
              targetFrame: "large",
              path: {
                name: "moonrise",
                start: 0.45,
                end: 1.0,
              },
            },
          ],
        },
      },
      {
        composables: [
          ["background.night", { key: "night" }],
          ["background.sky", { key: "sky", frame: "default", relativeX: -0.1 }],
        ],
        entities: [
          [
            "Sun",
            { key: "sun", state: "large", relativeX: 0.9, relativeY: 0.7 },
          ],
          [
            "Moon",
            { key: "moon", state: "large", relativeX: 0.5, relativeY: 0.1 },
          ],
        ],
        backgroundColor: "#000010",
        timeline: {
          defaultDuration: 10_000,
          transitions: [],
        },
      },
    ],
    habitat: {
      isBackground: true,
      scenery: "town.RoofTops",
      scrollSpeed: { vx: -100, vy: 0 },
    },
  },
};
