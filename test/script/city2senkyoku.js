"use strict";

const assert = require("power-assert");
const City2Senkyoku = require("../../script/city2senkyoku");
const c2s = new City2Senkyoku();

describe("City2Senkyoku",()=>{
  it("インスタンス化できる",()=> {
    assert(c2s);
  });
  it("ハッシュが2以上読み込まれている", ()=>{
    assert(Object.keys(c2s.hash).length > 2);
  });
  it("10201の市町村が引ける",()=>{
    assert(c2s.senkyokuNums(["10201"]);
  });
});
