export default {
  Radar: {
    structure: {
      composition: "droneShip.radar",
      frame: "emitEnd"
    },
    states: {
      pulse: {
        animation: "pulse"
      },
      stopPulse: {
        animation: null,
        frame: "emitEnd"
      }
    }
  }
};
