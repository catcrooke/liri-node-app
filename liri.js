// set a variable equal to the code needed to grab data from keys.js file:
var keysFile = require('./keys.js');
// set  variables equal to the node package managers needed for the project
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var querystring = require('querystring');

// // Takes in all of the command line arguments
var input = process.argv;

// Parses the command line argument to capture the "action" 
var action = input[2];

// create an object to hold all of the command line actions, each of which has its own function that 
// contains the code needed to execute it
var obj = {
    'my-tweets': function() {
        // code from the npm page required for user based authentication. To access each of the properties of the 
        // exports.twitterkeys object, this format must be used. 
        var client = new Twitter({
            consumer_key: keysFile.twitterKeys.consumer_key,
            consumer_secret: keysFile.twitterKeys.consumer_secret,
            access_token_key: keysFile.twitterKeys.access_token_key,
            access_token_secret: keysFile.twitterKeys.access_token_secret
        });

        // more code 
        var params = { catcrooke: 'nodejs', count: 20 };
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                for (var i = 0; i < tweets.length; i++) {
                    console.log(tweets[i].created_at);
                    console.log(tweets[i].text);
                    console.log('');
                }

            } else {
                console.log(error);
            }
        });
    },
    'spotify-this-song': function(argument) {
        spotify.search({
            type: 'track',
            query: argument || 'the sign by ace of base'
        }, function(error, data) {
            var items = data.tracks.items;

            for (var i = 0; i < items.length; i++) {
                // console.log(items[i]);

                var item = items[i];
                var artists = item.artists;
                var preview = item.preview_url;
                var songName = item.name;
                var album = item.album.name;

                var artistNames = [];
                for (var j = 0; j < artists.length; j++) {
                    var artist = artists[j];
                    var artistName = artist.name;
                    artistNames.push(artistName);
                }
                artistNames = artistNames.join(", ");
                console.log([artistNames, preview, songName, album].join('\n') + '\n');
            }
        });
    },
    'movie-this': function(argument) {
        var query = querystring.stringify({
            t: argument || 'Mr. Nobody',
            y: '',
            plot: '',
            r: JSON,
            tomatoes: true
        });

        request("http://www.omdbapi.com/?" + query,
            function(error, response, body) {

                // If the request is successful (i.e. if the response status code is 200)
                if (!error && response.statusCode === 200) {

                    var movie = JSON.parse(body);
                    var Title = movie.Title;
                    var Year = movie.Year;
                    var omdbRating = movie.imdbRating;
                    var Country = movie.Country;
                    var Language = movie.Language;
                    var Plot = movie.Plot;
                    var Actors = movie.Actors;
                    var TomatoRating = movie.tomatoRating;
                    var TomatoURL = movie.tomatoURL;

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
    'do-what-it-says': function() {
        fs.readFile("random.txt", 'utf8', function(error, text) {

            //if there is an error, log the error
            if (error) {
                console.log(error);
                return;
            }

            var split = text.split(",");
            var action = split[0];
            var modifier = split[1];
            console.log(action);
            console.log(modifier);
            obj[action](modifier);
        });
    }
};
var modifier = process.argv[3];
obj[action](modifier);
