/* eslint-env node */
const fs = require("fs");
require("@babel/register")({});

module.exports = function(input) {
  this.cacheable();

  const folders = JSON.parse(input);
  const path = this.resourcePath.split("/").slice(0, -1);
  const content = folders.map(folder => {
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

    return `
export const ${folder}Data = JSON.parse("${JSON.stringify(struct).replace(
      /"/g,
      '\\"'
    )}");
export const ${folder} = name => ${folder}Data[name];
`;
  });

  return content.join("\n\n");
};
