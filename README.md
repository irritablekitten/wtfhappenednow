The purpose of this program is to use the newsapi.org source API to grab and use each source ID to fetch top articles through the same API. Once the top articles are obtained a Damerau-Levenshtein (https://www.npmjs.com/package/damerau-levenshtein) algorithm is used to find similar article titles, where titles are recorded with similarity rating of .40 or higher and those article titles are split into single words to be counted and filtered for most common news topics.

To use this yourself in Node, you will need an newspi.org api key of your own as an environment variable (set up through keys/prod.js and a host like Heroku or AWS) or a keys/dev.js key file for local hosting with this structure:

    module.exports = {
        key: "paste-news-dot-org-key-here"
    };

And a Firebase DB connected with credentials (following the directions at https://firebase.google.com/docs/admin/setup) and changing the initialization in the code:

    const serviceAccount = require("./keys/your-firebase-db-credentials.json");

    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://some-server.firebaseio.com"
    });
    var db = admin.database();
    var ref = db.ref("somecollection/yourdocument");

Or comment out the DB push function to simply use the data locally.

Alternatively, the same initial data can be counted with no filter by skipping the Damerau-Levenshtein function for broader results.