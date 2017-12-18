const path = require("path");
module.exports = require("browserslist").readConfig(
  path.join(__dirname, "../browserslist")
).defaults;
