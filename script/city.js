"use strict";

module.exports = class City{
  constructor(cell, forJson=false){
    this.prefCode = cell.prefCode();
    this.cityCode = cell.cityCode();
    this.cityName = cell.cityName();
    this.senkyokuNums = [cell.senkyokuNum()];
    this.cells = [];
    this.standardSenkyokuNum = 1;
    this.forJson = forJson;
    this.isDevided = false;
  }
  isSameCity(cell){
    return this.cityCode === cell.cityCode();
  }
  registerSenkyokuNum(cell){
    if(!this.isSameCity(cell)) return false;
    if(!this.forJson) this.cells.push(cell);
    if(this.senkyokuNums.includes(cell.senkyokuNum())) return false;
    this.senkyokuNums.push(cell.senkyokuNum());
    this.senkyokuNums.sort((a,b)=>{ return a - b});
    this.isDevided = (this.senkyokuNums.length > 1);
  }
  /**
   * 小選挙区で分割されている自治体かどうか
   * @returns {boolean}
   */
  isDevided(){
    return this.senkyokuNums.length > 1;
  }

  /**
   * 異なる選挙区番号を持つかどうか確認
   */
  _searchSenkyokuNumWithMultiCells(cells, postalCode){
    if(cells.length === 0) throw `_searchSenkyokuNumWithMultiCellsにおいて、cellsの長さが不足しています。`;
    const senkyokuNums = [];
    for(let i = 0; i < cells.length; i = i + 1){
      if(!senkyokuNums.includes(cells[i].senkyokuNum())){
        senkyokuNums.push(cells[i].senkyokuNum())
      }
    }
    //選挙区番号が取得できない場合はエラー
    if(senkyokuNums.length === 0){
      throw `no SenkyokuNums with postalCode = ${JSON.stringify(postalCode)}`;
    }
    //単一の選挙区番号の場合は当該番号を返す
    if(senkyokuNums.length === 1){
      return senkyokuNums[0];
    }
    //複数の番号を保つ場合はエラーを返す。
    if(senkyokuNums.length > 1){
      return this.getMostFreqentSenkyokuNum(cells);
      //throw `postalCode= ${postalCode.postalCode7}　は複数の選挙区番号を持つ町字のcells= ${JSON.stringify(cells)} を含みます。`
      //throw `postalCode= ${JSON.stringify(postalCode)}　は複数の選挙区番号を持つ町字のcells= ${JSON.stringify(cells)} を含みます。`
    }
    throw "Logic ERROR";
  }

  searchSenkyokuNumByTownName(townName, pc = null){
    //文字数を最後まで探索しても存在しない場合は標準選挙区を返す
    if(townName.length === 0){
      return this.standardSenkyokuNum;
    }
    //指定された町字に対応したcellsを返す
    const cells = this.searchCellsIncludingTownName(townName);
    if(cells === null){
      return this.searchSenkyokuNumByTownName(townName.substring(0, townName.length - 1), pc);
    }
    if(cells.length === 1){
      return cells[0].senkyokuNum()
    }
    if(cells.length > 1){
      return this._searchSenkyokuNumWithMultiCells(cells, pc);
    }
  }


  /**
   * 与えら得た町字名と一致する又はそれを含むcellを返す
   * @returns {string}
   */
  searchCellsIncludingTownName(townName){
    const same = [];
    const includes = [];
    for(let i = 0; i < this.cells.length; i = i + 1 ){
      const cell =  this.cells[i];
      if(cell.townName()===townName) same.push(cell);
      if(cell.townName().includes(townName)) includes.push(cell);
    }
    if(same.length > 0) return same;
    if(includes.length > 0) return includes;
    return null;
  }

  getMostFreqentSenkyokuNum(cells){
    const debug = false;
    if(cells.length === 0) throw `セルが１つも存在しません ${JSON.stringify(this)}`;
    if(debug) console.log(`セルの配列の長さ=${cells.length}`);
    let count = {};
    for(let i = 0; i < cells.length; i = i + 1){
      const num = cells[i].senkyokuNum();
      if(!(num in count)) count[num] = [cells[i]];
      count[num].push(cells[i]);
    }
    let top = [];
    Object.keys(count).forEach((k)=>{
      if(count[k].length > top.length){
        top = count[k];
      }
    });
    return top[0].senkyokuNum();
  }
  /**
   * その自治体で最も頻度の多い選挙区番号を設定する
   * #テスト書く
   * @returns {string}
   */
  setStandardSenkyokuNum(){
    this.standardSenkyokuNum = this.getMostFreqentSenkyokuNum(this.cells);
    return this.standardSenkyokuNum;
  }
  message(){
    if(this.isDevided()){
      return `${this.cityName}(${this.cityCode})は複数選挙区${this.senkyokuNums.join("区,") + "区"}に分割されてます`;
    }
    return `${this.cityName}(${this.cityCode})は選挙区${this.senkyokuNums + "区"}に属しています`;
  }
};