import { bigText } from "src/components/BigText";
import { say } from "src/lib/Dialog";
import { EASE_IN_OUT } from "src/constants/easing";

const part1 = ship => async ({ call, waitForEvent }) => {
  const mineCannon = ship.mineCannon;
  mineCannon
    .addComponent("SolidCollision")
    .addComponent("DamageSupport")
    .addComponent("PlayerEnemy");
  const killed = waitForEvent(mineCannon, "Dead", async () => {
    call(mineCannon.showState, "dead");
  });
  await call(mineCannon.allowDamage, { health: 500 });
  await killed;
};

const part2 = ship => async ({ call, waitForEvent }) => {
  const radar = ship.cabin1.radar;
  radar.addComponent("SolidCollision").addComponent("DamageSupport");
  const killed = waitForEvent(radar, "Dead", async () => {
    call(radar.showState, "dead");
  });
  call(radar.showState, "pulse");
  await call(radar.allowDamage, { health: 500 });
  await killed;
};

const part3 = ship => async ({ call, waitForEvent }) => {
  const cabin = ship.cabin2;
  cabin.addComponent("SolidCollision").addComponent("DamageSupport");
  const open = waitForEvent(cabin, "Dead", async () => {
    call(ship.showState, "engineDoorOpen");
  });
  await call(cabin.allowDamage, { health: 500 });
  await open;
  cabin.removeComponent("SolidCollision");
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
    await wait(1000);
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
    await wait(1000);
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
      ry: 0.75
    },
    defaultVelocity: 85
  });
  activeMovement = moveTo(ship, { x: 0.8 }, null, EASE_IN_OUT);
  await activeMovement.process;

  await exec(part1(ship));

  activeMovement = moveTo(ship, { x: 0.5 }, null, EASE_IN_OUT);
  await activeMovement.process;

  await exec(part2(ship));

  activeMovement = moveTo(ship, { x: -0.2 }, null, EASE_IN_OUT);
  await activeMovement.process;

  await exec(part3(ship));

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
