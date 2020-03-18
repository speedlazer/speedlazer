//import { getOne, pickOne } from "src/lib/utils";
//import { EASE_IN_OUT } from "src/constants/easing";

const droneFlight = pattern => async ({
  spawn,
  wait,
  //until,
  call,
  //displayFrame,
  waitForEvent,
  moveWithPattern
}) => {
  const drone = spawn("WarDrone", {
    location: {
      rx: 1.1,
      ry: 0.5
    },
    defaultVelocity: 400
  });

  await call(drone.allowDamage, { health: 30 });
  const movement = moveWithPattern(drone, pattern);

  waitForEvent(drone, "Dead", async () => {
    movement.abort();
    await call(drone.showState, "dead");
  });

  await movement.process;
  await wait(400);
  drone.destroy();
};

export const droneWave = (amount, pattern, delay = 1000) => async ({
  exec,
  wait
}) => {
  const items = Array(amount)
    .fill()
    .map(async (e, index) => {
      await wait(index * delay);
      await exec(droneFlight(pattern));
    });
  await Promise.all(items);
};
