const isomorphicFetch = require('isomorphic-fetch');
const keys = require('./keys.js');
let sourceArray = [];
let titleArray = [];

//gets all news sources by id
let scrape = async () => {
    const res = await fetch(
      `https://newsapi.org/v1/sources?language=en`);
    return await res.json();
  }

//obtains top articles per source id
let addTitles = async (obj) => {
    const token = keys.key;
    let resTwo = await fetch(
        `https://newsapi.org/v2/top-headlines?sources=${obj}&apiKey=${token}`)
    return await resTwo.json(); 
}

const main = () => {
    scrape().then((res) =>  {
        res.sources.map(function (obj) {
            sourceArray.push(obj);    
        });  
        sourceArray.map(function (obj) {
            addTitles(obj.id).then((resTwo) => {   
                resTwo.articles.map(function (objTwo) {
                    let article = {
                        id: obj.id,
                        title: objTwo.title,
                        url: objTwo.url
                    };
                    titleArray.push(article);
                }); 
            });  
        });
    });
}

module.exports.data = main();
module.exports.titleArray = titleArray;