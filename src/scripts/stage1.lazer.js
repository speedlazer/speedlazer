const stage1 = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  setWeapons
}) => {
  await loadSpriteSheets(["city-enemies", "city-scenery"]);

  await setScrollingSpeed({ x: 300 });
  await setScenery("City.Ocean");
  await setWeapons(["lasers"]);
};

export default stage1;
