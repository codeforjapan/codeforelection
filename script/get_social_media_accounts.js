"use strict";

require('dotenv').config();
const https = require('https');
const fs = require("fs-extra");
const csvSync = require('csv-parse/lib/sync');
const url_lib = require('url');
/*
 https://api.cognitive.microsoft.com/bing/v7.0/images/search[?q][&count][&offset][&mkt][&safeSearch]
 console.log(process.env.AZULE_BING_SEARCH_API_KEY_1);
 */

const filepath = `${__dirname}/../data/graydb/haaku_more.csv`;
const respath = `${__dirname}/../data/graydb/res.json`;
const keys = [
  "kanaid", "id", "senkyoku", "hirei", "hirei_teisu", "sei", "mei", "seikana", "meikana", "age", "party", "party2", "genshinmoto","kaisuu","hireichohuku","hireinum","more"
];
class HaakuMoreReader{
  constructor(filepath_ = filepath) {
    this.filepath = filepath_;
    const data = fs.readFileSync(this.filepath);
    this.lines = csvSync(data, {columns: keys});
  }
}

function snsId(url){
  if(!url.includes("https://twitter.com/") && !url.includes("https://www.facebook.com/")) return "";
  const p = url_lib.parse(url).pathname;
  if(!p) return "" ;
  if(p.startsWith("/")){
    return p.slice(1);
  }else{
    return p
  }
}

function query(obj, site){
  return `${obj["sei"]} ${obj["mei"]} ${obj["seikana"]} ${obj["meikana"]} site:${site}`;
}

function search(query, kanaid, size=3){
  const encode_query = encodeURIComponent(query);
  const options = {
    hostname: 'api.cognitive.microsoft.com',
    port: 443,
    path: `/bing/v7.0/search?q=${encode_query}&count=${size}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Ocp-Apim-Subscription-Key': process.env.AZULE_BING_SEARCH_API_KEY_1
    }
  };
  return new Promise((r,j)=>{
    let res = null;
    const request = https.request(options, (response) => {
      //console.log('statusCode:', response.statusCode);
      //console.log('headers:', response.headers);
      response.setEncoding('utf8');
      response.on('data', (data) => {
        res = JSON.parse(data);
        res.query = query;
        res.kanaid = kanaid;
      });
      response.on('end', () => { r(res); });
    });
    request.on('error', (e) => { j(e); });
    request.end();
  });
}


const hmr = new HaakuMoreReader();
const array = hmr.lines;
const lines = [];
const size = 3;
let count = 0;

console.log(JSON.stringify(array[count]));
let tw = search(query(array[count], "twitter.com"), array[count].kanaid, size);
let fb = search(query(array[count], "www.facebook.com"), array[count].kanaid, size);

let to = setInterval(function(){
  tw.then((res)=> {
    if(res && res.webPages && res.webPages.value){
      const v = res.webPages.value;
      for(let i = 0 ; i < v.length; i = i + 1) {
        if (v[i]) {
          lines.push([res.kanaid, 'tw', res.query, res.queryContext.originalQuery, snsId(v[i].url), v[i].url, v[i].name, v[i].snippet].join(","));
        }
      }
    }
    if(count < array.length - 1) tw = search(query(array[count], "twitter.com"), array[count].kanaid, size);
    return fb;
  }).then((res)=>{
    if(res && res.webPages && res.webPages.value) {
      const v = res.webPages.value;
      for (let i = 0; i < v.length; i = i + 1) {
        if (v[i]) {
          lines.push([res.kanaid, 'fb', res.query, res.queryContext.originalQuery, snsId(v[i].url), v[i].url, v[i].name, v[i].snippet].join(","));
        }
      }
    }
    if(count < array.length - 1 ) fb = search(query(array[count], "www.facebook.com"), array[count].kanaid, size);
    count = count + 1;
    if(count == array.length){
      console.log(lines);
      clearInterval(to);
      fs.writeFileSync(`${__dirname}/../data/graydb/haaku_sns_results.csv`, lines.join("\n"));
      const execSync = require('child_process').execSync;
      execSync(`nkf -s ${__dirname}/../data/graydb/haaku_sns_results.csv > ${__dirname}/../data/graydb/haaku_sns_results.sjis.csv`);
    }
    return false;
  }).catch((e)=>{
    count = count + 1;
    console.log(e);
  })
},1000);

