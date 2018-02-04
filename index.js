const damerau = require('damerau-levenshtein');
const isomorphicFetch = require('isomorphic-fetch');
const express = require('express');
const keys = require('./keys/keys.js');
const cors = require('cors');
const schedule = require('node-schedule');
const app = express();
const filters = ['to', 'for', 'the', 'in', 'a', 'and', 'to', 'of', 'but', 'from', 'at', 'when', ',', '', '|', 'is', 'are', 'an', 'will', 'be', '-', '\\', 'by', 'on', 'as'];
let sourceArray = [];
let titleArray = [];
let compareArray = [];
let sortable = [];
let countSources = [];

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

const TitleScraper = () => {
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
                    if (article != undefined) {
                        titleArray.push(article);
                    }
                }); 
            }).catch(err => console.error(err)) 
        });
    }).catch(err => console.error(err))
}

//https://stackoverflow.com/questions/17313268/idiomatically-find-the-number-of-occurrences-a-given-value-has-in-an-array
class Counter extends Map {
    constructor(iter, key=null) {
        super();
        this.key = key || (x => x);
        for (let x of iter) {
            this.add(x);
        }
    }
    add(x) {
      x = this.key(x);
      this.set(x, (this.get(x) || 0) + 1);
    }
  }


//finds matches between titles by comparing one title in titleArray from the compareFunction loop to every title within the same array, while logging high-scoring results and ignoring exact matches
const levenshteinFunction = (i) => {
    let titleArrayCopy = titleArray;
    titleArrayCopy.map(function (obj) {
        let test = damerau(obj.title, i.title);

        let comparison = {
            score: test.similarity,
            first: obj.title,
            second: i.title,
            source: i.id
        };
        
        if (comparison.score > 0.4 && comparison.score < 1 && comparison.first !== '' && comparison.second !== '') {
            compareArray.push(comparison);
        } 
    });       
}

//provides the top level loop for finding matches in titleArray with the damerau-levenshtein algorith
const compareFunction = () => {
    let titleArrayCopy = titleArray;
   titleArrayCopy.map(function (i) {
        levenshteinFunction(i);
    });
}

//takes results pushed to compareArray and splits each title into individual words to find commonality
const splitFunction = (splitThis) => {
    let copy = splitThis;
    let newArray = []
    copy.map(function (obj) {
        let post = obj.first.split(' ');
        newArray.push(post);
        countSources.push(obj.source);
     });
     return newArray;
}

//returns a new array with old arrays split apart
const arrayFixer = (array) => {
    let newArray = [];
    for (var i in array) {
        for (var j in array[i]) {
            if (array[i][j] == undefined) {
                console.log('here is one ' + array[i][j]);
            }
            else {
                newArray.push(array[i][j].toString().toLowerCase());    
            }                    
        }        
    }
    return newArray;
}

//for filtering out common words being counted
const arrayFilter = (results) => {
    results = results.filter(item => !filters.includes(item))
    return results; 
}

const main = () => {
    let runScrape = schedule.scheduleJob('55 * * * *', function(){
        TitleScraper();
      });
    
      let everythingElse = schedule.scheduleJob('58 * * * *', function(){
        compareFunction();
            let splitArray = splitFunction(compareArray);
            let results = arrayFixer(splitArray);
            let countArray = arrayFilter(results);     
            let counter = new Counter(countArray);
            delete counter.key;
            sortable = Array.from(counter);
            sortable.sort(function(a, b) {
                return b[1] - a[1];
            });
            console.log(sortable);
            
            let printSources = new Counter(countSources);
            delete printSources.key;
            let sortSources = Array.from(printSources);
            sortSources.sort(function(a, b) {
                return b[1] - a[1];
            });
            console.log(sortSources);
      });
}

app.use(cors());

//app.get('/req/wordcount', (req, res) => res.send(JSON.stringify(sortable)));

app.get('/wordcount', function (req, res, next) {
    res.send(JSON.stringify(sortable));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);

main();