"use strict";

const fs = require("fs-extra");
const csvSync = require('csv-parse/lib/sync');

const postalFileName = `${__dirname}/../data/dl/postal_code/KEN_ALL.CSV.utf8`;
const testFileName = `${__dirname}/../data/dl/postal_code/test/KEN_ALL.CSV`;


const PostalCodeReader = require("./postal_code_reader");

const pcr = new PostalCodeReader(postalFileName);
//console.log(pcr.postalCodes);

const SenkyokuCellReader =require("./senkyoku_cell_reader");
const scr = new SenkyokuCellReader();
console.log(scr.resultMessage());

const City2Senkyoku = require("./city2senkyoku");
const c2s = new City2Senkyoku();

const keys = Object.keys(pcr.postalCodes);
let max = keys.length;

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
      continue;
    }
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

