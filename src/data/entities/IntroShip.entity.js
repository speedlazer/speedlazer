export default {
  IntroShip: {
    structure: {
      composition: "intro.ship",
      components: [
        "ShipSolid",
        "GravitySolid",
        ["HideBelow", { hideBelow: 540, z: -12 }]
      ],
      attachments: {
        bottom: {
          particles: [
            "waterSplashes",
            { emitter: { w: 850, amount: 300, warmed: true } }
          ]
        },
        hatch1: {
          composition: "shipHatch"
        },
        hatch2: {
          composition: "shipHatch",
          attachments: {
            payload: {
              name: "player1",
              entity: "PlayerShip"
            }
          }
        },
        boxLocation1: {
          entity: "ShipBoxes"
        },
        boxLocation2: {
          entity: "ShipBoxes"
        },
        heliStart: {
          entity: "IntroHeli"
        }
      }
    },
    states: {
      t1o: {
        attachments: { hatch1: { frame: "open" } }
      },
      t1r: {
        attachments: { hatch1: { frame: "risen" } }
      },
      t2o: {
        attachments: { hatch2: { frame: "open" } }
      },
      closed: {
        attachments: { hatch2: { frame: "closed" } }
      },
      t2r: {
        attachments: { hatch2: { frame: "risen" } }
      },
      heliStart: {
        attachments: { heliStart: { state: "liftOff" } }
      },
      shipStart: {
        attachments: {
          hatch2: {
            frame: "risen",
            attachments: {
              player1: { state: "starting" }
            }
          }
        }
      },
      shipLiftOff: {
        attachments: {
          hatch2: {
            frame: "risen",
            attachments: {
              player1: { state: "flying" }
            }
          }
        }
      }
    },
    habitats: [
      {
        name: "Ocean",
        scenery: "City.Ocean",
        position: {
          rx: -0.3,
          ry: 0.8
        },
        scrollSpeed: { vx: -40, vy: 0 },
        background: ["City.Sunrise", 0]
      }
    ]
  },
  IntroHeli: {
    structure: {
      composition: "helicopter",
      attributes: {
        scale: 0.8
      }
    },
    states: {
      start: {
        frame: "default",
        animation: false
      },
      liftOff: {
        animation: "flying"
      },
      flying: {
        frame: "tilted",
        animation: "flying"
      }
    }
  },
  IntroHeliBackground: {
    structure: {
      composition: "helicopter",
      frame: "background",
      components: ["DamageSupport"]
    },
    states: {
      flying: {
        animation: "flyingBackground"
      },
      shot: {
        animation: "flyingBackground",
        attachments: {
          sparks: {
            particles: "electric"
          }
        }
      }
    },
    habitats: [
      {
        name: "Ocean",
        scenery: "City.Ocean",
        position: {
          rx: 0.3,
          ry: 0.3
        },
        scrollSpeed: { vx: -80, vy: 0 },
        background: ["City.Sunrise", 0]
      }
    ]
  },
  IntroParachute: {
    structure: {
      composition: "intro.parachute"
    },
    habitats: [
      {
        name: "Ocean",
        scenery: "City.Ocean",
        position: {
          rx: 0.3,
          ry: 0.3
        },
        scrollSpeed: { vx: -80, vy: 0 },
        background: ["City.Sunrise", 0]
      }
    ]
  },
  ShipBoxes: {
    structure: {
      composition: "intro.boxes",
      components: ["GravitySupport", "PlayerHit"]
    },
    states: {
      falling: {
        frame: "falling"
      }
    }
  }
};
