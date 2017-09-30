"use strict";
const fs = require("fs-extra");
const csvSync = require('csv-parse/lib/sync');

module.exports = class City2Senkyoku{
  constructor(filePath = `${__dirname}/../data/json/city2senkyoku.json`){
    this.file = fs.readFileSync(filePath);
    this.hash = JSON.parse(this.file.toString());
  }
  senkyokuNums(cityCode){
    return this.hash[cityCode].senkyokuNums;
  }
};

