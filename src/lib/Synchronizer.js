import difference from "lodash/difference";

class Synchronizer {
  constructor() {
    this.entities = [];
    this.synchronizations = {};
    this.onceTriggers = [];
  }

  registerEntity(entity) {
    if (!this.entities.includes(entity)) this.entities.push(entity);
    return entity;
  }

  unregisterEntity(entity) {
    const index = this.entities.indexOf(entity);
    if (index >= 0) {
      this.entities.splice(index, 1);
    }
    this.verifyActiveSynchronisations();
    return entity;
  }

  synchronizeOn(name, entity) {
    const synchronization = this.synchronizations[name] || {
      defer: WhenJS.defer(),
      registered: []
    };
    this.synchronizations[name] = synchronization;

    if (!synchronization.registered.includes(entity)) {
      synchronization.registered.push(entity);
    }
    if (difference(this.entities, synchronization.registered).length === 0) {
      synchronization.defer.resolve();
    }

    return synchronization.defer.promise;
  }

  allowOnce(name) {
    if (this.onceTriggers.indexOf(name) !== -1) return false;
    this.onceTriggers.push(name);
    return true;
  }

  verifyActiveSynchronisations() {
    for (let name in this.synchronizations) {
      const sync = this.synchronizations[name];
      if (difference(this.entities, sync.registered).length === 0) {
        sync.defer.resolve();
      }
    }
  }
}

export default Synchronizer;
