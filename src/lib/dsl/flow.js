const flowFunctions = dsl => {
  const call = async (fn, ...args) => await fn(...args);

  const exec = async (script, ...args) => {
    await script(dsl, ...args);
  };

  const wait = async duration => {
    const parts = Math.floor(duration / 40);
    return new Promise(resolve =>
      Crafty.e("Delay").delay(
        () => {
          // add sequence verification here later
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
    wait,
    exec,
    call
  };
};

export default flowFunctions;
