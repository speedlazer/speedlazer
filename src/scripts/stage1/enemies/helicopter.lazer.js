import audio from "../../../lib/audio";

export const helicopter = (pattern, repeatPattern) => async ({
  spawn,
  call,
  waitForEvent,
  wait,
  until,
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
  const maxHealth = 900;
  await allowDamage(heli, { health: maxHealth });
  const heliAudio = audio.playAudio("helicopter", { volume: 0.01 });
  heliAudio.setVolume(2.0, 2000);
  await wait(2000);
  showState(heli, "shooting");

  let movement = moveWithPattern(heli, pattern);
  heli.uniqueBind("HealthChange", newHealth => {
    if (newHealth < maxHealth * 0.5) {
      if (heli.appliedEntityState !== "dead") {
        showState(heli, "fire");
      }
    }
  });

  const killed = waitForEvent(heli, "Dead", async () => {
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
  await until(
    () => killed,
    async () => {
      if (heli.appliedEntityState === "dead") return wait(500);
      movement = moveWithPattern(heli, repeatPattern, 150);
      await movement.process;
    }
  );
};
