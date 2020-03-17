import { EASE_OUT, EASE_IN_OUT } from "src/constants/easing";
import shuffle from "lodash/shuffle";

const mineFlight = (coord, synchronize) => async ({
  spawn,
  wait,
  //until,
  call,
  //displayFrame,
  waitForEvent,
  moveTo
}) => {
  // spawn drone off screen
  const mine = spawn("Mine", {
    location: {
      rx: 1.1,
      ry: 0.4
    },
    defaultVelocity: 400
  });
  await call(mine.showState, "rotate");

  await call(mine.allowDamage, { health: 40 });
  const movement = moveTo(mine, { x: coord.x }, null, EASE_OUT);

  waitForEvent(mine, "Dead", async () => {
    movement.abort();
    await call(mine.showState, "dead");
  });

  await movement.process;
  await synchronize();
  const movement2 = moveTo(mine, { y: coord.y }, 200, EASE_IN_OUT);
  await movement2.process;

  await wait(2000);
  await call(mine.showState, "open");
  await wait(500);
  await call(mine.showState, "blinking");
  await wait(2000);
  await call(mine.showState, "explode");
  await wait(400);
  mine.destroy();
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

export const mineWave = () => async ({ exec, wait }) => {
  const amount = 10;
  const gridX = [0.2, 0.4, 0.6, 0.8];
  const gridY = [0.1, 0.3, 0.5, 0.7];

  const coords = shuffle(
    gridX.reduce((list, x) => list.concat(gridY.map(y => ({ x, y }))), [])
  );

  const items = makeSynchronization(amount).map(async (res, index) => {
    await wait(index * 500);
    await exec(mineFlight(coords.pop(), res));
  });
  await Promise.all(items);
};
