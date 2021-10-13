#!/usr/bin/env node

var litereum = require("./kindelia.js");
var fs = require("fs");

var file_name = process.argv[2];

if (!file_name) {
  console.log("usage: lit file_name.lit")
  process.exit();
}

var file = fs.readFileSync(file_name, "utf8");

litereum.run(litereum["Kindelia.api.run"](file));
