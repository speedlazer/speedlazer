import { say } from "../../../lib/Dialog";
import synchroniser from "../../../lib/synchroniser";

const rocketAttack1 = drone => async ({
  showState,
  until,
  moveWithPattern
}) => {
  let movement = null;
  await until(
    () => showState(drone, "shootRockets"),
    () => {
      movement = moveWithPattern(drone, "largeDrone.eight");
      return movement.process;
    }
  );
};

const rocketAttack2 = drone => async ({
  showState,
  until,
  moveWithPattern
}) => {
  let movement = null;
  await until(
    () => showState(drone, "rocketStrike"),
    () => {
      movement = moveWithPattern(drone, "largeDrone.eight2");
      return movement.process;
    }
  );
};

const mineToTarget = (drone, target, synchronize) => async ({
  spawn,
  showState,
  moveTo,
  wait,
  waitForEvent,
  race,
  addScreenTrauma
}) => {
  const startX = drone.x + drone.w * 0.3;
  const startY = drone.y + drone.h * 0.5;

  const mine = spawn("Mine", {
    location: {
      x: startX,
      y: startY
    },
    defaultVelocity: 200
  });
  await showState(mine, "rotate");
  let movement = null;

  const motion = async () => {
    movement = moveTo(mine, { y: 1.1 });
    await movement.process;
    if (!movement.wasCompleted()) return;

    movement = moveTo(mine, { x: target.x });
    await movement.process;
    if (!movement.wasCompleted()) return;

    movement = moveTo(mine, { y: target.y });
    await movement.process;
    if (!movement.wasCompleted()) return;
    await synchronize();

    await wait(100 + Math.random() * 1000);
    await showState(mine, "open", 500);
    if (mine.appliedEntityState === "dead") return;
    showState(mine, "blinking");
    await wait(1000);
    if (mine.appliedEntityState === "dead") return;
    showState(mine, "explode");
    addScreenTrauma(0.3);
    await wait(500);
    mine.destroy();
  };

  await race([
    () =>
      waitForEvent(mine, "Dead", async () => {
        movement && movement.abort();
        if (mine.appliedEntityState === "explode") return;
        showState(mine, "dead");
        addScreenTrauma(0.3);

        await wait(500);
        mine.destroy();
        movement && movement.abort();
      }),
    motion
  ]);
};

const mineAttack1 = drone => async ({
  exec,
  wait,
  moveWithPattern,
  parallel
}) => {
  const targets = [
    { x: 0.2, y: 0.3 },
    { x: 0.6, y: 0.3 },
    { x: 0.4, y: 0.5 },
    { x: 0.2, y: 0.8 },
    { x: 0.6, y: 0.8 }
  ];
  const syncSpace = synchroniser();

  const movement = moveWithPattern(drone, "largeDrone.eight");

  const mines = targets.map((target, index) => async () => {
    const synchronise = syncSpace.addSynchronisation();
    await wait(200 * (index + 1));
    exec(mineToTarget(drone, target, synchronise));
  });
  parallel(mines);

  await movement.process;
};

export const largeDrone = () => async ({
  moveWithPattern,
  playAnimation,
  setScrollingSpeed,
  showState,
  spawn,
  exec,
  parallel,
  wait
}) => {
  const drone = spawn("LargeDrone", {
    location: {
      rx: 1.1,
      ry: 0.2
    },
    defaultVelocity: 200
  });
  let movement = moveWithPattern(drone, "largeDrone.intro");
  await movement.process;
  await parallel([
    () =>
      say(
        "Drone",
        "**Bzzt** We are in control of your army now!\nJust give up!",
        {
          portrait: "portraits.drone"
        }
      ),
    () => showState(drone, "laugh")
  ]);

  await exec(rocketAttack1(drone));
  await exec(rocketAttack2(drone));

  await exec(mineAttack1(drone));

  console.log("mine attack!");

  await wait(10e3);
  const bridgeCrash = playAnimation("city.Bridge", { max: 2 });
  await wait(10e3);

  bridgeCrash.updateCheckpointLimit(Infinity);
  await bridgeCrash.waitTillCheckpoint(3);
  await setScrollingSpeed(200, 0);

  drone.destroy();
};
