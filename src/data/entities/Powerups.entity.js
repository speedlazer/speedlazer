export default {
  ExtraLife: {
    structure: {
      composition: "powerups.life",
      animation: "default",
      components: ["DamageSupport", "PlayerHit"]
    },
    states: {
      pickedUp: {
        frame: "pickedUp",
        animation: null,
        audio: "powerup",
        attachments: { explosion: { particles: "powerup.pickup" } }
      },
      disappear: {
        animation: null,
        frame: "disappear"
      }
    }
  }
};
