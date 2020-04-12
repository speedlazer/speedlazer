import { EASE_IN_OUT } from "src/constants/easing";

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
  waitForEvent,
  moveTo,
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
  let heliFleeing;
  waitForEvent(heli, "Dead", async () => {
    const movement = moveWithPattern(heli, "intro.HeliBackgroundCrash");
    heliFleeing = movement.process;
  });
  waitForEvent(heli, "Escape", async () => {
    const soldier = spawn("IntroParachute", {
      x: heli.x + 10,
      y: heli.y,
      z: -290,
      defaultVelocity: 20
    });
    const parachuteDrop = moveTo(
      soldier,
      { y: 0.6, x: 0.4 },
      null,
      EASE_IN_OUT
    );
    await parachuteDrop.process;
    soldier.destroy();
  });

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

  await wait(100);
  await heliFleeing;
  heli.destroy();
  drone.destroy();
};
