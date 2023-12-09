export default {
  BattleShip: {
    structure: {
      composition: "battleship.deck",
      components: [
        "ShipSolid",
        "GravitySolid",
        ["HideBelow", { hideBelow: 540, z: -12 }],
      ],
      attachments: {
        bottom: {
          particles: {
            emitter: ["waterSplashes", { emitter: { warmed: true } }],
          },
        },
        cabin1: {
          composition: "battleship.firstCabin",
          attachments: {
            radar: {
              entity: "Radar",
            },
          },
        },
        cabin1burn: null,
        cabin2burn: null,
        cabin2: {
          composition: "battleship.secondCabin",
          components: ["DamageSupport"],
        },
        mineCannon: {
          entity: "MineCannon",
        },
        // deckGun1: {
        //   entity: "BulletCannon"
        // },
        // deckGun2: {
        //   entity: "BulletCannon"
        // },
        // deckGun3: {
        //   entity: "LaserCannon",
        //   state: "mirrored"
        // },
        package: {
          composition: "cloth",
          frame: "medium",
        },
        boxLocation1: {
          entity: "ShipBoxes",
        },
        boxLocation2: {
          entity: "ShipBoxes",
        },
        boxLocation3: {
          composition: "intro.boxes",
        },
        hatch1: {
          composition: "shipHatch",
          frame: "open",
          attachments: {
            payload: {
              entity: "PresentGun",
              // state: "mirrored",
            },
          },
        },
        // hatch2: {
        //   composition: "shipHatch",
        //   attachments: {
        //     payload: {
        //       entity: "PresentGun",
        //     },
        //   },
        // },
        hatch3: {
          composition: "shipHatch",
          frame: "open",
          attachments: {
            payload: {
              entity: "PresentGun",
            },
          },
        },
        // heliPlace1: {
        //   entity: "Helicopter",
        //   state: "landed",
        // },
        // heliPlace2: {
        //   entity: "Helicopter",
        //   state: "landed",
        // },
        engineCore: { composition: "battleship.engine", frame: "perc0" },
      },
    },
    states: {
      risen: {
        frame: "risen",
      },
      lowered: {
        frame: "lowered",
      },
      sinking: {
        frame: "sinking",
      },
      t1o: {
        attachments: { hatch1: { frame: "open" } },
      },
      t1r: {
        attachments: { hatch1: { frame: "risen" } },
      },
      t2o: {
        attachments: { hatch2: { frame: "open" } },
      },
      t2r: {
        attachments: { hatch2: { frame: "risen" } },
      },
      t3o: {
        attachments: { hatch3: { frame: "open" } },
      },
      t3r: {
        attachments: { hatch3: { frame: "risen" } },
      },
      engineDoorOpen: {
        audio: "hatch-open",
        attachments: {
          cabin1: { composition: "battleship.firstCabin" },
          cabin1burn: null,
          cabin2burn: null,
          cabin2: {
            composition: "battleship.secondCabin",
            frame: ["open", { easing: "easeInOutQuad", duration: 2000 }],
          },
        },
      },
      engineTilt: {
        attachments: {
          cabin1: { composition: "battleship.firstCabin" },
          cabin1burn: null,
          cabin2burn: null,
          cabin2: {
            composition: "battleship.secondCabin",
            frame: ["open", { easing: "easeInOutQuad", duration: 2000 }],
          },
          engineCore: {
            composition: "battleship.engine",
            animation: "heavyShake",
            attachments: {
              smoke: {
                particles: {
                  emitter: ["smoke", { emitter: { w: 60, amount: 50 } }],
                },
              },
            },
          },
        },
      },
      engineDestroyed: {
        audio: "explosion",
        attachments: {
          engineCore: {
            frame: "destroyed",
            animation: null,
            attachments: {
              explosion: {
                composition: "weapons.largeExplosion",
                animation: "default",
              },
            },
          },
        },
      },
      packageOpen: {
        attachments: {
          package: { frame: "down" },
          laserField: { entity: "LaserCannonForceField" },
        },
      },
      cabin1Explode: {
        attachments: {
          cabin1explode: {
            weapon: {
              pattern: "building.explosion",
              target: "PlayerShip",
              angle: 0,
              active: true,
            },
          },
          cabin1burn: {
            particles: { emitter: ["smoke", { emitter: { w: 160 } }] },
          },
          cabin1burn2: {
            particles: { emitter: ["largeFire", { emitter: { w: 160 } }] },
          },
        },
      },
      cabin1Smoke: {
        attachments: {
          cabin1: { composition: "battleship.firstCabinDestroyed" },
          cabin1burn: {
            particles: { emitter: ["smoke", { emitter: { w: 160 } }] },
          },
          cabin1burn2: {
            particles: { emitter: ["largeFire", { emitter: { w: 160 } }] },
          },
        },
      },
      cabin2Explode: {
        attachments: {
          cabin2explode: {
            weapon: {
              pattern: "building.explosion2",
              target: "PlayerShip",
              angle: 0,
              active: true,
            },
          },
          cabin2burn: {
            particles: { emitter: ["smoke", { emitter: { w: 220 } }] },
          },
          cabin2burn2: {
            particles: { emitter: ["largeFire", { emitter: { w: 220 } }] },
          },
        },
      },
      cabin2Smoke: {
        attachments: {
          cabin2: { composition: "battleship.secondCabinDestroyed" },
          cabin2burn: {
            particles: { emitter: ["smoke", { emitter: { w: 220 } }] },
          },
          cabin2burn2: {
            particles: { emitter: ["largeFire", { emitter: { w: 220 } }] },
          },
          engineCore: null,
        },
      },
    },
    habitats: [
      {
        name: "Start",
        scenery: "city.Coast",
        position: {
          rx: 0.8,
          ry: 0.7,
        },
        scrollSpeed: { vx: -100, vy: 0 },
        background: ["city.Sunrise", 2],
      },
      {
        name: "Fase 1",
        scenery: "city.Coast",
        position: {
          rx: 0.5,
          ry: 0.7,
        },
        scrollSpeed: { vx: -100, vy: 0 },
        background: ["city.Sunrise", 2],
      },
      {
        name: "Fase 2",
        scenery: "city.Coast",
        position: {
          rx: -0.17,
          ry: 0.65,
        },
        scrollSpeed: { vx: -100, vy: 0 },
        background: ["city.Sunrise", 2],
      },
      {
        name: "Fase 3",
        scenery: "city.Coast",
        position: {
          rx: -0.7,
          ry: 0.7,
        },
        scrollSpeed: { vx: 100, vy: 0 },
        background: ["city.Sunrise", 2],
      },
      {
        name: "Sunk",
        scenery: "city.Coast",
        position: {
          rx: -0.2,
          ry: 0.85,
        },
        scrollSpeed: { vx: 100, vy: 0 },
        background: ["city.Sunrise", 2],
      },
    ],
  },
};
