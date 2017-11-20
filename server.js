var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/mongoScraper", {
    useMongoClient: true
});

app.get("/scrape", function(req, res) {
    var results = [];
    axios.get("http://www.cleveland.com/").then(function(response) {
        var $ = cheerio.load(response.data);
        $(".river-item .fullheadline").each(function(i, element) {
            var result = {};
            result.link = $(this).children("a").attr("href");
            result.title = $(this).children("a").text();
            results.push(result);
        });

        for (var j = 0; j < results.length; j++) {
            var article = {
                "link": results[j].link,
                "title": results[j].title
            };
            saveArticle(article);
        }
        res.send("Scrape Complete");
    });
});

function saveArticle(article) {
    axios.get(article.link).then(function(response) {
        var $ = cheerio.load(response.data);
        $("article #entryContent").each(function(i, element) {
            article.paragraph = $(this).children("p:first-child").text() || "Summary not available for this article.";
            db.Article
                .create(article).then(function(dbArticle) {})
                .catch(function(err) {
                    console.log(article);
                    res.json(err);
                });
        });
    });
}

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});