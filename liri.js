// At the top of the liri.js file, write the code you need to grab the data from keys.js. 
// Then store the keys in a variable.
var keysFile = require("./keys.js");
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var inquirer = require('inquirer');
var fs = require('fs');
// Make it so liri.js can take in one of the following commands:
// * `my-tweets`

var client = new Twitter({
    consumer_key: keysFile.consumer_key,
    consumer_secret: keysFile.consumer_secret,
    access_token_key: keysFile.access_token_key,
    access_token_secret: keysFile.access_token_secret
});



var params = { catcrooke: 'nodejs', count: 20 };
client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
        console.log(tweets);
        console.log(response);
        console.log(JSON.stringify(response, null, 2));
        console.log(error);
    }
});


// * `spotify-this-song`

// * `movie-this`

// * `do-what-it-says`
