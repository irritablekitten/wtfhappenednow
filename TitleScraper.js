const isomorphicFetch = require('isomorphic-fetch');
const keys = require('./keys.js');
let sourceArray = [];
let titleArray = [];


let scrape = async () => {
    const res = await fetch(
      `https://newsapi.org/v1/sources?language=en`);
    return await res.json();
  }

let results = scrape();

let addTitles = async (obj) => {
    const token = keys.key;
    let resTwo = await fetch(
        `https://newsapi.org/v2/top-headlines?sources=${obj}&apiKey=${token}`)
    return await resTwo.json(); 
}

const main = () => {
    
results.then((res) =>  {
    res.sources.map(function (obj) {
        sourceArray.push(obj);    
    });  
    sourceArray.map(function (obj) {
        addTitles(obj.id).then((resTwo) => {   
            resTwo.articles.map(function (objTwo) {
                titleArray.push(obj.id, objTwo.title);
            }); 
        });  
    });
});
}

module.exports.data = main();
module.exports.sourceArray = sourceArray;
module.exports.titleArray = titleArray;