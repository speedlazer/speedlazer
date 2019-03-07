const shipFunctions = (state, level) => ({
  setWeapons: async weapons => {
    Crafty("PlayerControlledShip").each(function() {
      this.clearItems();
      weapons.forEach(weapon => {
        this.installItem({ type: "weapon", contains: weapon });
      });
    });
    level.setStartWeapons(weapons);
  }
});

export default shipFunctions;
