export default {
  House: {
    structure: {
      composition: "town.roof",
      components: ["ShipSolid"],
      attachments: {
        chimneyLoc: {
          composition: "town.chimney",
          attachments: {
            smokeLoc: {
              particles: {
                emitter: ["smokePlume", { emitter: { warmed: true } }],
              },
            },
          },
        },
      },
    },
    states: {
      dead: {
        animation: null,
        audio: "explosion",
        attachments: {
          explosionLoc: {
            composition: "explosion",
            animation: "default",
          },
          chimneyLoc: null,
        },
      },
    },
    habitats: [
      {
        name: "Town",
        scenery: "town.RoofTops",
        position: {
          rx: 0.3,
          ry: 0.6,
        },
        scrollSpeed: { vx: -40, vy: 0 },
        background: ["city.Sunrise", 4],
      },
    ],
  },
  PresentGun: {
    structure: {
      composition: "town.chimneyMini",
      attachments: {
        gunLoc: {
          weapon: {
            pattern: "chimney.presents",
            target: "Jinte",
          },
        },
      },
    },
    states: {
      shooting: {
        animation: "shoot",
        attachments: {
          gunLoc: {
            weapon: {
              active: true,
            },
          },
        },
      },
      dead: {
        animation: null,
        frame: "dead",
        audio: "explosion",
        attachments: {
          explosionLoc: {
            composition: "explosion",
            animation: "default",
          },
          gunLoc: null,
        },
      },
    },
  },
  HouseHostile: {
    structure: {
      composition: "town.roof",
      components: ["ShipSolid"],
      attachments: {
        chimneyLoc: {
          composition: "town.chimney",
          attachments: {
            gunLoc: {
              weapon: {
                pattern: "chimney.presents",
                target: "Jinte",
              },
            },
          },
        },
      },
    },
    habitats: [
      {
        name: "Town",
        scenery: "town.RoofTops",
        position: {
          rx: 0.3,
          ry: 0.6,
        },
        scrollSpeed: { vx: -40, vy: 0 },
        background: ["city.Sunrise", 4],
      },
    ],
    states: {
      shooting: {
        attachments: {
          chimneyLoc: {
            animation: "shoot",
            attachments: {
              gunLoc: {
                weapon: {
                  active: true,
                },
              },
            },
          },
        },
      },
      dead: {
        animation: null,
        audio: "explosion",
        attachments: {
          explosionLoc: {
            composition: "explosion",
            animation: "default",
          },
          chimneyLoc: null,
        },
      },
    },
  },
};
