"use strict";

module.exports = class City{
  constructor(cell){
    this.prefCode = cell.prefCode();
    this.cityCode = cell.cityCode();
    this.cityName = cell.cityName();
    this.senkyokuNums = [cell.senkyokuNum()];
    this.isDevided = false;
  }
  isSameCity(cell){
    return this.cityCode === cell.cityCode();
  }
  registerSenkyokuNum(cell){
    if(!this.isSameCity(cell)) return false;
    if(this.senkyokuNums.includes(cell.senkyokuNum())) return false;
    this.senkyokuNums.push(cell.senkyokuNum());
    this.senkyokuNums.sort((a,b)=>{ return a - b});
    this.isDevided = (this.senkyokuNums.length > 1);
  }
  isDevided(){
    return this.senkyokuNums.length > 1;
  }
  message(){
    if(this.isDevided()){
      return `${this.cityName}(${this.cityCode})は複数選挙区${this.senkyokuNums.join("区,") + "区"}に分割されてます`;
    }
    return `${this.cityName}(${this.cityCode})は選挙区${this.senkyokuNums + "区"}に属しています`;
  }
};