"use strict";

const fs = require("fs-extra");
const csvSync = require('csv-parse/lib/sync');

const postalFileName = `${__dirname}/../data/dl/postal_code/KEN_ALL.CSV`;
const testFileName = `${__dirname}/../data/dl/postal_code/test/KEN_ALL.CSV`;

/**
 * SenkyokuCellデータのリストを作っておき、
 llPostalCodeのtownName
 */



/**
 * CSV読み込みのメタデータ
 * @type {[*]}
 */

const PostalCodeMeta = [
  "cityCode",
  "postalCode5",
  "postalCode7",
  "PrefYomi",
  "cityYomi",
  "townYomi",
  "prefName",
  "cityName",
  "townName",
  "isDeviedTown",
  "wakaran1",
  "hasCyoume",
  "wakaran2",
  "wakaran3",
  "wakaran4",
];


class PostalCode{
  constructor(obj){
    if(obj.cityCode.length !== 5){
      throw "cityCodeの長さは5である必要があります";
    }
    this.obj = obj;
  }
}

class PostalCodeReader{
  constructor(fileName = testFileName){
    this.fileName =fileName;
    this.postalCodes = {};
    const file = fs.readFileSync(fileName);
    const data = csvSync(file,{columns: PostalCodeMeta});
    for(let i = 0; i<data.length; i = i+1){
      let postalCode;
      try{
        postalCode = new PostalCode(data[i]);
        this.postalCodes[postalCode.obj.postalCode7] = postalCode;
      }catch(e){
        console.log(e);
        continue
      }
    }
  }
}

const pcr = new PostalCodeReader();
console.log(pcr.postalCodes);

const SenkyokuCellReader =require("./senkyoku_cell_reader");
const SenkyokuCell = require("./senkyoku_cell");

const csr = new SenkyokuCellReader();
console.log(csr.resultMessage());

const City2Senkyoku = require("./city2senkyoku");
const c2s = new City2Senkyoku();


for(let i = 0; i< pcr.postalCodes.length; i = i + 1){
  const pc = pcr.postalCodes[i];
  //市町村で複数の選挙区をもつ場合
  if(c2s.senkyokuNums(pc.cityCode) > 1){
    csr.cells
    //マッチング処理を書く
  }
}