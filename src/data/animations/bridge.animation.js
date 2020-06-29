export default {
  "City.Bridge": {
    checkpoints: [
      {
        particles: [["dust.bridge", { key: "dust" }]],
        timeline: {
          defaultDuration: 1000,
          transitions: [
            {
              key: "dust",
              start: 0.9,
              end: 1.0,
              remove: true
            }
          ]
        }
      },
      {
        entities: [
          ["BridgeCeiling", { key: "ceiling" }],
          ["BridgeFrontDeck", { key: "front" }],
          ["BridgeCeilingBackground", { key: "back" }],
          ["PillarRight", { key: "pillarRight" }],
          ["PillarLeft", { key: "pillarLeft" }]
        ],
        timeline: {
          defaultDuration: 500,
          transitions: [
            {
              key: "back",
              start: 0.3,
              end: 1.0,
              targetFrame: "damaged",
              path: {
                data: [
                  { x: -0.1, y: 0.3 },
                  { x: -0.1, y: 0.29 }
                ]
              }
            },
            {
              key: "pillarRight",
              start: 0.2,
              end: 1.0,
              targetFrame: "rotateSmall"
            },
            {
              key: "pillarLeft",
              start: 0.2,
              end: 1.0,
              targetFrame: "rotateSmall"
            },
            {
              key: "front",
              start: 0.7,
              end: 1.0,
              targetFrame: "rotateSmall",
              path: {
                data: [
                  { x: -0.1, y: 0.29 },
                  { x: -0.1, y: 0.3 }
                ]
              }
            },
            {
              key: "ceiling",
              start: 0.0,
              end: 1.0,
              targetFrame: "rotateSmall",
              path: {
                data: [
                  { x: -0.1, y: 0.3 },
                  { x: -0.1, y: 0.28 }
                ]
              }
            }
          ]
        }
      },
      {
        entities: [
          ["BridgeCeiling", { key: "ceiling" }],
          ["BridgeFrontDeck", { key: "front" }],
          ["BridgeCeilingBackground", { key: "back" }],
          ["PillarRight", { key: "pillarRight" }],
          ["PillarLeft", { key: "pillarLeft" }]
        ],
        timeline: {
          defaultDuration: 500,
          transitions: [
            {
              key: "back",
              start: 0.3,
              end: 1.0,
              targetFrame: "damaged",
              path: {
                data: [
                  { x: -0.1, y: 0.3 },
                  { x: -0.1, y: 0.29 }
                ]
              }
            },
            {
              key: "pillarRight",
              start: 0.2,
              end: 1.0,
              targetFrame: "rotateMedium"
            },
            {
              key: "pillarLeft",
              start: 0.2,
              end: 1.0,
              targetFrame: "rotateMedium"
            },
            {
              key: "front",
              start: 0.7,
              end: 1.0,
              targetFrame: "rotateMedium",
              path: {
                data: [
                  { x: -0.1, y: 0.29 },
                  { x: -0.1, y: 0.3 }
                ]
              }
            },
            {
              key: "ceiling",
              start: 0.0,
              end: 1.0,
              components: ["PlayerEnemy"],
              targetFrame: "rotateMedium",
              path: {
                data: [
                  { x: -0.1, y: 0.3 },
                  { x: -0.1, y: 0.28 }
                ]
              }
            }
          ]
        }
      },
      {
        particles: [["dust.bridge", { key: "dust" }]],
        entities: [
          ["BridgeCeiling", { key: "ceiling" }],
          ["BridgeCeilingBackground", { key: "back" }],
          ["BridgeFrontDeck", { key: "front" }],
          ["PillarRight", { key: "pillarRight" }],
          ["PillarLeft", { key: "pillarLeft" }]
        ],
        timeline: {
          defaultDuration: 6000,
          transitions: [
            {
              key: "dust",
              start: 0.7,
              end: 1.0,
              remove: true
            },
            {
              key: "ceiling",
              start: 0.2,
              end: 0.6,
              targetFrame: "rotateDown",
              path: {
                data: [
                  { x: -0.1, y: 0.28 },
                  { x: -0.1, y: 1.2 }
                ]
              }
            },
            {
              key: "front",
              start: 0.7,
              end: 1.0,
              path: {
                data: [
                  { x: -0.1, y: 0.1 },
                  { x: -0.1, y: 1.3 }
                ]
              }
            },
            {
              key: "back",
              start: 0.0,
              end: 0.5,
              targetFrame: "rotateDown",
              path: {
                data: [
                  { x: -0.1, y: 0.28 },
                  { x: -0.1, y: 0.9 }
                ]
              }
            },
            {
              key: "pillarLeft",
              start: 0.7,
              end: 1.0,
              targetFrame: "rotateDown"
            },
            {
              key: "pillarRight",
              start: 0.4,
              end: 1.0,
              targetFrame: "rotateDown"
            }
          ]
        }
      }
    ],
    habitat: {
      scenery: "City.Bridge",
      scrollSpeed: { vx: 0, vy: 0 },
      background: ["City.Sunrise", 3]
    }
  }
};
