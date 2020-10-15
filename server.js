// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

var Twit = require("twit");
var T = new Twit({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET_KEY,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000 // optional HTTP request timeout to apply to all requests.
  // strictSSL: true,     // optional - requires SSL certificates to be valid.
});

var stream = T.stream("statuses/filter", { track: "100DaysOfCode" });
stream.on("tweet", function(tweet) {
  const tweetId = tweet.id_str;
  // console.log(tweet);
  if (tweet && !tweet.possibly_sensitive) {
    // T.post("statuses/retweet", { id: tweetId }, function(err, data, response) {
    //   if (err) {
    //   } else {
    //     console.log("retweeted with id", tweetId);
    //   }
    // });
    
    // setTimeout()
    T.post("favorites/create", { id: tweetId }, function(err, data, response) {
      if (err) {
        // console.log(err);
      } else {
        console.log("liked tweet", tweetId);
      }
    });
  }
});

var userStream = T.stream("statuses/filter", {
  follow: ["3105443823", "1264220152997920768"]
});
userStream.on("tweet", tweet => {
  console.log("got a tweet", tweet);
  const tweetId = tweet.id_str;
  T.post("statuses/retweet", { id: tweetId }, function(err, data, response) {
    if (err) {
      // console.log(err);
    } else {
      console.log("retweeted with id", tweetId);
    }
  });
  T.post("favorites/create", { id: tweetId }, function(err, data, response) {
    if (err) {
      // console.log(err);
    } else {
      console.log("liked tweet", tweetId);
    }
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
