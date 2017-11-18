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

const main = () => {
    
results.then((res) =>  {
    res.sources.map(function (obj) {
        sourceArray.push(obj.id);        
    });  


    sourceArray.forEach(function(item, i) {
        addTitles(i).then((resTwo) => {
            if (resTwo.articles !== undefined) {
            let articleDetails = resTwo.articles[i];
            titleArray.push(item, articleDetails);
            console.log(item, articleDetails);
            }
            else {
            console.log(resTwo[i]);
            }
        });  
    });
});

    
}

main();