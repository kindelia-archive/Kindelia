#!/usr/bin/env node

var litereum = require("./litereum.js");
var fs = require("fs");

var file_name = process.argv[2];

if (!file_name) {
  console.log("usage: lit file_name.lit")
  process.exit();
}

var file = fs.readFileSync(file_name, "utf8");

litereum.run(litereum["Litereum.api.run_block"](file));
