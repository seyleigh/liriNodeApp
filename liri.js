require("dotenv").config();
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var keys = require("./keys.js");

var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var search = process.argv[2];
var term = process.argv.splice(3).join(' ');

function run (search) {
    switch (search) {
        case "concert-this":
            concertThis();
            break;

        case "spotify-this-song":
            spotifyThis();
            break;

        case "movie-this":
            movieThis();
            break;
        
        case "do-what-it-says":
            doIt();
            break;

        default:
            console.log("That is not an option :P");

    }
}


function concertThis() {
    if(!term) {
        console.log("\nI need an artist to complete the search\n");
        return;
    }
    axios.get("https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp")
    .then(function (response) {
        if (response.data[0] != undefined) {
            console.log("\n-----------------------------------------------------------\n")
            console.log(`Venue: ${response.data[0].venue.name}`);
            console.log(`City: ${response.data[0].venue.city}`);
            console.log(`Date: ${moment(response.data[0].datetime).format('MM/DD/YYYY')}`);
            console.log("\n-----------------------------------------------------------\n")
        } else {
            console.log("I didn't find anything for that :(")
        }
    })

}
function spotifyThis() {
    // var term = process.argv.splice(3).join(' ');
    if (!term) {
        term = "Everybody Wants To Be Loved";
    }
    spotify.search({
        type: 'track',
        query: term,
        limit: 1
    }, function(err,data){
        if (err) {
            return console.log(`There is an error: ${err}`);
        }
        console.log("\n-----------------------------------------------------------\n");
        console.log(`Artist: ${data.tracks.items[0].artists[0].name}`);
        console.log(`Track: ${data.tracks.items[0].name}`);
        console.log(`Preview: ${data.tracks.items[0].preview_url}`);
        console.log(`Album: ${data.tracks.items[0].album.name}`);
        console.log("\n-----------------------------------------------------------\n");
    });
}

function movieThis() {
    if (!term) {
        term = "Mr. Nobody";
    }
    axios.get("http://www.omdbapi.com/?t=" + term + "&y=&plot=short&apikey=trilogy")
    .then(function (response) {
        console.log("\n-----------------------------------------------------------\n");
        console.log(`Title: ${response.data.Title}`);
        console.log(`Year: ${response.data.Year}`);
        console.log(`IMDB Rating: ${response.data.imdbRating}`);
        console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`);
        console.log(`Country: ${response.data.Country}`);
        console.log(`Language: ${response.data.Language}`);
        console.log(`Plot: ${response.data.Plot}`);
        console.log(`Actors: ${response.data.Actors}`);
        console.log("\n-----------------------------------------------------------\n");
    })
}

function doIt() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error)
         } 
        //  console.log(data);
         var dataArr = data.split(",");
        //  console.log(dataArr);
         search = dataArr[0];
         term = dataArr[1];
         run(search, term);
    });
}

run (search);