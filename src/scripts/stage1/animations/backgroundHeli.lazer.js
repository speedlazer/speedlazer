export const backgroundHeli = ({ existing = false } = {}) => async ({
  spawn,
  call,
  moveWithPattern
}) => {
  const heli =
    (existing && Crafty("IntroHeliBackground").get(0)) ||
    spawn("IntroHeliBackground", {
      location: {
        rx: -0.3,
        ry: 0.3
      },
      z: -300,
      defaultVelocity: 70
    });
  call(heli.showState, "flying");
  const movement = moveWithPattern(heli, "intro.HeliBackground");
  await movement.process;
};

export const heliAttack = ({ existing = false } = {}) => async ({
  spawn,
  call,
  moveWithPattern,
  wait
}) => {
  const heli =
    (existing && Crafty("IntroHeliBackground").get(0)) ||
    spawn("IntroHeliBackground", {
      location: {
        rx: -0.3,
        ry: 0.3
      },
      z: -300,
      defaultVelocity: 70
    });
  call(heli.showState, "flying");
  // TODO:  Setup trigger when hit

  const drone =
    (existing && Crafty("LargeBackgroundDrone").get(0)) ||
    spawn("LargeBackgroundDrone", {
      location: {
        rx: 1.1,
        ry: 0.3
      },
      z: -280,
      defaultVelocity: 120
    });
  call(drone.showState, "eyeMove");
  await call(heli.allowDamage, { health: 10 });
  const movement = moveWithPattern(drone, "intro.DroneBackground");
  await movement.process;
  call(drone.showState, "shoot");
  // TODO: Move away

  await wait(5000);
};
