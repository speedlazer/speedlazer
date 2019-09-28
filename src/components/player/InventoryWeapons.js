Crafty.c("InventoryWeapons", {
  init() {},

  stats(newStats) {
    // TODO: Needs refactoring
    if (newStats == null) {
      newStats = {};
    }
    if (newStats.primary != null) {
      this.primaryWeapon.stats = newStats.primary.stats;
      //@primaryWeapon.boosts = newStats.primary.boosts
      //@primaryWeapon.boostTimings = newStats.primary.boostTimings
      this.primaryWeapon._determineWeaponSettings();
    }

    const stats = {};
    stats["primary"] = {
      stats: (this.primaryWeapon && this.primaryWeapon.stats) || {},
      boosts: (this.primaryWeapon && this.primaryWeapon.boosts) || {},
      boostTimings:
        (this.primaryWeapon && this.primaryWeapon.boostTimings) || {}
    };

    return stats;
  },

  installItem(item) {
    if (!item) return;

    if (item.type === "weapon") {
      if (this.hasItem(item.contains)) {
        return;
      }
      this.items.push(item);

      if (item.contains === "lasers") {
        this._installPrimary("RapidWeaponLaser");
        return true;
      }

      if (item.contains === "oldlasers") {
        this._installPrimary("OldWeaponLaser");
        return true;
      }

      if (item.contains === "diagonals") {
        this._installPrimary("RapidDiagonalLaser");
        return true;
      }
    }

    if (["ship", "shipBoost", "shipUpgrade"].includes(item.type)) {
      if (item.contains === "life") {
        this.scoreText("Extra life!");
        return true;
      }
      if (item.contains === "healthb") {
        this.scoreText("Full health!");
        return true;
      }
      if (item.contains === "healthu") {
        this.scoreText("Health upgrade!");
        return true;
      }
      if (item.contains === "points") {
        this.scoreText("+500 points!");
        return true;
      }
      if (item.contains === "xp") {
        if (typeof this.primaryWeapon.addXP === "function") {
          this.primaryWeapon.addXP(1000);
        }
        return true;
      }
    }

    if (item.type === "weaponUpgrade") {
      this.primaryWeapon.upgrade(item.contains);
      return true;
    }

    if (item.type === "weaponBoost") {
      this.primaryWeapon.boost(item.contains);
      return true;
    }
  }
});
