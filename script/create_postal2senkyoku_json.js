"use strict";

const fs = require("fs-extra");
const csv = require("csv");
const exec = require("exec");
const csvSync = require('csv-parse/lib/sync');

const postalFilePath = `${__dirname}/../data/dl/postal_code/KEN_ALL.CSV`;
const senkyokuDirPath = `${__dirname}/../data/dl/senkyoku/CCAminToSenkyokuKokai/`;
//最後にutf8という拡張子のみ読み込むため、test.csvは読まれない
const testFileName = "test.csv";
//"H27CCAminToSenkyokuKokai_13.csv.utf8";

/**
 * csv読み込み中身
 * [ { '行番号': '1',
    '市町村コード': '1101',
    '町丁字コード１': '1010200',
    '町丁字コード２': '200',
    '地域識別番号': '2',
    '市区町村名': '札幌市中央区',
    '町丁字名': '宮ケ丘（番地）',
    '選挙区': '1' },
 { '行番号': '2',
   '市町村コード': '1101',
   '町丁字コード１': '1010300',
   '町丁字コード２': '300',
   '地域識別番号': '2',
   '市区町村名': '札幌市中央区',
   '町丁字名': '円山',
   '選挙区': '1' },

 * @type {string}
 */

/**
 * 区域
 */
class Cell{
  constructor(obj){
    this.attrName = {
      code: "市町村コード",
      senkyoku: "選挙区"
    };

    if(obj[this.attrName.code].length === 4){
      obj[this.attrName.code] = "0"+obj[this.attrName.code];
    }
    this.obj = obj;
  }
  cityCode(){
    return this.obj[this.attrName.code];
  }
  prefCode(){
    return this.cityCode().substring(0,2);
  }
  cityName(){
    return this.obj["市区町村名"];
  }
  townName(){
    return this.obj["町丁字名"];
  }
  senkyokuNum(){
    return this.obj[this.attrName.senkyoku];
  }
}

/**
 * 基礎自治体
 */
class City{
  constructor(cell){
    this.prefCode = cell.prefCode();
    this.cityCode = cell.cityCode();
    this.cityName = cell.cityName();
    this.senkyokuNums = [cell.senkyokuNum()];
    this.isDevided = false;
  }
  isSameCity(cell){
    return this.cityCode === cell.cityCode();
  }
  registerSenkyokuNum(cell){
    if(!this.isSameCity(cell)) return false;
    if(this.senkyokuNums.includes(cell.senkyokuNum())) return false;
    this.senkyokuNums.push(cell.senkyokuNum());
    this.senkyokuNums.sort((a,b)=>{ return a - b});
    this.isDevided = (this.senkyokuNums.length > 1);
  }
  isDevided(){
    return this.senkyokuNums.length > 1;
  }
  message(){
    if(this.isDevided()){
      return `${this.cityName}(${this.cityCode})は複数選挙区${this.senkyokuNums.join("区,") + "区"}に分割されてます`;
    }
    return `${this.cityName}(${this.cityCode})は選挙区${this.senkyokuNums + "区"}に属しています`;
  }
}

class FileReader{
  constructor(dir_path) {
    this.dir_path = dir_path;
    this.cities = {};
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
      this.cellCount = this.cellCount + 1 ;

    }
  }
  resultMessage(){
    return `${Object.keys(this.cities).length}都市、${this.cellCount}の地点データを読み込みました`;
  }
}

const fileReader = new FileReader(senkyokuDirPath);
fileReader.readFiles();
console.log(fileReader.resultMessage());
fs.writeFile("../data/json/city2senkyoku.json", JSON.stringify(fileReader.cities));

