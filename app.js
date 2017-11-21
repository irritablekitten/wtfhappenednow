const getData = require('./TitleScraper.js');

const main = () => {
    setTimeout(function () {
       console.log(getData.titleArray);
    }, 10000);
}

main();