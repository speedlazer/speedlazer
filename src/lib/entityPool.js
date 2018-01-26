const createEntityPool = (createFunction, poolSize) => {
  return {
    _pool: [],
    _maxSize: poolSize,

    get() {
      if (this._pool.length > 0) {
        var ent = this._pool.pop();
        // Should get auto inserted into map automatically
        ent.unfreeze();
        return ent;
      }

      return createFunction();
    },
    recycle(ent) {
      if (this._pool.length >= this._maxSize) {
        //Crafty.log(`pool size of ${this._maxSize} is not sufficient`);
        ent.destroy();
        return;
      }
      ent.freeze();
      this._pool.push(ent);
    },
    clean() {
      this._pool.forEach(e => e.destroy());
      this._pool = [];
    }
  };
};

export default createEntityPool;
