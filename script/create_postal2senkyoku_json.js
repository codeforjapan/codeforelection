"use strict";

const SenkyokuCellReader = require("./senkyoku_cell_reader");

const senkyokuDirPath = `${__dirname}/../data/dl/senkyoku/CCAminToSenkyokuKokai/`;

//最後にutf8という拡張子のみ読み込むため、test.csvは読まれない
const testFileName = "test.csv";

const fileReader = new SenkyokuCellReader(senkyokuDirPath);
console.log(fileReader.resultMessage());
const cities = fileReader.cities;
//存在しないデータを追加
cities["04216"] = {prefCode:"04",cityCode:"04216",cityName:"富谷市",senkyokuNums:["4"],isDevided:false};
fs.writeFile("../data/json/city2senkyoku.json", JSON.stringify(fileReader.cities));

