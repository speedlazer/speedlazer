import { bigText } from "src/components/BigText";
import { droneWave } from "./drones.lazer";
import { say } from "src/lib/Dialog";
import { battleshipMines } from "./mines.lazer.js";
import { playAudio } from "src/lib/audio";
import { EASE_IN_OUT, EASE_OUT, LINEAR } from "src/constants/easing";

const shootMineCannon = (cannon, high) => async ({
  spawn,
  moveWithPattern,
  moveTo,
  addScreenTrauma,
  wait,
  waitForEvent,
  showState,
  allowDamage,
  race
}) => {
  await showState(cannon, high ? "aimHigh" : "aimLow");
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
  await showState(cannon, "shoot");

  movement.process.then(async () => {
    await allowDamage(mine, { health: 40 });

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
          showState(mine, "dead");
          addScreenTrauma(0.2);

          await wait(500);
          mine.destroy();
          searchMovement && searchMovement.abort();
        }),
      async () => {
        await searchMovement.process;
        if (searchMovement.wasCompleted()) {
          if (mine.appliedEntityState === "dead") return;
          await showState(mine, "open", 500);
          showState(mine, "blinking");
          await wait(1000);
          if (mine.appliedEntityState !== "dead") {
            showState(mine, "explode");
            addScreenTrauma(0.2);
            await wait(500);
            mine.destroy();
          }
        }
      }
    ]);
  });
};

const activateGun = gun => async ({
  awardPoints,
  showState,
  waitForEvent,
  allowDamage
}) => {
  const gunKilled = waitForEvent(gun, "Dead", async () => {
    awardPoints(200, gun.x + 20, gun.y);
    showState(gun, "dead");
    gun.clearCollisionComponents();
  });
  gun
    .addCollisionComponent("SolidCollision")
    .addCollisionComponent("PlayerEnemy");
  allowDamage(gun, { health: 750 });
  showState(gun, "shooting");
  await gunKilled;
};

const part1 = ship => async ({
  showState,
  waitForEvent,
  allowDamage,
  race,
  awardPoints,
  until
}) => {
  const mineCannon = ship.mineCannon;
  mineCannon
    .addCollisionComponent("SolidCollision")
    .addCollisionComponent("PlayerEnemy");

  const killed = waitForEvent(mineCannon, "Dead", async () => {
    awardPoints(250, mineCannon.x, mineCannon.y);
    showState(mineCannon, "dead");
    mineCannon.clearCollisionComponents();
  });
  await race([
    async () => {
      await allowDamage(mineCannon, { health: 1200 });
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
  exec,
  waitForEvent,
  parallel,
  until,
  showState,
  awardPoints,
  allowDamage,
  wait
}) => {
  const radar = ship.cabin1.radar;

  radar.addCollisionComponent("SolidCollision");
  showState(radar, "pulse");
  await allowDamage(radar, { health: 500 });
  let points = 10;
  await parallel([
    () =>
      until(
        () =>
          waitForEvent(radar, "Dead", async () => {
            awardPoints(100, radar.x + 20, radar.y);
            showState(radar, "dead");
            radar.clearCollisionComponents();
          }),
        async ({ exec }) => {
          exec(droneWave(2, "drone.pattern2", { points }));
          points = points > 0 ? points - 5 : 0;
          await wait(2000);
        }
      ),
    () => exec(activateGun(ship.deckGun1))
  ]);
};

const mineAttack = ship => async ({
  wait,
  showState,
  moveTo,
  exec,
  parallel
}) => {
  await parallel([
    () => {
      const upwards = moveTo(ship, { y: 0.65 }, 20, EASE_IN_OUT);
      return upwards.process;
    },
    () => showState(ship, "risen", 2000),
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
    () => showState(ship, "lowered", 2000)
  ]);
};

const helicopter1 = ship => async ({
  call,
  wait,
  waitForEvent,
  showState,
  awardPoints,
  allowDamage,
  until,
  moveWithPattern
}) => {
  const helicopter = ship.heliPlace1;
  const heliAudio = playAudio("helicopter", { volume: 0.01 });
  heliAudio.setVolume(0.9, 1000);
  showState(helicopter, "flying");
  await wait(1000);
  await showState(helicopter, "tilted", 2000);
  let movement = moveWithPattern(helicopter, "heli.battleship1", 150, LINEAR);
  waitForEvent(helicopter, "detach", async () => {
    helicopter.detachFromParent();
  });
  waitForEvent(helicopter, "active", async () => {
    helicopter
      .addCollisionComponent("SolidCollision")
      .addCollisionComponent("PlayerEnemy");
    await allowDamage(helicopter, { health: 500 });
  });
  waitForEvent(helicopter, "Remove", async () => {
    heliAudio.stop();
  });
  const killed = waitForEvent(helicopter, "Dead", async () => {
    heliAudio.stop();
    helicopter.clearCollisionComponents();
    movement.abort();
    awardPoints(250, helicopter.x + 20, helicopter.y);
    await showState(helicopter, "dead");
    helicopter.z = ship.package.z + 1;

    await call(helicopter.activateGravity);
  });
  await movement.process;
  await until(
    () => killed,
    async () => {
      if (helicopter.appliedEntityState === "dead") return wait(500);
      movement = moveWithPattern(helicopter, "heli.battleship2c", 150, LINEAR);
      await movement.process;
    }
  );
};

const part3 = ship => async ({
  showState,
  wait,
  exec,
  parallel,
  showAnimation
}) => {
  await wait(1000);
  await parallel([
    async () => {
      await wait(1000);
      await exec(activateGun(ship.deckGun2));
      await wait(1000);
      await showState(ship, "t3o", 2000);
      await showState(ship, "t3r", 2000);
      await exec(activateGun(ship.hatch3.payload));
    },
    () => exec(helicopter1(ship))
  ]);
  // Mines from below
  await exec(mineAttack(ship));
  await parallel([
    async () => {
      await showState(ship, "t2o", 1000);
      await showState(ship, "t2r", 1000);
      await exec(activateGun(ship.hatch2.payload));
    },
    async () => {
      await showState(ship, "t1o", 1000);
      await showState(ship, "t1r", 1000);
      await exec(activateGun(ship.hatch1.payload));
    }
  ]);
  await exec(mineAttack(ship));
};

const helicopter2 = ship => async ({
  wait,
  moveTo,
  showState,
  moveWithPattern,
  waitForEvent,
  awardPoints,
  allowDamage,
  call,
  until
}) => {
  const helicopter = ship.heliPlace2;
  const heliAudio = playAudio("helicopter", { volume: 0.01 });
  heliAudio.setVolume(0.9, 1000);
  showState(helicopter, "flying");
  await wait(1000);
  await showState(helicopter, "tilted", 2000);

  let movement = moveWithPattern(helicopter, "heli.battleship2a", 150, LINEAR);
  waitForEvent(helicopter, "detach", async () => {
    helicopter.detachFromParent();
  });
  waitForEvent(helicopter, "active", async () => {
    helicopter
      .addCollisionComponent("SolidCollision")
      .addCollisionComponent("PlayerEnemy");
    await allowDamage(helicopter, { health: 500 });
  });
  waitForEvent(helicopter, "Remove", async () => {
    heliAudio.stop();
  });
  const killed = waitForEvent(helicopter, "Dead", async () => {
    heliAudio.stop();
    helicopter.clearCollisionComponents();
    movement.abort();
    awardPoints(250, helicopter.x + 20, helicopter.y);
    await showState(helicopter, "dead");
    await call(helicopter.activateGravity);
  });
  const shipMovement = waitForEvent(helicopter, "moveShip", async () => {
    const p = moveTo(ship, { x: -1.0 }, 120, EASE_IN_OUT);
    await p.process;
  });

  await movement.process;
  movement = moveWithPattern(helicopter, "heli.battleship2b", 150, LINEAR);

  await shipMovement;
  await movement.process;

  await until(
    () => killed,
    async () => {
      if (helicopter.appliedEntityState === "dead") return wait(500);
      movement = moveWithPattern(helicopter, "heli.battleship2c", 150, LINEAR);
      await movement.process;
    }
  );
};

const part5 = ship => async ({
  allowDamage,
  showState,
  showAnimation,
  wait,
  parallel,
  setScrollingSpeed,
  moveTo,
  awardPoints,
  exec,
  waitForEvent
}) => {
  await wait(2000);
  await showState(ship, "packageOpen", 1000, EASE_IN_OUT);
  await wait(1000);
  const laser = ship.deckGun3;
  await showState(laser, "open", 500, EASE_IN_OUT);

  const engineCore = ship.engineCore;
  engineCore.addComponent("SolidCollision");
  waitForEvent(engineCore, "Dead", async () => {
    engineCore.clearCollisionComponents();
    showState(ship, "engineTilt");

    waitForEvent(engineCore, "Dead", async () => {
      engineCore.clearCollisionComponents();
      // Add explosions and screenshakes

      awardPoints(500, engineCore.x + 20, engineCore.y);
      engineCore.removeComponent("SolidCollision");
      showState(ship.laserField, "stopped");
      ship.laserField.removeComponent("SolidCollision");
      showState(ship, "engineDestroyed");
    });
    await allowDamage(ship.engineCore, { health: 1000 });
  });

  await allowDamage(ship.engineCore, { health: 500 });
  await allowDamage(laser, { health: 500 });

  laser.addCollisionComponent("SolidCollision");
  const killed = waitForEvent(laser, "Dead", async () => {
    laser.clearCollisionComponents();
    awardPoints(250, laser.x + 20, laser.y);
    showState(laser, "dead");
  });
  await allowDamage(laser, { health: 500 });
  showState(laser, "shooting");

  await parallel([
    async () => {
      await wait(1000);
      const playerShip = Crafty("PlayerShip").get(0);
      await showState(playerShip, "turned");
      await wait(1000);
      await showState(ship, "engineDoorOpen");
      await setScrollingSpeed(-50, 0);
      const activeMovement = moveTo(ship, { x: -0.9 }, 85, EASE_IN_OUT);
      await activeMovement.process;
    },
    async () => {
      await killed;
      exec(laserWeapon(laser.x + laser.w / 2, laser.y - laser.h));
      //await displayFrame(ship.engineCore, "perc100", 1000);
      //showState(ship, "engineTilt");
    }
  ]);
};

const extraLife = (x, y) => async ({
  allowDamage,
  showState,
  waitForEvent,
  wait,
  spawn,
  gainLife,
  moveWithPattern
}) => {
  const extraLife = spawn("ExtraLife", {
    location: {
      x,
      y
    },
    defaultVelocity: 50
  });
  await allowDamage(extraLife, { health: 10 });
  waitForEvent(extraLife, "Dead", async () => {
    gainLife();
    await showState(extraLife, "pickedUp");
    await wait(2000);
    extraLife.destroy();
  });
  const motion = moveWithPattern(extraLife, "powerup.circles");
  await motion.process;
  await showState(extraLife, "disappear", 1000);
  extraLife.destroy();
};

const laserWeapon = (x, y) => async ({
  allowDamage,
  awardText,
  showState,
  waitForEvent,
  wait,
  spawn,
  until
}) => {
  const powerup = spawn("Upgrade", {
    location: {
      x,
      y
    },
    defaultVelocity: 50
  });
  await allowDamage(powerup, { health: 10 });
  const pickedUp = waitForEvent(powerup, "Dead", async () => {
    const ship = Crafty("PlayerShip").get(0);
    ship.hasLaser = true;
    awardText("Laser weapon", powerup.x, powerup.y);
    await showState(powerup, "pickedUp");
    await wait(2000);
    powerup.destroy();
  });
  await until(
    () => pickedUp,
    async ({ moveWithPattern }) => {
      const motion = moveWithPattern(powerup, "powerup.circles");
      await motion.process;
    }
  );
  powerup.destroy();
};

const part6 = ship => async ({
  allowDamage,
  showState,
  waitForEvent,
  awardPoints,
  exec,
  wait
}) => {
  const cabin = ship.cabin1;
  cabin.addCollisionComponent("SolidCollision");
  const killed = waitForEvent(cabin, "Dead", async () => {
    awardPoints(2000, cabin.x + cabin.w / 2, cabin.y);
    showState(ship, "cabin1Explode");
    await wait(2000);
    cabin.clearCollisionComponents();
    showState(ship, "cabin1Smoke");
  });
  await allowDamage(cabin, { health: 500, bulletResistance: 0.99 });
  await killed;
  cabin.removeComponent("SolidCollision");
  exec(extraLife(cabin.x + cabin.w / 2, cabin.y - cabin.h));
};

const part7 = ship => async ({
  allowDamage,
  showState,
  waitForEvent,
  awardPoints,
  wait
}) => {
  const cabin = ship.cabin2;
  cabin.addCollisionComponent("SolidCollision");
  const killed = waitForEvent(cabin, "Dead", async () => {
    awardPoints(2000, cabin.x + cabin.w / 2, cabin.y);
    showState(ship, "cabin2Explode");
    await wait(2000);
    cabin.clearCollisionComponents();
    showState(ship, "cabin2Smoke");
  });
  await allowDamage(cabin, { health: 500, bulletResistance: 0.99 });
  await killed;
  cabin.removeComponent("SolidCollision");
};

const handleBox = box => async ({
  showState,
  allowDamage,
  waitForEvent,
  call,
  awardPoints
}) => {
  await allowDamage(box, { health: 30 });
  waitForEvent(box, "Dead", async () => {
    awardPoints(25, box.x, box.y);
    showState(box, "falling");
    await call(box.activateGravity, "GravityLiquid");
  });
};

const battleship = async ({
  parallel,
  spawn,
  wait,
  showState,
  exec,
  moveTo,
  setBackgroundCheckpointLimit,
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
  exec(handleBox(ship.boxLocation1));
  exec(handleBox(ship.boxLocation2));

  activeMovement = moveTo(ship, { x: 0.8 }, null, EASE_IN_OUT);
  await parallel([() => activeMovement.process, () => exec(part1(ship))]);
  await wait(1000);

  setBackgroundCheckpointLimit(3);
  activeMovement = moveTo(ship, { x: 0.5 }, null, EASE_IN_OUT);
  await parallel([() => activeMovement.process, () => exec(part2(ship))]);
  await wait(1000);

  activeMovement = moveTo(ship, { x: -0.17 }, null, EASE_IN_OUT);
  await parallel([() => activeMovement.process, () => exec(part3(ship))]);

  await exec(helicopter2(ship));

  await exec(part5(ship));

  await parallel([
    async () => {
      activeMovement = moveTo(ship, { x: -0.7 }, null, EASE_IN_OUT);
      await activeMovement.process;
    },
    () => exec(part7(ship))
  ]);

  await parallel([
    async () => {
      activeMovement = moveTo(ship, { x: -0.2 }, null, EASE_IN_OUT);
      await activeMovement.process;
    },
    () => exec(part6(ship))
  ]);

  const playerShip = Crafty("PlayerShip").get(0);
  await showState(playerShip, "turned");
  await setScrollingSpeed(100, 0);

  // major explosions / sinking
  await parallel([
    () => showState(ship, "sinking", 17000, EASE_IN_OUT),
    async () => {
      activeMovement = moveTo(ship, { x: -1.7, y: 0.85 }, null, EASE_IN_OUT);
      await activeMovement.process;
    },
    async () => {
      await wait(500);
      await say(
        "General",
        "I'm at a safe location now. We need to end this threat.\nHow are you holding up?",
        { portrait: "portraits.general" }
      );
      await say(
        "John",
        "I'm fine. That ship had some advanced weaponry on board.\n" +
          "Did you know that?",
        {
          portrait: "portraits.pilot"
        }
      );
      await say(
        "General",
        "We can not acces the computer systems anymore. But this would\n" +
          "mean they also have control over our R&D division.\nThis is really bad.",
        { portrait: "portraits.general" }
      );
      await say("John", "I will try to reach the R&D center to investigate.", {
        portrait: "portraits.pilot"
      });
    }
  ]);

  ship.destroy();
};

export default battleship;
