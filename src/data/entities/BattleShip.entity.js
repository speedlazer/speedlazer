export default {
  BattleShip: {
    structure: {
      composition: "battleship.deck",
      components: [
        "ShipSolid",
        "GravitySolid",
        ["HideBelow", { hideBelow: 570, z: -12 }]
      ],
      attachments: {
        bottom: {
          particles: ["waterSplashes", { emitter: { warmed: true } }]
        },
        cabin1: {
          composition: "battleship.firstCabin",
          attachments: {
            radar: {
              entity: "Radar"
            }
          }
        },
        cabin1burn: null,
        cabin2burn: null,
        cabin2: {
          composition: "battleship.secondCabin",
          components: ["DamageSupport"]
        },
        deckGun1: {
          entity: "BulletCannon"
        },
        deckGun2: {
          entity: "BulletCannon"
        },
        hatch1: {
          composition: "shipHatch",
          attachments: {
            payload: {
              entity: "BulletCannon"
            }
          }
        },
        hatch2: {
          composition: "shipHatch",
          attachments: {
            payload: {
              entity: "BulletCannon"
            }
          }
        },
        hatch3: {
          composition: "shipHatch",
          attachments: {
            payload: {
              entity: "BulletCannon"
            }
          }
        },
        heliPlace1: {
          composition: "helicopter",
          attributes: { scale: 0.8 }
        },
        heliPlace2: {
          composition: "helicopter",
          attributes: { scale: 0.8 }
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
      t2r: {
        attachments: { hatch2: { frame: "risen" } }
      },
      t3o: {
        attachments: { hatch3: { frame: "open" } }
      },
      t3r: {
        attachments: { hatch3: { frame: "risen" } }
      },
      fase3: {
        attachments: {
          cabin1: { composition: "battleship.firstCabin" },
          cabin1burn: null,
          cabin2burn: null,
          cabin2: {
            composition: "battleship.secondCabin",
            frame: ["open", { easing: "easeInOutQuad", duration: 2000 }]
          },
          engineCore: { composition: "battleship.engine" }
        }
      },
      fase4: {
        attachments: {
          cabin1: { composition: "battleship.firstCabinDestroyed" },
          cabin1burn: { particles: ["smoke", { emitter: { w: 160 } }] },
          cabin2burn: null,
          cabin2: { composition: "battleship.secondCabin", frame: "open" },
          engineCore: { composition: "battleship.engine" }
        }
      },
      fase5: {
        attachments: {
          cabin1: { composition: "battleship.firstCabinDestroyed" },
          cabin2: { composition: "battleship.secondCabinDestroyed" },
          cabin1burn: { particles: ["smoke", { emitter: { w: 160 } }] },
          cabin2burn: { particles: ["smoke", { emitter: { w: 220 } }] },
          engineCore: null
        }
      }
    },
    habitats: [
      {
        name: "Start",
        scenery: "City.Coast",
        position: {
          rx: 0.8,
          ry: 0.7
        },
        scrollSpeed: { vx: -100, vy: 0 },
        background: ["City.Sunrise", 2]
      },
      {
        name: "Fase 1",
        scenery: "City.Coast",
        position: {
          rx: 0.5,
          ry: 0.7
        },
        scrollSpeed: { vx: -100, vy: 0 },
        background: ["City.Sunrise", 2]
      },
      {
        name: "Fase 2",
        scenery: "City.Coast",
        position: {
          rx: 0.1,
          ry: 0.7
        },
        scrollSpeed: { vx: -100, vy: 0 },
        background: ["City.Sunrise", 2]
      },
      {
        name: "Fase 3",
        scenery: "City.Coast",
        position: {
          rx: -0.7,
          ry: 0.7
        },
        scrollSpeed: { vx: 100, vy: 0 },
        background: ["City.Sunrise", 2]
      }
    ]
  }
};
