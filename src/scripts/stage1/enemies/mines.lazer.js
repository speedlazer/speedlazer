import { EASE_OUT, EASE_IN_OUT } from "src/constants/easing";
import shuffle from "lodash/shuffle";

const mineFlight = (index, coord, synchronize) => async ({
  spawn,
  wait,
  addScreenTrauma,
  //until,
  call,
  //displayFrame,
  waitForEvent,
  race,
  moveTo
}) => {
  let activeMovement = null;
  await wait(index * 50);

  const mine = spawn("Mine", {
    location: {
      rx: 1.2,
      ry: 0.7
    },
    defaultVelocity: 200
  });
  activeMovement = moveTo(mine, { y: 1.1 }, null, EASE_OUT);
  await activeMovement.process;
  await call(mine.showState, "rotate");

  await call(mine.allowDamage, { health: 40 });
  activeMovement = moveTo(mine, { x: coord.x }, null, EASE_OUT);

  await race([
    () =>
      waitForEvent(mine, "Dead", async () => {
        activeMovement && activeMovement.abort();
        synchronize();
        if (mine.appliedEntityState === "explode") return;
        call(mine.showState, "dead");
        addScreenTrauma(0.2);

        await wait(500);
        mine.destroy();
        activeMovement && activeMovement.abort();
      }),
    async () => {
      await activeMovement.process;
      if (activeMovement.wasCompleted()) {
        await synchronize();
        if (mine.appliedEntityState === "dead") return;
        activeMovement = moveTo(mine, { y: coord.y }, null, EASE_IN_OUT);
        await activeMovement.process;
        if (activeMovement.wasCompleted()) {
          await wait(200 + Math.random() * 2000);
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
  const amount = 10;
  const gridX = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
  const gridY = [0.2, 0.4, 0.6, 0.8];

  const coords = shuffle(
    gridX.reduce((list, x) => list.concat(gridY.map(y => ({ x, y }))), [])
  );

  const items = makeSynchronization(amount).map(async (res, index) => {
    await exec(mineFlight(index, coords.pop(), res));
  });
  await Promise.all(items);
};
