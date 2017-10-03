"use strict";

const fs = require("fs-extra");

const src = `${__dirname}/../data/json/postal2senkyoku.json`;
const target = `${__dirname}/../data/json/postal2senkyoku.light.json`;

const srcObj = JSON.parse(fs.readFileSync(src).toString());

/**
 * 三桁の郵便番号で集約するクラス
 */
class Postal3{
  constructor(obj){
    this.postal3 = obj.postal3;
    this.list = [obj];
    this.c = obj.c;
    this.s = obj.s;
    this.isSingleSenkyoku = true;
  }

  add(obj){
    if(!obj.postal3) throw "postal3がない";
    if(this.isSameArea(obj)){
      this.list.push(obj);
      this.isSingleSenkyoku = (this.s === obj.s);
    }
  }
  isSameArea(obj){
    return this.postal3 === obj.postal3 && this.c === obj.c;
  }
  getResult(){
    if(this.isSingleSenkyoku){
      let rep = {
        c: this.c,
        s: this.s,
        k: this.postal3,
      };
      return rep;
    }
    return this.list.map((e)=>{
      return {
        c: e.c,
        s: e.s,
        k: e.key
      }
    });
  }
}
let keys = Object.keys(srcObj);
//keysをソートした状態で持つ
keys = keys.sort();

let list = keys.map((k)=>{
  let obj = srcObj[k];
  obj.key = k;
  obj.postal3 = k.substring(0,3);
  return obj;
});

let res = [];
let p3 = null;
for ( let i = 0; i < list.length; i = i + 1 ){
  let obj = list[i];
  //console.log(obj);
  if(p3 === null){
    p3 = new Postal3(obj);
  }else if(p3.isSameArea(obj)){
    p3.add(obj);
  }else{
    res = res.concat(p3.getResult());
    p3 = new Postal3(obj);
  }
}

let hash = {};
for(let i = 0; i < res.length; i = i + 1){
  hash[res[i].k] = {
    p: res[i].c.substring(0,2),
    s: res[i].s
  }
}

fs.writeFileSync(target, JSON.stringify(hash));
