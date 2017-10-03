"use strict";

const fs = require("fs-extra");

const srcDefault = `${__dirname}/../data/json/postal2senkyoku.json`;
const srcLight = `${__dirname}/../data/json/postal2senkyoku.light.json`;

const PostalCodeReader = require("./postal_code_reader");

const pcr = new PostalCodeReader();
let errors = [];

let srcObj = JSON.parse(fs.readFileSync(srcDefault).toString());
Object.keys(pcr.postalCodes).forEach((k)=>{
  const res = srcObj[k];
  if(!res) errors.push(k);
});

console.log(`標準サイズの　${Object.keys(srcObj).length}の要素のある${srcDefault} をチェックします。結果${errors.length}のエラー`);

errors = [];
srcObj = JSON.parse(fs.readFileSync(srcLight).toString());
Object.keys(pcr.postalCodes).forEach((k)=>{
  let res = null;
  res = srcObj[k.substring(0,3)]
  if(!res){
    const res = srcObj[k];
    if(!res) errors.push(k);
  }
});

console.log(`標準サイズの　${Object.keys(srcObj).length}の要素のある${srcLight} をチェックします。結果${errors.length}のエラー`);
