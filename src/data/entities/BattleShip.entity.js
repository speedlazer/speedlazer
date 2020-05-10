export default {
  BattleShip: {
    structure: {
      composition: "battleship.deck",
      components: [
        "ShipSolid",
        "GravitySolid",
        ["HideBelow", { hideBelow: 540, z: -12 }]
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
        mineCannon: {
          entity: "MineCannon"
        },
        deckGun1: {
          entity: "BulletCannon"
        },
        deckGun2: {
          entity: "BulletCannon"
        },
        deckGun3: {
          entity: "LaserCannon",
          state: "mirrored"
        },
        package: {
          composition: "cloth",
          frame: "medium"
        },
        boxLocation1: {
          composition: "intro.boxes"
        },
        boxLocation2: {
          composition: "intro.boxes"
        },
        boxLocation3: {
          composition: "intro.boxes"
        },
        hatch1: {
          composition: "shipHatch",
          attachments: {
            payload: {
              entity: "BulletCannon",
              state: "mirrored"
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
          entity: "Helicopter",
          state: "landed"
        },
        heliPlace2: {
          entity: "Helicopter",
          state: "landed"
        },
        engineCore: { composition: "battleship.engine", frame: "perc0" }
      }
    },
    states: {
      risen: {
        frame: "risen"
      },
      lowered: {
        frame: "lowered"
      },
      sinking: {
        frame: "sinking"
      },
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
      engineDoorOpen: {
        attachments: {
          cabin1: { composition: "battleship.firstCabin" },
          cabin1burn: null,
          cabin2burn: null,
          cabin2: {
            composition: "battleship.secondCabin",
            frame: ["open", { easing: "easeInOutQuad", duration: 2000 }]
          }
        }
      },
      engineTilt: {
        attachments: {
          cabin1: { composition: "battleship.firstCabin" },
          cabin1burn: null,
          cabin2burn: null,
          cabin2: {
            composition: "battleship.secondCabin",
            frame: ["open", { easing: "easeInOutQuad", duration: 2000 }]
          },
          engineCore: {
            composition: "battleship.engine",
            animation: "heavyShake",
            attachments: {
              smoke: {
                particles: ["smoke", { emitter: { w: 60, amount: 50 } }]
              }
            }
          }
        }
      },
      packageOpen: {
        attachments: { package: { frame: "down" } }
      },
      cabin1Explode: {
        attachments: {
          cabin1explode: {
            weapon: {
              pattern: "building.explosion",
              target: "PlayerShip",
              angle: 0,
              active: true
            }
          },
          cabin1burn: { particles: ["smoke", { emitter: { w: 160 } }] }
        }
      },
      cabin1Smoke: {
        attachments: {
          cabin1: { composition: "battleship.firstCabinDestroyed" },
          cabin1burn: { particles: ["smoke", { emitter: { w: 160 } }] }
        }
      },
      cabin2Explode: {
        attachments: {
          cabin2explode: {
            weapon: {
              pattern: "building.explosion2",
              target: "PlayerShip",
              angle: 0,
              active: true
            }
          },
          cabin2burn: { particles: ["smoke", { emitter: { w: 220 } }] }
        }
      },
      cabin2Smoke: {
        attachments: {
          cabin2: { composition: "battleship.secondCabinDestroyed" },
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
          rx: -0.17,
          ry: 0.65
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
      },
      {
        name: "Sunk",
        scenery: "City.Coast",
        position: {
          rx: -0.2,
          ry: 0.85
        },
        scrollSpeed: { vx: 100, vy: 0 },
        background: ["City.Sunrise", 2]
      }
    ]
  }
};
