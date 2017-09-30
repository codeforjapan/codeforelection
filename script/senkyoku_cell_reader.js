"use strict";

/**
 * Nishizawaさん作成のデータを読み込む
 * @type {SenkyokuCellReader}
 */
const fs = require("fs-extra");
const csvSync = require('csv-parse/lib/sync');

const Cell = require("./senkyoku_cell");
const City = require("./city");

const senkyokuDirPath = `${__dirname}/../data/dl/senkyoku/CCAminToSenkyokuKokai/`;

module.exports = class SenkyokuCellReader{
  constructor(dir_path = senkyokuDirPath) {
    this.dir_path = dir_path;
    this.cities = {};
    this.cells = [];
    this.cellCount = 0
  }
  readFiles(){
    this.files = fs.readdirSync(this.dir_path);
    //指定されたdirからファイルごとにループ
    for(let i = 0; i < this.files.length ; i = i + 1){
      if(this.files[i].endsWith(".csv.utf8")){
        this.filePath = this.files[i];
        const data = fs.readFileSync(this.dir_path + this.files[i]);
        this.res = csvSync(data, {columns: true});
        this.readLines();
      }
    }
  }
  readLines(){
    for(let i=0; i< this.res.length ; i = i + 1){
      let elem = this.res[i];
      const cell = new Cell(elem);
      if(cell.cityCode() ===  null || cell.cityCode() === "" || cell.cityCode() == 0) {
        console.log(`${this.filePath} ${i}行目 ${JSON.stringify(cell.obj)}は【都市コード】異常`);
        continue;
      }
      if(cell.cityName() ===  null || cell.cityName() === "") {
        console.log(`${this.filePath} ${i}行目 ${JSON.stringify(cell.obj)}は【都市名】異常`);
        continue;
      }
      if(!this.cities[cell.cityCode()]){
        this.cities[cell.cityCode()] = new City(cell);
      }
      this.cities[cell.cityCode()].registerSenkyokuNum(cell);
      this.cells.push(cell);
    }
  }
  resultMessage(){
    return `${Object.keys(this.cities).length}都市、${this.cells.length}の地点データを読み込みました`;
  }

}