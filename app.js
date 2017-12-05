const getData = require('./TitleScraper.js');
const damerau = require('damerau-levenshtein');

let compareArray = [];
let splitArray = [];

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

const main = () => {
    setTimeout(function(comparison) {

        compareFunction();       
        splitFunction();
        //console.log(compareArray);
        //console.log(splitArray);    
    }, 5000);   

   
}

main();