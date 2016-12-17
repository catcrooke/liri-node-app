// set a variable equal to the code needed to grab data from keys.js file:
var keysFile = require('./keys.js');
// set  variables equal to the node package managers needed for the project:
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
// // The querystring module provides utilities for parsing and formatting URL query strings.: 
var querystring = require('querystring');

// // Takes in all of the command line arguments
var input = process.argv;

// Parses the command line argument to capture the "action" 
var action = input[2];

// create an object to hold all of the command line actions, each of which has its own function that 
// contains the code needed to execute it
var obj = {
    // this action loads the last 20 tweets when run from the command line
    'my-tweets': function() {
        // code from the twitter npm page required for user based authentication. To access each of the properties 
        // of the exports.twitterkeys object, use this format:
        var client = new Twitter({
            consumer_key: keysFile.twitterKeys.consumer_key,
            consumer_secret: keysFile.twitterKeys.consumer_secret,
            access_token_key: keysFile.twitterKeys.access_token_key,
            access_token_secret: keysFile.twitterKeys.access_token_secret
        });

        // from the base code given on the npm page, setting screen_name to my personal twitter handle and 
        // giving a count of 20 tweets to be loaded
        var params = { catcrooke: 'nodejs', count: 20 };
        // what should be loaded from twitter from the my-tweets action and 
        client.get('statuses/user_timeline', params,
            // the callback function with the arguments error, tweets, and response
            function(error, tweets, response) {
                // if there is no error, run this for-loop and console these values from the tweets. Add a blank console.log 
                // with '' so that a space can be made between each of the returned tweets for formatting purposes
                if (!error) {
                    for (var i = 0; i < tweets.length; i++) {
                        console.log(tweets[i].created_at);
                        console.log(tweets[i].text);
                        console.log('');
                    }
                    // otherwise if tweets don't load, log the error
                } else {
                    console.log(error);
                }
            });
    },
    // this action returns specified properties of a song when an argument is passed into its function.
    'spotify-this-song': function(argument) {
        // from spotify, search using the following parameters: type and query. Set the query key equal to 
        // argument, so that a track's information can be loaded with the spotify-this-song action
        spotify.search({
            type: 'track',
            // the query's value is argument. 
            // If no song/argument is given, the default song that is loaded is The Sign by Ace of Base. 
            query: argument || 'the sign by ace of base'
                // the callback function with the arguments error and data
        }, function(error, data) {
            // set the variable items equal to the properties that need to be accessed from the spotify data object
            var items = data.tracks.items;
            // create a for loop to access the following information for each track that can be obtained from the user's query
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var artists = item.artists;
                var preview = item.preview_url;
                var songName = item.name;
                var album = item.album.name;
                // create a variable artistNames and set it equal to an empty array
                var artistNames = [];
                // create a second for loop to access the name for each track's artist
                for (var j = 0; j < artists.length; j++) {
                    var artist = artists[j];
                    var artistName = artist.name;
                    // push the artistName onto the artistNames array
                    artistNames.push(artistName);
                }
                // join names for artists in the array and separate them with a comma and a space
                artistNames = artistNames.join(", ");
                // log the names of the artist, a preview of the song, and the album name and join them together
                // on separate lines, and then add an extra line after that one track's information for formatting purposes
                console.log([artistNames, preview, songName, album].join('\n') + '\n');
            }
        });
    },
    // this action returns specified properties of a movie when an argument is passed into its function
    'movie-this': function(argument) {
        // The querystring.stringify() method produces a URL query string from a given obj by iterating 
        // through the object's "own properties". Set the variable query equal to this method, and have it return
        // the values title, year, plot, data type, and rotten tomatoes information
        var query = querystring.stringify({
            t: argument || 'Mr. Nobody',
            y: '',
            plot: '',
            r: JSON,
            tomatoes: true
        });
        // use request to query the omdbapi URL using the string created with the method above and stored in the query variable
        request("http://www.omdbapi.com/?" + query,
            // callback function with the arguments error, response, and body
            function(error, response, body) {
                // If the request is successful (i.e. if the response status code is 200)
                if (!error && response.statusCode === 200) {
                    // Setting a variable movie equal to the JSON.parse() method which parses a JSON string, 
                    // constructing the JavaScript value or object described by the string.
                    var movie = JSON.parse(body);
                    // access each of these properties from that object constructed from the method above
                    var Title = movie.Title;
                    var Year = movie.Year;
                    var omdbRating = movie.imdbRating;
                    var Country = movie.Country;
                    var Language = movie.Language;
                    var Plot = movie.Plot;
                    var Actors = movie.Actors;
                    var TomatoRating = movie.tomatoRating;
                    var TomatoURL = movie.tomatoURL;
                    // print the values obtained from the properties in an object so that they display 
                    // in the console in an easy to read format
                    console.log({
                        Title: Title,
                        Year: Year,
                        omdbRating: omdbRating,
                        Country: Country,
                        Language: Language,
                        Plot: Plot,
                        Actors: Actors,
                        TomatoRating: TomatoRating,
                        TomatoURL: TomatoURL
                    });
                }
            });
    },
    // This action takes the text inside of random.txt and then uses it to call one of LIRI's commands
    'do-what-it-says': function() {
        //use FS to read the random.txt file 
        fs.readFile("random.txt", 'utf8',
            //the callback functon with the arguments of error and text
            function(error, text) {
                //if there is an error, log the error and use return to stop any subequent action from occurring
                if (error) {
                    console.log(error);
                    return;
                }
                // set a variable equal to the split method to separate the text with commas
                var split = text.split(",");
                // set the variable action equal to split at the first index 
                var action = split[0];
                // set the variable modifier equal to split at the second index
                var modifier = split[1];
                // log both of these variables 
                console.log(action);
                console.log(modifier);
                // and call the function to run it
                obj[action](modifier);
            });
    }
};
// set the variable modifier to process.argv[3] 
var modifier = process.argv[3];
// call the function which will allow any of the actions in the above object to run when entered into the command line
obj[action](modifier);
