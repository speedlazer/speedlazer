const droneFlight = pattern => async ({
  spawn,
  call,
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
    drone.destroy();
  });

  await movement.process;
  if (movement.wasCompleted()) {
    drone.destroy();
  }
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
