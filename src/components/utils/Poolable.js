Crafty.c("Poolable", {
  init() {
    this.attr({ hasPool: true });
  },

  setupPool(pool) {
    this.pool = pool;
    return this;
  },

  recycle() {
    this.pool.recycle(this);
  }
});
