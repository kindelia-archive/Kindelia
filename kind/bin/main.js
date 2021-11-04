#!/usr/bin/env -S node --stack-size=2048

var kindelia = require("./kindelia.js");
var fs = require("fs");

var file_name = process.argv[2];

if (!file_name) {
  console.log("usage: kindelia file_name.kindelia")
  process.exit();
}

var file = fs.readFileSync(file_name, "utf8");

kindelia.run(kindelia["Kindelia.api.run"](file));
