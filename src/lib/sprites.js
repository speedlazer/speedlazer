import Crafty from "../crafty";
import spritesheets from "../images";

export const loadSpriteSheets = async (sheetNames) =>
  new Promise((resolve) => {
    const loader = {
      sprites: {},
    };
    spritesheets
      .filter((sheet) => sheetNames.includes(sheet.name))
      .forEach((sheet) => {
        loader.sprites[sheet.image.split("?").at(0)] = sheet.map;
      });
    Crafty.load(loader, resolve);
  });
