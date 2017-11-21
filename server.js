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
            createArticle(article);
        }
        res.send("Scrape Complete");
    });
});

function createArticle(article) {
    axios.get(article.link).then(function(response) {
        var $ = cheerio.load(response.data);
        $("article #entryContent").each(function(i, element) {
            article.paragraph = $(this).children("p:first-child").text() || "Summary not available for this article.";
            article.saveArticle = false;
            db.Article
                .create(article).then(function(dbArticle) {})
                .catch(function(err) {
                    console.log(article);
                    res.json(err);
                });
        });
    });
}

app.get("/articles", function(req, res) {
   db.Article.find({}).sort({"_id": -1}).limit(10)
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/savedarticles", function(req, res) {
    db.Article.find({ saveArticle: true })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/addnote/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/savearticle/:id", function(req, res) {
  db.Article.findOneAndUpdate({_id: req.params.id }, { saveArticle: true })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/deletearticle/:id", function(req, res) {
  db.Article.findOneAndUpdate({_id: req.params.id }, { saveArticle: false })
    .then(function(dbArticle) {
      res.json("Article Deleted");
    })
    .catch(function(err) {
      res.json(err);
    });
});


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});