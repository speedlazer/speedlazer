const promises = {};

const scopedPromise = scope => {
  promises[scope] = [];

  return {
    promise: p => {
      const promise = new Promise((resolver, rejecter) => {
        promises[scope].push(rejecter);
        p(
          r => {
            promises[scope] = promises[scope].filter(r => r !== rejecter);
            resolver(r);
          },
          r => {
            promises[scope] = promises[scope].filter(r => r !== rejecter);
            rejecter(r);
          }
        );
      });
      return promise;
    },
    open: () => promises[scope].length,
    clean: err => {
      promises[scope].forEach(r => r(err));
      promises[scope] = [];
    }
  };
};

export default scopedPromise;
