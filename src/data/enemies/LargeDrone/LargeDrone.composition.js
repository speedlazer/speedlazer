export default {
  largeDrone: {
    attributes: {
      width: 90,
      height: 70,
      scale: 1,
      ro: [45, 35]
    },
    hitbox: [0, 20, 80, 0, 50, 60, 20, 67, 0, 50],
    sprites: [
      ["standardLargeDrone", { x: 0, y: 0, key: "main", horizon: [0, 0] }],
      [
        "standardRocket",
        {
          x: 22,
          y: 33,
          z: 1,
          key: "rocket",
          horizon: [0, 0]
        }
      ],
      [
        "standardLargeDrone",
        {
          x: 36,
          y: 10,
          z: 3,
          key: "wing",
          horizon: [0, 0],
          crop: [10, 10, 47, 36]
        }
      ],
      ["sphere2", { z: 1, x: 1, y: 27, crop: [0, 0, 17, 21], key: "eye" }]
    ],
    attachHooks: [
      [
        "trail",
        {
          x: 40,
          y: 18,
          z: -2,
          attachAlign: ["center", "right"],
          attachTo: "main"
        }
      ],
      [
        "explosion",
        {
          x: 22,
          y: 18,
          z: 2,
          attachAlign: ["center", "center"],
          attachTo: "main"
        }
      ],
      [
        "smoke",
        {
          x: 22,
          y: 18,
          z: -5,
          attachAlign: ["center", "center"],
          attachTo: "main"
        }
      ],
      [
        "gun",
        {
          x: 2,
          y: 38,
          z: 2,
          attachAlign: ["center", "left"],
          attachTo: "main"
        }
      ],
      [
        "rockets",
        {
          x: 45,
          y: 38,
          z: 2,
          attachAlign: ["center", "center"],
          attachTo: "main"
        }
      ]
    ],
    frames: {
      background: {
        attributes: { scale: 0.7 },
        main: { horizon: [0.7, 0.7] },
        wing: { horizon: [0.7, 0.7] },
        rocket: { horizon: [0.7, 0.7] }
      },
      rocketShow: {
        rocket: { y: -10, scale: 0.6, alpha: 1 }
      },
      rocketReset: {
        rocket: { y: -10, scale: 0.6, alpha: 0 }
      },
      rocketLoaded: {
        rocket: { y: 0, scale: 1.0, alpha: 1 }
      },
      rocketShot: {
        rocket: { y: 0, scale: 1.0, alpha: 0 }
      },
      eyeMove: {
        eye: {
          x: 10,
          y: -6,
          alpha: 0.6
        }
      },
      eyeDisappear: {
        eye: {
          x: 10,
          y: -6,
          alpha: 0.0
        }
      },
      eyeReset: {
        eye: {
          alpha: 0.0
        }
      },
      eyeAppear: {
        eye: {
          alpha: 1.0
        }
      },
      damaged1: {
        main: {
          sprite: "standardLargeDroneDamage1"
        }
      },
      damaged2: {
        main: {
          sprite: "standardLargeDroneDamage2"
        }
      },
      damaged3: {
        main: {
          sprite: "standardLargeDroneDamage3"
        }
      },
      turned: {
        flipX: true
      },
      laugh1: {
        attributes: {
          rotation: 15
        }
      },
      laugh2: {
        attributes: {
          rotation: 0
        }
      },
      hidden: {
        main: {
          hidden: true,
          alpha: 0
        },
        eye: {
          hidden: true,
          alpha: 0
        }
      }
    },
    animations: {
      eye: {
        repeat: true,
        easing: "linear",
        duration: 1000,
        timeline: [
          {
            start: 0.0,
            end: 0.7,
            startFrame: "eyeAppear",
            endFrame: "eyeMove"
          },
          {
            start: 0.7,
            end: 0.8,
            startFrame: "eyeMove",
            endFrame: "eyeDisappear"
          },
          {
            start: 0.8,
            end: 0.9,
            startFrame: "eyeDisappear",
            endFrame: "eyeReset"
          },
          {
            start: 0.9,
            end: 1,
            startFrame: "eyeReset",
            endFrame: "eyeAppear"
          }
        ]
      },
      laugh: {
        easing: "linear",
        duration: 1800,
        after: {
          animation: "eye"
        },
        startEase: { duration: 10, easing: "linear" },
        timeline: [
          {
            start: 0.0,
            end: 0.05,
            startFrame: "eyeAppear",
            endFrame: "laugh2"
          },
          {
            start: 0.05,
            end: 0.25,
            startFrame: "laugh2",
            endFrame: "laugh1"
          },
          {
            start: 0.25,
            end: 0.5,
            startFrame: "laugh1",
            endFrame: "laugh2"
          },
          {
            start: 0.5,
            end: 0.75,
            startFrame: "laugh2",
            endFrame: "laugh1"
          },
          {
            start: 0.75,
            end: 1,
            startFrame: "laugh1",
            endFrame: "laugh2"
          }
        ]
      },
      rocketShot: {
        easing: "linear",
        duration: 400,
        timeline: [
          {
            start: 0.0,
            end: 0.2,
            startFrame: "rocketLoaded",
            endFrame: "rocketShot"
          },
          {
            start: 0.2,
            end: 0.5,
            startFrame: "rocketShot",
            endFrame: "rocketReset"
          },
          {
            start: 0.5,
            end: 1.0,
            startFrame: "rocketReset",
            endFrame: "rocketShow"
          }
        ]
      },
      rocketReload: {
        easing: "linear",
        duration: 1500,
        after: {
          animation: "eye"
        },
        timeline: [
          {
            start: 0.0,
            end: 1.0,
            startFrame: "rocketShow",
            endFrame: "rocketLoaded"
          }
        ]
      }
    }
  }
};
