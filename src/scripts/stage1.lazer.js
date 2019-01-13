import battleship from "./stage1/battleship.lazer";

const stage1 = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  setWeapons,
  exec
}) => {
  await loadSpriteSheets(["city-enemies", "city-scenery"]);

  await setScrollingSpeed({ x: 300 });
  await setScenery("City.Ocean");
  await setWeapons(["lasers"]);
  await exec(battleship);
};

export default stage1;
