"use strict";
const fs = require("fs-extra");
const csvSync = require('csv-parse/lib/sync');

const postalFileName = `${__dirname}/../data/dl/postal_code/KEN_ALL.CSV.utf8`;
const testFileName = `${__dirname}/../data/dl/postal_code/test/KEN_ALL.CSV`;

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


module.exports = class PostalCodeReader{
  constructor(fileName = postalFileName){
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
