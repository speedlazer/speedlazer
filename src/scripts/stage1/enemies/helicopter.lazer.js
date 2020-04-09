export const helicopter = pattern => async ({
  spawn,
  call,
  waitForEvent,
  wait,
  moveWithPattern
}) => {
  const heli = spawn("Helicopter", {
    location: {
      rx: 1.1,
      ry: 0.5
    },
    defaultVelocity: 100
  });
  await call(heli.allowDamage, { health: 600 });
  call(heli.showState, "shooting");
  const movement = moveWithPattern(heli, pattern);

  waitForEvent(heli, "Dead", async () => {
    movement.abort();
    await call(heli.showState, "dead");
    await call(heli.activateGravity);
    await wait(4000);
    heli.destroy();
  });

  await movement.process;
  if (movement.wasCompleted()) {
    heli.destroy();
  }
};
