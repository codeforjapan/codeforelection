"use strict";

const fs = require("fs-extra");
const csvSync = require('csv-parse/lib/sync');

const postalFileName = `${__dirname}/../data/dl/postal_code/KEN_ALL.CSV.utf8`;
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
    for(let i = 0; i < data.length; i = i+1){
      let postalCode;
      try{
        postalCode = new PostalCode(data[i]);
        this.postalCodes[postalCode.obj.postalCode7] = postalCode;
      }catch(e){
        console.log(e);
        continue
      }
    }
    console.log( `postalCodeを　${Object.keys(this.postalCodes).length}個　読み込みました`)
  }
}

const pcr = new PostalCodeReader(postalFileName);
//console.log(pcr.postalCodes);

const SenkyokuCellReader =require("./senkyoku_cell_reader");
const SenkyokuCell = require("./senkyoku_cell");

const scr = new SenkyokuCellReader();
console.log(scr.resultMessage());

const City2Senkyoku = require("./city2senkyoku");
const c2s = new City2Senkyoku();

const keys = Object.keys(pcr.postalCodes);
let max = keys.length;
let count1 = 10;
let count = 10;

const res = {};
for(let i = 0; i< max ; i = i + 1){
　//各postalCodeのレコードについて確認
  //console.log(`key = ${keys[i]}`);
  const pc = pcr.postalCodes[keys[i]];
  //市町村で複数の選挙区をもつ場合のみ問題とする
  let nums ;
  try{
    nums = c2s.senkyokuNums(pc.obj.cityCode);
    if(nums.length === 1){
      if(count1 > 0) console.log(`${JSON.stringify(pc.obj)} は単一選挙区に含まれます`);
      count1 = count1 - 1;
      continue;
    }
    //if(false || count === 0) break;
    count = count - 1;
    //選挙区情報から整理された都市情報を抽出
    const city = scr.cities[pc.obj.cityCode];
    const num = city.searchSenkyokuNumByTownName(pc.obj.townName, pc.obj);
    pc.obj.senkyoNum = num;
    res[pc.obj.postalCode7] = {
      cityCode: pc.obj.cityCode,
      senkyoNum: num
    };
  }catch (e){
    console.log(e);
  }
}
const fileName = "postal2senkyoku.json";
fs.writeFileSync(`${__dirname}/../data/json/${fileName}`, JSON.stringify(res));

