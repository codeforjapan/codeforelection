"use strict";

const SenkyokuCellReader = require("./senkyoku_cell_reader");

const senkyokuDirPath = `${__dirname}/../data/dl/senkyoku/CCAminToSenkyokuKokai/`;

//最後にutf8という拡張子のみ読み込むため、test.csvは読まれない
const testFileName = "test.csv";

const fileReader = new SenkyokuCellReader(senkyokuDirPath);
fileReader.readFiles();
console.log(fileReader.resultMessage());
fs.writeFile("../data/json/city2senkyoku.json", JSON.stringify(fileReader.cities));

