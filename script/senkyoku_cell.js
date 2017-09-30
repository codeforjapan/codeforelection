"use strict";

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

module.exports = class SenkyokuCell{
  constructor(obj){
    if(obj["市町村コード"].length === 4){
      obj["市町村コード"] = "0"+obj["市町村コード"];
    }
    this.obj = obj;
  }
  cityCode(){
    return this.obj["市町村コード"];
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
    return this.obj["選挙区"];
  }
}