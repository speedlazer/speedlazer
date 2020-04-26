import { playAudio } from "src/lib/audio";

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
  heli.addComponent("SolidCollision").addComponent("PlayerEnemy");
  await call(heli.allowDamage, { health: 600 });
  const heliAudio = playAudio("helicopter", { volume: 0.01 });
  heliAudio.setVolume(2.0, 2000);
  await wait(2000);
  call(heli.showState, "shooting");

  const movement = moveWithPattern(heli, pattern);

  waitForEvent(heli, "Dead", async () => {
    movement.abort();
    heliAudio.stop();
    await call(heli.showState, "dead");
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
