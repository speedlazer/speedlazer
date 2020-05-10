import { playAudio } from "src/lib/audio";

export const helicopter = pattern => async ({
  spawn,
  call,
  waitForEvent,
  wait,
  allowDamage,
  moveWithPattern,
  awardPoints,
  showState
}) => {
  const heli = spawn("Helicopter", {
    location: {
      rx: 1.1,
      ry: 0.5
    },
    defaultVelocity: 100
  });
  heli
    .addCollisionComponent("SolidCollision")
    .addCollisionComponent("PlayerEnemy");
  await allowDamage(heli, { health: 900 });
  const heliAudio = playAudio("helicopter", { volume: 0.01 });
  heliAudio.setVolume(2.0, 2000);
  await wait(2000);
  showState(heli, "shooting");

  const movement = moveWithPattern(heli, pattern);

  waitForEvent(heli, "Dead", async () => {
    movement.abort();
    heliAudio.stop();
    awardPoints(250, heli.x + 20, heli.y);
    await showState(heli, "dead");
    await call(heli.activateGravity);
  });
  waitForEvent(heli, "Remove", async () => {
    heliAudio.stop();
  });

  await movement.process;
  if (movement.wasCompleted()) {
    heliAudio.setVolume(0, 2000);
    await wait(2000);
    heli.destroy();
  }
};
