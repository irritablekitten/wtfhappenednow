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

let addTitles = async (i) => {
    const token = keys.key;
    let resTwo = await fetch(
        `https://newsapi.org/v1/articles?source=${sourceArray[i]}&apiKey=${token}`)
    return await resTwo.json(); 
}

results.then((res) =>  {
    res.sources.map(function (obj) {
        sourceArray.push(obj.id);        
    });
    console.log(sourceArray);   


    sourceArray.forEach(function(item, i) {
        addTitles(i).then((resTwo) => {
            let articlesObj = resTwo.articles;
            titleArray.push(item, articlesObj);    
            console.log(titleArray);
        });  
    });   
});

