const flowFunctions = dsl => ({
  call: async (fn, ...args) => await fn(...args),
  exec: async (script, ...args) => {
    await script(dsl, ...args);
  },
  wait: async duration => {
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
  }
});

export default flowFunctions;