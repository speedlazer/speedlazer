const synchroniser = () => {
  let listeners = 0;
  let completed = [];
  let promises = [];
  let id = 0;
  let started = false;

  return {
    addSynchronisation: () => {
      if (started) throw new Error("Synchronisation already started");
      listeners++;
      const listenerId = ++id;
      let resolver = null;
      const promise = new Promise(res => (resolver = res));
      promises.push(promise);

      return async () => {
        started = true;
        if (completed.find(i => i === listenerId) === undefined) {
          completed.push(listenerId);
          resolver();
        }

        return Promise.allSettled(promises);
      };
    },
    get listeners() {
      return listeners;
    },
    get completed() {
      return completed.length;
    }
  };
};

export default synchroniser;
