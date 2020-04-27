import { playAudio } from "src/lib/audio";

export const helicopter = pattern => async ({
  spawn,
  call,
  waitForEvent,
  wait,
  allowDamage,
  moveWithPattern,
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
  await allowDamage(heli, { health: 600 });
  const heliAudio = playAudio("helicopter", { volume: 0.01 });
  heliAudio.setVolume(2.0, 2000);
  await wait(2000);
  showState(heli, "shooting");

  const movement = moveWithPattern(heli, pattern);

  waitForEvent(heli, "Dead", async () => {
    movement.abort();
    heliAudio.stop();
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
