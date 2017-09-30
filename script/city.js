"use strict";

module.exports = class City{
  constructor(cell){
    this.prefCode = cell.prefCode();
    this.cityCode = cell.cityCode();
    this.cityName = cell.cityName();
    this.senkyokuNums = [cell.senkyokuNum()];
    this.cells = [];
    this.isDevided = false;
  }
  isSameCity(cell){
    return this.cityCode === cell.cityCode();
  }
  registerSenkyokuNum(cell){
    if(!this.isSameCity(cell)) return false;
    if(this.senkyokuNums.includes(cell.senkyokuNum())) return false;
    this.cells.push(cell);
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
    return includes;
  }
  message(){
    if(this.isDevided()){
      return `${this.cityName}(${this.cityCode})は複数選挙区${this.senkyokuNums.join("区,") + "区"}に分割されてます`;
    }
    return `${this.cityName}(${this.cityCode})は選挙区${this.senkyokuNums + "区"}に属しています`;
  }
};