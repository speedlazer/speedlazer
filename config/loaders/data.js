/* eslint-env node */
require("@babel/register");
const fs = require("fs");

const assignUnit = (amount, unitLevel = 0) =>
  amount > 1024
    ? assignUnit(amount / 1024, unitLevel + 1)
    : { amount, unitLevel };

const toHuman = amount => {
  const withUnit = assignUnit(amount);
  const scale = ["b", "Kb", "Mb", "Gb"];

  return `${Math.round(withUnit.amount * 100) / 100} ${
    scale[withUnit.unitLevel]
  }`;
};

// Based on:
// https://v8.dev/blog/cost-of-javascript-2019#json

module.exports = function(input) {
  this.cacheable();

  const folders = JSON.parse(input);
  const path = this.resourcePath.split("/").slice(0, -1);

  const allData = folders.reduce((acc, folder) => {
    const dirPath = path.concat(folder);
    const entries = fs.readdirSync(dirPath.join("/"));

    const struct = entries.reduce((acc, entry) => {
      if (entry.endsWith(".js")) {
        const filePath = dirPath.concat(entry);
        // watch this file now as well
        this.addDependency(filePath.join("/"));

        const file = require(filePath.join("/"));
        const fileContent = file.default;
        return { ...acc, ...fileContent };
      }
      if (entry.endsWith(".json")) {
        const filePath = dirPath.concat(entry);
        // watch this file now as well
        this.addDependency(filePath.join("/"));

        const file = fs.readFileSync(filePath.join("/"), "utf8");
        const fileContent = JSON.parse(file);
        return { ...acc, ...fileContent };
      }

      return acc;
    }, {});
    return { ...acc, [folder]: struct };
  }, {});
  const stringData = JSON.stringify(allData);

  console.log(`Bundling ${toHuman(stringData.length)} of game data`);
  const content = `
const data = JSON.parse("${stringData.replace(/"/g, '\\"')}");
`;
  const exports = folders.map(
    folder =>
      `
export const ${folder}Data = data.${folder};
export const ${folder} = name => ${folder}Data[name];
`
  );

  return [content].concat(exports).join("\n\n");
};
