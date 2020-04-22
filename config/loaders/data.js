/* eslint-env node */
require("@babel/register");
const validate = require("jsonschema").validate;
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
  this.cacheable(true);

  const folders = JSON.parse(input);
  const path = this.resourcePath.split("/").slice(0, -1);

  const schemas = {};
  const validateJSON = (filePath, fileContent, folder) => {
    const schema = schemas[folder];
    if (!schema) return;
    const relativePath = path.slice(0, -2).join("/");
    const result = validate(fileContent, schema);
    result.errors.forEach(e =>
      this.emitWarning(
        new Error(`${filePath.slice(relativePath.length + 1)}: ${e.stack}`)
      )
    );
  };

  const allData = folders.reduce((acc, { name: folder, schema }) => {
    if (schema) {
      const schemaPath = path
        .slice(0, -2)
        .concat(schema)
        .join("/");
      this.addDependency(schemaPath);

      const schemaContents = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
      schemas[folder] = schemaContents;
    }

    const dirPath = path.concat(folder);
    this.addContextDependency(dirPath.join("/"));
    const entries = fs.readdirSync(dirPath.join("/"));

    const struct = entries.reduce((acc, entry) => {
      if (entry.endsWith(".js")) {
        const filePath = dirPath.concat(entry);

        delete require.cache[require.resolve(filePath.join("/"))];
        const file = require(filePath.join("/"));
        const fileContent = file.default;
        validateJSON(filePath.join("/"), fileContent, folder);
        return { ...acc, ...fileContent };
      }
      if (entry.endsWith(".json")) {
        const filePath = dirPath.concat(entry);
        // watch this file now as well
        this.addDependency(filePath.join("/"));

        const file = fs.readFileSync(filePath.join("/"), "utf8");
        const fileContent = JSON.parse(file);
        validateJSON(filePath.join("/"), fileContent, folder);
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
    ({ name: folder }) =>
      `
export const ${folder}Data = data.${folder};
export const ${folder} = name => ${folder}Data[name];
`
  );

  return [content].concat(exports).join("\n\n");
};
