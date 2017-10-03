"use strict";

const fs = require("fs-extra");

const src = `${__dirname}/../data/json/postal2senkyoku.json`;
const srcLight = `${__dirname}/../data/json/postal2senkyoku.light.json`;

const 

const srcObj = JSON.parse(fs.readFileSync(src).toString());

