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
  let activeMovement = null;

  const mine = spawn("Mine", {
    location: {
      rx: 1.1,
      ry: 0.5
    },
    defaultVelocity: 400
  });
  await call(mine.showState, "rotate");

  await call(mine.allowDamage, { health: 40 });
  activeMovement = moveTo(mine, { x: coord.x }, null, EASE_OUT);

  waitForEvent(mine, "Dead", async () => {
    activeMovement && activeMovement.abort();
    synchronize();
    await call(mine.showState, "explode");
    // FIXME: Since this showState is activating a weapon,
    // the promise does not wait for it... and the entity is
    // destroyed to soon.
    mine.destroy();
  });

  await activeMovement.process;
  if (activeMovement.wasCompleted()) {
    await synchronize();
    activeMovement = moveTo(mine, { y: coord.y }, 200, EASE_IN_OUT);
    await activeMovement.process;
    if (activeMovement.wasCompleted()) {
      await wait(200 + Math.random() * 2000);
      await call(mine.showState, "open", 500);
      call(mine.showState, "blinking");
      await wait(1000);
      await call(mine.showState, "explode");
      mine.destroy();
    }
  }
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
  const gridY = [0.2, 0.4, 0.6];

  const coords = shuffle(
    gridX.reduce((list, x) => list.concat(gridY.map(y => ({ x, y }))), [])
  );

  const items = makeSynchronization(amount).map(async (res, index) => {
    await wait(index * 200);
    await exec(mineFlight(coords.pop(), res));
  });
  await Promise.all(items);
};
