export default {
  helicopter: {
    attributes: {
      width: 128,
      height: 64,
      scale: 1
    },
    hitbox: [10, 45, 50, 10, 125, 20, 110, 50, 13, 57],
    sprites: [
      [
        "helicopterLanded",
        { x: 0, y: 0, key: "heli", w: 128, h: 64, horizon: [0, 0] }
      ],
      [
        "helicopterGun",
        {
          x: -5,
          y: 43,
          z: -1,
          key: "barrel",
          w: 32,
          h: 32,
          ro: [20, 10],
          horizon: [0, 0]
        }
      ]
    ],
    attachHooks: [
      [
        "gun",
        {
          x: 2,
          y: 62,
          z: 1,
          attachAlign: ["center", "left"],
          attachTo: "barrel"
        }
      ],
      [
        "rockets",
        {
          x: 60,
          y: 42,
          z: 1,
          attachAlign: ["center", "center"]
        }
      ],
      [
        "sparks",
        {
          x: 60,
          y: 42,
          z: 2,
          attachAlign: ["center", "center"]
        }
      ],
      [
        "smoke",
        {
          x: 60,
          y: 52,
          z: -1,
          attachAlign: ["center", "center"]
        }
      ],
      [
        "fire",
        {
          x: 80,
          y: 32,
          z: 2,
          attachAlign: ["center", "center"]
        }
      ]
    ],
    frames: {
      landed: {
        attributes: {
          scale: 0.8,
          z: -100
        }
      },
      foreground: {
        attributes: {
          scale: 1.0,
          z: 100
        }
      },
      background: {
        flipX: true,
        attributes: {
          scale: 0.7,
          z: -300
        },
        heli: {
          horizon: [0.7, 0.7]
        },
        barrel: {
          horizon: [0.7, 0.7]
        }
      },
      flyBackground1: {
        attributes: {
          scale: 0.7
        },
        heli: { sprite: "helicopter", horizon: [0.7, 0.7] },
        barrel: { alpha: 1, horizon: [0.7, 0.7] }
      },
      flyBackground2: {
        attributes: {
          scale: 0.7
        },
        heli: { sprite: "helicopter2", horizon: [0.7, 0.7] },
        barrel: { alpha: 1, horizon: [0.7, 0.7] }
      },
      fly1: {
        heli: { sprite: "helicopter" },
        barrel: { alpha: 1 }
      },
      fly2: {
        heli: { sprite: "helicopter2" },
        barrel: { alpha: 1 }
      },
      damaged: {
        heli: { sprite: "heliDamaged" },
        barrel: { alpha: 1 }
      },
      gunRotate1: {
        barrel: { rotation: 10 }
      },
      gunRotate2: {
        barrel: { rotation: -50 }
      },
      turn1: {
        heli: {
          sprite: "helicopterTurning1",
          scaleX: 0.5
        },
        barrel: { alpha: 0 }
      },
      turn2: {
        heli: {
          sprite: "helicopterTurning2",
          scaleX: 0.5
        },
        barrel: { alpha: 0 }
      },
      turned: {
        flipX: true
      },
      tilted: {
        attributes: {
          rotation: -10
        }
      },
      leveled: {
        attributes: {
          rotation: 0
        }
      }
    },
    animations: {
      flying: {
        repeat: true,
        easing: "linear",
        startEase: { easing: "linear", duration: 250 },
        duration: 500,
        timeline: [
          {
            start: 0.0,
            end: 0.5,
            startFrame: "fly1",
            endFrame: "fly2"
          },
          {
            start: 0.5,
            end: 1,
            startFrame: "fly2",
            endFrame: "fly1"
          }
        ]
      },
      flyingBackground: {
        repeat: true,
        easing: "linear",
        startEase: { easing: "linear", duration: 250 },
        duration: 500,
        timeline: [
          {
            start: 0.0,
            end: 0.5,
            startFrame: "flyBackground1",
            endFrame: "flyBackground2"
          },
          {
            start: 0.5,
            end: 1,
            startFrame: "flyBackground2",
            endFrame: "flyBackground1"
          }
        ]
      },
      turning: {
        repeat: true,
        easing: "linear",
        startEase: { easing: "linear", duration: 250 },
        duration: 500,
        timeline: [
          {
            start: 0.0,
            end: 0.5,
            startFrame: "turn1",
            endFrame: "turn2"
          },
          {
            start: 0.5,
            end: 1,
            startFrame: "turn2",
            endFrame: "turn1"
          }
        ]
      },
      turnAround: {
        easing: "linear",
        duration: 500,
        after: {
          animation: "flying"
        },
        timeline: [
          {
            start: 0.0,
            end: 0.05,
            startFrame: "fly1",
            endFrame: "turn2"
          },
          {
            start: 0.25,
            end: 0.5,
            startFrame: "turn2",
            endFrame: "turn1"
          },
          {
            start: 0.52,
            end: 0.55,
            startFrame: "turn1",
            endFrame: "turned"
          },
          {
            start: 0.75,
            end: 0.9,
            startFrame: "turn1",
            endFrame: "turn2"
          },
          {
            start: 0.95,
            end: 1,
            startFrame: "turn2",
            endFrame: "fly1"
          }
        ]
      }
    }
  }
};
