"use strict";
const fs = require("fs-extra");
const csvSync = require('csv-parse/lib/sync');

module.exports = class City2Senkyoku{
  constructor(filePath = `${__dirname}/../data/json/city2senkyoku.json`){
    this.file = fs.readFileSync(filePath);
    this.hash = JSON.parse(this.file.toString());
    console.log(`${Object.keys(this.hash).length}　個のcity2senkyoku JSONデータを読み込みました。`);
  }
  senkyokuNums(cityCode){
    if(!(cityCode in this.hash)){
      throw `City2Senkyoku ${cityCode}はJSONファイル中に見つかりません。`;
    }
    return this.hash[cityCode].senkyokuNums;
  }
};

