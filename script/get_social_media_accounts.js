"use strict";

require('dotenv').config();
const https = require('https');
const fs = require("fs-extra");
const csvSync = require('csv-parse/lib/sync');

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

class SearchResult{
  constructor(obj){
    this.url = obj.url;
    this.name = obj.name;
    this.snippet = obj.snippet;
    this.twitter = null;
    this.facebook = null;
    if(this.url.includes("https://twitter.com/")){
      this.twitter = this.url.replace("https://twitter.com/","")
    }
    if(this.url.includes("https://facebook.com/")){
      this.facebook = this.url.replace("https://facebook.com/","")
    }
  }
}

function search(obj, site="twitter.com", size=3){
  const query = `${obj["sei"]} ${obj["mei"]} ${obj["seikana"]} ${obj["meikana"]} site:${site}`;

  console.log(query);
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
  console.log(options);
  return new Promise((r,j)=>{
    const res = [];
    const request = https.request(options, (response) => {
      response.setEncoding('utf8');
      response.on('data', (data) => {
        const values = data.webPages.value;
        console.log(values);
        for(let i = 0 ;i < values.length; i = i + 1){
          res.push(new SearchResult(values[i]));
        }
        r(res);
      });
      response.on('end', () => { console.log("end"); r(res); });
    });
    request.on('error', (e) => { j(e); });
  });
}


const hmr = new HaakuMoreReader();
const array = hmr.lines.slice(0,3);
const results = {};

let count = 0;
let prom = search((array[count]));
let to = setInterval(function(){
  console.log(`c = ${count}`);
  console.log(`prom = ${prom.toString()}`);
  prom.then((res)=>{
    console.log(`res = ${res}`);
    results[array[count].kanaid] = res;
    count = count + 1;
    prom = search(array[count]);
    if(count === array.length){
      clearInterval(to);
      console.log(results);
      return false;
    }
    return false;
  }).catch((e)=>{
    count = count + 1
    console.log(e);
  })
},3000);



/*
let count = 1;
//let to = null;
function access(){
  console.log(count);
  results.push(count);
  count = count + 1;
  if( count === 4){
    console.log(results);
    clearInterval(to);
  }
}
let to = setInterval(access, 1000);




 function search(query) {
 //const query = encodeURIComponent("伊藤 優太 いとう ゆうた site:twitter.com");
 const options = {
 hostname: 'api.cognitive.microsoft.com',
 port: 443,
 path: `/bing/v7.0/search?q=${query}&count=3`,
 method: 'GET',
 headers: {
 'Content-Type': 'application/x-www-form-urlencoded',
 'Ocp-Apim-Subscription-Key': process.env.AZULE_BING_SEARCH_API_KEY_1
 }
 };

 const req = https.request(options, (res) => {
 console.log(`STATUS: ${res.statusCode}`);
 console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
 res.setEncoding('utf8');
 res.on('data', (chunk) => {
 console.log(`BODY: ${chunk}`);
 });
 res.on('end', () => {
 console.log('No more data in response.');
 });
 });

 req.on('error', (e) => {
 console.error(`problem with request: ${e.message}`);
 });

 // write data to request body
 req.end();

 }


 class BingSearchApi{
 constructor(key = rocess.env.AZULE_BING_SEARCH_API_KEY_1){
 this.key = key
 }
 search(query, site, size = 3){
 return this.search_(query + `site:${site}`, size);
 }
 search_(query, size = 3){
 this.encode_query = encodeURIComponent(query);
 this.options = {
 hostname: 'api.cognitive.microsoft.com',
 port: 443,
 path: `/bing/v7.0/search?q=${this.encode_query}&count=${size}`,
 method: 'GET',
 headers: {
 'Content-Type': 'application/x-www-form-urlencoded',
 'Ocp-Apim-Subscription-Key': this.key
 }
 };
 return new Promise((r,j)=>{
 const req = https.request(this.options, (res) => {
 //console.log(`STATUS: ${res.statusCode}`);
 //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
 res.setEncoding('utf8');
 res.on('data', (chunk) => {
 const res = [];
 const values = chunk.webPages.value;
 for(let i = 0 ;i < values.length; i = i + 1){
 res.push(new SearchResult(values[i]));
 }
 //console.log(`BODY: ${chunk}`);
 });
 res.on('end', () => {
 r(res);
 //console.log('No more data in response.');
 });
 });
 req.on('error', (e) => {
 //console.error(`problem with request: ${e.message}`);
 j(e);
 });
 })
 }
 }


 function access(){
 const obj = tri[count - 1];
 console.log(`q=${q}`);
 let tw_result = null;
 let fb_result = null;
 return api.search(q, "twitter.com").then((res)=> {
 tw_result = res;
 console.log(res);
 return api.search(q, "facebook.com");
 }).then((res)=>{
 console.log(res);
 fb_result = res;
 results[obj["kanaid"]] = {"tw": tw_result , "fb": fb_result};
 count = count - 1;
 if(count === 0){
 clearInterval(to);
 console.log(results);
 }
 }).catch((e)=>{
 console.log(e);
 });
 }
 let to = setInterval(access, 1000);

*/