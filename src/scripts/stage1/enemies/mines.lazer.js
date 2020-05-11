import { EASE_OUT, EASE_IN_OUT } from "src/constants/easing";
import shuffle from "lodash/shuffle";

const mineFlight = (index, start, coord, synchronize, moveDelay = 0) => async ({
  spawn,
  wait,
  addScreenTrauma,
  waitForEvent,
  race,
  showState,
  allowDamage,
  awardPoints,
  moveTo
}) => {
  let activeMovement = null;
  await wait(index * 50);

  const mine = spawn("Mine", {
    location: {
      rx: start.x,
      ry: start.y > 1 ? 0.9 : start.y
    },
    defaultVelocity: 200
  });
  if (start.y > 1) {
    activeMovement = moveTo(mine, { y: start.y }, null, EASE_OUT);
    await activeMovement.process;
  }
  await showState(mine, "rotate");

  await allowDamage(mine, { health: 40 });
  activeMovement = moveTo(mine, { x: coord.x }, null, EASE_OUT);

  await race([
    () =>
      waitForEvent(mine, "Dead", async () => {
        activeMovement && activeMovement.abort();
        synchronize();
        if (mine.appliedEntityState === "explode") return;
        awardPoints(50, mine.x, mine.y);
        showState(mine, "dead");
        addScreenTrauma(0.2);

        await wait(500);
        mine.destroy();
        activeMovement && activeMovement.abort();
      }),
    async () => {
      await activeMovement.process;
      if (activeMovement.wasCompleted()) {
        await synchronize();
        await wait(moveDelay);
        if (mine.appliedEntityState === "dead") return;
        activeMovement = moveTo(mine, { y: coord.y }, null, EASE_IN_OUT);
        await activeMovement.process;
        if (activeMovement.wasCompleted()) {
          await wait(200 + Math.random() * 2000);
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
    }
  ]);
};

const makeSynchronization = amount => {
  const sync = Array(amount)
    .fill()
    .map(() => {
      let res = null;
      const p = new Promise(r => {
        res = r;
      });
      return { p, res };
    });
  const settled = Promise.allSettled(sync.map(({ p }) => p));
  return sync.map(({ res }) => () => {
    res();
    return settled;
  });
};

export const mineWave = () => async ({ exec }) => {
  const amount = 6;

  const coords = [
    { x: 0.3, y: 0.8 },
    { x: 0.5, y: 0.2 },
    { x: 0.5, y: 0.4 },
    { x: 0.9, y: 0.2 },
    { x: 0.9, y: 0.4 },
    { x: 0.9, y: 0.8 }
  ];

  const items = makeSynchronization(amount).map(async (res, index) => {
    await exec(mineFlight(index, { x: 1.2, y: 1.1 }, coords[index], res));
  });
  await Promise.all(items);
};

const battleShipMineStrike = (index, start, coord) => async ({
  spawn,
  wait,
  addScreenTrauma,
  waitForEvent,
  race,
  allowDamage,
  showState,
  moveTo
}) => {
  let activeMovement = null;
  await wait(index * 50);

  const mine = spawn("Mine", {
    location: {
      rx: start.x,
      ry: start.y > 1 ? 0.9 : start.y
    },
    defaultVelocity: 200
  });
  await showState(mine, "rotate");
  await allowDamage(mine, { health: 40 });
  showState(mine, "blinking");
  await wait(2000);

  await race([
    () =>
      waitForEvent(mine, "Dead", async () => {
        activeMovement && activeMovement.abort();
        if (mine.appliedEntityState === "explode") return;
        showState(mine, "dead");
        addScreenTrauma(0.2);

        await wait(500);
        mine.destroy();
        activeMovement && activeMovement.abort();
      }),
    async () => {
      if (mine.appliedEntityState === "dead") return;
      activeMovement = moveTo(mine, { y: coord.y }, null, EASE_IN_OUT);
      await activeMovement.process;
      if (activeMovement.wasCompleted()) {
        await showState(mine, "open", 500);
        if (mine.appliedEntityState !== "dead") {
          showState(mine, "dead");
          addScreenTrauma(0.2);
          await wait(500);
          mine.destroy();
        }
      }
    }
  ]);
};

export const battleshipMines = () => async ({ exec }) => {
  const amount = 9;
  const gridX = [0.05, 0.14, 0.27, 0.36, 0.45, 0.54, 0.63, 0.77, 0.86];
  const gridY = [0.2, 0.3, 0.4, 0.5];

  const yCoord = shuffle(gridY);

  const items = Array(amount)
    .fill()
    .map(async (_, index) => {
      await exec(
        battleShipMineStrike(
          index,
          { x: gridX[index], y: 0.88 },
          { x: gridX[index], y: yCoord[index % yCoord.length] }
        )
      );
    });
  await Promise.all(items);
};
