import { bigText } from "src/components/BigText";
import { droneWave } from "./drones.lazer";
import { say } from "src/lib/Dialog";
import { battleshipMines } from "./mines.lazer.js";
import { playAudio } from "src/lib/audio";
import { EASE_IN_OUT, EASE_OUT, LINEAR } from "src/constants/easing";

const shootMineCannon = (cannon, high) => async ({
  call,
  spawn,
  moveWithPattern,
  moveTo,
  addScreenTrauma,
  wait,
  waitForEvent,
  race
}) => {
  await call(cannon.showState, high ? "aimHigh" : "aimLow");
  const spawnPoint = cannon.currentAttachHooks.gun;
  if (!cannon.hasHealth()) return;

  const mine = spawn("Mine", {
    location: {
      x: spawnPoint.x,
      y: spawnPoint.y
    },
    defaultVelocity: 300
  }).attr({ z: spawnPoint.z });
  waitForEvent(mine, "Loose", async () => {
    mine.attr({ z: mine.z + 30 });
  });

  const movement = moveWithPattern(
    mine,
    high ? "mineCannon.highShot" : "mineCannon.lowShot",
    null,
    EASE_OUT
  );
  await call(cannon.showState, "shoot");

  movement.process.then(async () => {
    await call(mine.allowDamage, { health: 40 });

    const ship = Crafty("PlayerShip").get(0);
    let searchMovement;
    searchMovement = moveTo(mine, { y: 1 });
    await searchMovement.process;
    searchMovement = moveTo(mine, { x: ship.x / Crafty.viewport.width });
    await searchMovement.process;

    searchMovement = moveTo(mine, { y: ship.y / Crafty.viewport.height });
    await race([
      () =>
        waitForEvent(mine, "Dead", async () => {
          searchMovement && searchMovement.abort();
          if (mine.appliedEntityState === "explode") return;
          call(mine.showState, "dead");
          addScreenTrauma(0.2);

          await wait(500);
          mine.destroy();
          searchMovement && searchMovement.abort();
        }),
      async () => {
        await searchMovement.process;
        if (searchMovement.wasCompleted()) {
          if (mine.appliedEntityState === "dead") return;
          await call(mine.showState, "open", 500);
          call(mine.showState, "blinking");
          await wait(1000);
          if (mine.appliedEntityState !== "dead") {
            call(mine.showState, "explode");
            addScreenTrauma(0.2);
            await wait(500);
            mine.destroy();
          }
        }
      }
    ]);
  });
};

const activateGun = gun => async ({ call, waitForEvent }) => {
  const gunKilled = waitForEvent(gun, "Dead", async () => {
    call(gun.showState, "dead");
  });
  gun
    .addComponent("SolidCollision")
    .addComponent("DamageSupport")
    .addComponent("PlayerEnemy");
  await call(gun.allowDamage, { health: 600 });
  call(gun.showState, "shooting");
  await gunKilled;
};

const part1 = ship => async ({ call, waitForEvent, race, until }) => {
  const mineCannon = ship.mineCannon;
  mineCannon
    .addComponent("SolidCollision")
    .addComponent("DamageSupport")
    .addComponent("PlayerEnemy");

  const killed = waitForEvent(mineCannon, "Dead", async () => {
    call(mineCannon.showState, "dead");
  });
  await race([
    async () => {
      await call(mineCannon.allowDamage, { health: 1500 });
      let high = true;
      await until(
        () => killed,
        async ({ exec }) => {
          await exec(shootMineCannon(mineCannon, high));
          high = !high;
        }
      );
    },
    () => killed
  ]);
};

const part2 = ship => async ({
  call,
  exec,
  waitForEvent,
  parallel,
  until,
  wait
}) => {
  const radar = ship.cabin1.radar;

  radar.addComponent("SolidCollision").addComponent("DamageSupport");
  call(radar.showState, "pulse");
  await call(radar.allowDamage, { health: 500 });

  await parallel([
    () =>
      until(
        () =>
          waitForEvent(radar, "Dead", async () => {
            call(radar.showState, "dead");
          }),
        async ({ exec }) => {
          exec(droneWave(2, "drone.pattern2", 500));
          await wait(2000);
        }
      ),
    () => exec(activateGun(ship.deckGun1))
  ]);
};

const mineAttack = ship => async ({ wait, moveTo, exec, parallel, call }) => {
  await parallel([
    () => {
      const upwards = moveTo(ship, { y: 0.65 }, 20, EASE_IN_OUT);
      return upwards.process;
    },
    () => call(ship.showState, "risen", 2000),
    async () => {
      await wait(1000);
      await exec(battleshipMines());
    }
  ]);
  await parallel([
    () => {
      const downwards = moveTo(ship, { y: 0.7 }, 20, EASE_IN_OUT);
      return downwards.process;
    },
    () => call(ship.showState, "lowered", 2000)
  ]);
};

const helicopter1 = ship => async ({
  call,
  wait,
  waitForEvent,
  moveWithPattern
}) => {
  const helicopter = ship.heliPlace1;
  const heliAudio = playAudio("helicopter", { volume: 0.01 });
  heliAudio.setVolume(0.9, 1000);
  call(helicopter.showState, "flying");
  await wait(1000);
  await call(helicopter.showState, "tilted", 2000);
  const movement = moveWithPattern(helicopter, "heli.battleship1", 150, LINEAR);
  waitForEvent(helicopter, "detach", async () => {
    helicopter.detachFromParent();
  });
  waitForEvent(helicopter, "active", async () => {
    helicopter
      .addComponent("SolidCollision")
      .addComponent("DamageSupport")
      .addComponent("PlayerEnemy");
    await call(helicopter.allowDamage, { health: 600 });
  });
  waitForEvent(helicopter, "Remove", async () => {
    heliAudio.stop();
  });
  waitForEvent(helicopter, "Dead", async () => {
    heliAudio.stop();
    movement.abort();
    await call(helicopter.showState, "dead");
    await call(helicopter.activateGravity);
  });
  await movement.process;
};

const part3 = ship => async ({ call, wait, exec, parallel }) => {
  await wait(1000);
  await parallel([
    async () => {
      await wait(1000);
      await exec(activateGun(ship.deckGun2));
      await call(ship.showState, "engineDoorOpen");
      await wait(1000);
      await call(ship.engineCore.displayFrame, "perc25", 1000);
      await call(ship.showState, "t3o", 2000);
      await call(ship.showState, "t3r", 2000);
      await exec(activateGun(ship.hatch3.payload));
    },
    () => exec(helicopter1(ship))
  ]);
  // Mines from below
  await exec(mineAttack(ship));
  await parallel([
    async () => {
      await call(ship.showState, "t2o", 2000);
      await call(ship.showState, "t2r", 2000);
      await exec(activateGun(ship.hatch2.payload));
      await call(ship.engineCore.displayFrame, "perc50", 1000);
    },
    async () => {
      await call(ship.showState, "t1o", 2000);
      await call(ship.showState, "t1r", 2000);
      await exec(activateGun(ship.hatch1.payload));
      await call(ship.engineCore.displayFrame, "perc50", 1000);
    }
  ]);
  await exec(mineAttack(ship));
  await call(ship.engineCore.displayFrame, "perc75", 1000);
  call(ship.engineCore.playAnimation, "shake");
  // 2 helicopters
};

const part4 = ship => async ({ call, waitForEvent }) => {
  const engine = ship.engineCore;
  engine.addComponent("SolidCollision").addComponent("DamageSupport");
  const killed = waitForEvent(engine, "Dead", async () => {
    //call(ship.showState, "fase3");
  });
  await call(engine.allowDamage, { health: 500 });
  await killed;
  engine.removeComponent("SolidCollision");
};

const part5 = ship => async ({ call, waitForEvent, wait }) => {
  const cabin = ship.cabin1;
  cabin.addComponent("SolidCollision").addComponent("DamageSupport");
  const killed = waitForEvent(cabin, "Dead", async () => {
    call(ship.showState, "cabin1Explode");
    await wait(2000);
    call(ship.showState, "cabin1Smoke");
  });
  await call(cabin.allowDamage, { health: 500 });
  await killed;
  cabin.removeComponent("SolidCollision");
};

const part6 = ship => async ({ call, waitForEvent, wait }) => {
  const cabin = ship.cabin2;
  cabin.addComponent("SolidCollision").addComponent("DamageSupport");
  const killed = waitForEvent(cabin, "Dead", async () => {
    call(ship.showState, "cabin2Explode");
    await wait(2000);
    call(ship.showState, "cabin2Smoke");
  });
  await call(cabin.allowDamage, { health: 500 });
  await killed;
  cabin.removeComponent("SolidCollision");
};

const battleship = async ({
  parallel,
  spawn,
  wait,
  call,
  exec,
  moveTo,
  setScrollingSpeed
}) => {
  let activeMovement;
  const text = bigText("Warning!", { color: "#FF0000" });
  await parallel([
    () => text.blink(500, 4),
    () => setScrollingSpeed(100, 0),
    () =>
      say("John", "Battleship approaching!", { portrait: "portraits.pilot" })
  ]);

  text.remove();

  // Fases:
  // - Mine cannon
  // - Cabin 2 - low stress, Single cannon, invincible
  // - Helicopters
  // - Cabin 2 - medium stress, 2 cannons, invincible
  // - Radar waves, 2 canons at same time, kill cannons
  // - Cabin 2 - destroy
  // - Sink ship
  //

  // spawn ship off screen
  const ship = spawn("BattleShip", {
    location: {
      rx: 1.1,
      ry: 0.7
    },
    defaultVelocity: 85
  });
  activeMovement = moveTo(ship, { x: 0.8 }, null, EASE_IN_OUT);
  await parallel([() => activeMovement.process, () => exec(part1(ship))]);
  await wait(1000);

  activeMovement = moveTo(ship, { x: 0.5 }, null, EASE_IN_OUT);
  await parallel([() => activeMovement.process, () => exec(part2(ship))]);
  await wait(1000);

  activeMovement = moveTo(ship, { x: -0.17 }, null, EASE_IN_OUT);
  await parallel([() => activeMovement.process, () => exec(part3(ship))]);

  activeMovement = moveTo(ship, { x: -0.8 }, null, EASE_IN_OUT);
  await activeMovement.process;
  activeMovement = moveTo(ship, { x: -1.1 }, null, EASE_IN_OUT);

  const playerShip = Crafty("PlayerShip").get(0);
  await parallel([
    () => activeMovement.process,
    async () => {
      await wait(2000);
      await call(playerShip.showState, "turned");
      await setScrollingSpeed(-50, 0);
    }
  ]);

  activeMovement = moveTo(ship, { x: -0.9 }, null, EASE_IN_OUT);
  await activeMovement.process;

  await exec(part4(ship));

  activeMovement = moveTo(ship, { x: -0.4 }, null, EASE_IN_OUT);
  await activeMovement.process;

  await wait(4000);

  activeMovement = moveTo(ship, { x: 0.4 }, null, EASE_IN_OUT);
  await activeMovement.process;
  await call(playerShip.showState, "turned");
  await setScrollingSpeed(100, 0);

  await exec(part5(ship));

  activeMovement = moveTo(ship, { x: -0.2 }, null, EASE_IN_OUT);
  await activeMovement.process;

  await exec(part6(ship));

  activeMovement = moveTo(ship, { x: -1.5 }, null, EASE_IN_OUT);
  await activeMovement.process;

  ship.destroy();
};

export default battleship;
