import spritesheets from "src/images";

export const loadSpriteSheets = async sheetNames =>
  new Promise(resolve => {
    const loader = {
      sprites: {}
    };
    spritesheets
      .filter(sheet => sheetNames.includes(sheet.name))
      .forEach(sheet => {
        loader.sprites[sheet.image] = sheet.map;
      });
    Crafty.load(loader, resolve);
  });
