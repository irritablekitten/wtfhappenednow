const getData = require('./TitleScraper.js');
const damerau = require('damerau-levenshtein');
const express = require('express');
const app = express();

let filters = ['to', 'for', 'the', 'in', 'a', 'and', 'to', 'of', 'but', 'from', 'at', 'when', ',', '', '|', 'is', 'are', 'an', 'will', 'be', '-', '\\', 'by', 'on'];
let compareArray = [];
let splitArray = [];
let sortable = [];

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
    let titleArrayCopy = getData.titleArray;
    titleArrayCopy.map(function (obj) {
        let test = damerau(obj.title, i.title);

        let comparison = {
            score: test.similarity,
            first: obj.title,
            second: i.title
        };
        
        if (comparison.score > 0.4 && comparison.score < 1 && comparison.first !== '' && comparison.second !== '') {
            compareArray.push(comparison);
            console.log(comparison);
        } 
    });         
}

//provides the top level loop for finding matches in titleArray with the damerau-levenshtein algorith
const compareFunction = () => {
    let titleArrayCopy = getData.titleArray;
   titleArrayCopy.map(function (i) {
        levenshteinFunction(i);
    });
}

//takes results pushed to compareArray and splits each title into individual words to find commonality
const splitFunction = () => {
    let compareArrayCopy = compareArray;
    compareArrayCopy.map(function (obj) {
         let post = obj.first.split(' ');
        splitArray.push(post);
     });
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
    setTimeout(function(comparison) {
        compareFunction();       
        splitFunction();
        let results = arrayFixer(splitArray);
        let countArray = arrayFilter(results);     
        let counter = new Counter(countArray);
        delete counter.key;
        sortable = Array.from(counter);
        sortable.sort(function(a, b) {
            return b[1] - a[1];
        });
        console.log(sortable);   
    }, 3000);      
}

app.get('/', (req, res) => res.send(sortable))

app.listen(5000, () => console.log('Example app listening on port 3000!'))

main();

