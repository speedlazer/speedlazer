import { paths } from "data";

const droneFlight = (pattern, yOffset = 0) => async ({
  spawn,
  call,
  waitForEvent,
  moveWithPattern
}) => {
  const flyPattern = paths(pattern);
  const drone = spawn("WarDrone", {
    location: {
      rx: flyPattern[0].x,
      ry: flyPattern[0].y + yOffset
    },
    defaultVelocity: 400
  });

  await call(drone.allowDamage, { health: 30 });
  const movement = moveWithPattern(drone, pattern);

  waitForEvent(drone, "Dead", async () => {
    movement.abort();
    await call(drone.showState, "dead");
    drone.destroy();
  });

  await movement.process;
  if (movement.wasCompleted()) {
    drone.destroy();
  }
};

export const droneWave = (
  amount,
  pattern,
  delay = 1000,
  yOffset = 0
) => async ({ exec, wait }) => {
  const items = Array(amount)
    .fill()
    .map(async (e, index) => {
      await wait(index * delay);
      await exec(droneFlight(pattern, yOffset));
    });
  await Promise.all(items);
};
