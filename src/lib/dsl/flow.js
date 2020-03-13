const flowFunctions = (dsl, state) => {
  const call = (fn, ...args) => fn(...args);

  const exec = (script, ...args) => script(dsl, ...args);

  const wait = duration => {
    const parts = Math.floor(duration / 40);
    return new Promise((resolve, reject) =>
      Crafty.e("Delay").delay(
        () => {
          if (!dsl.currentScript()) resolve();
          if (state.gameEnded === true) reject(new Error("Game Over"));
        },
        40,
        parts,
        function() {
          resolve();
          this.destroy();
        }
      )
    );
  };

  const waitWhile = async (fn, ...args) => {
    let waiting = await call(fn, ...args);
    while (waiting) {
      await wait(50);
      waiting = await call(fn, ...args);
    }
  };

  // Resolve on event, reject on kill
  const waitForEvent = (entity, event, callback) =>
    new Promise((resolve, reject) => {
      const removeHandler = () => {
        resolve();
      };
      entity.one("Remove", removeHandler);
      entity.one(event, async () => {
        entity.unbind("Remove", removeHandler);
        if (dsl.currentScript()) {
          try {
            await callback();
          } catch (e) {
            // script needs to abort
            reject(e);
            return;
          }
        }
        resolve();
      });
    });

  const until = async (actionInProgress, repeatAction) => {
    let actionCompleted = false;
    actionInProgress(dsl).then(() => {
      actionCompleted = true;
    });
    while (!actionCompleted) {
      await repeatAction(dsl);
    }
  };

  return {
    until,
    waitWhile,
    waitForEvent,
    wait,
    exec,
    call
  };
};

export default flowFunctions;
