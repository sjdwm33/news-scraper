// Dependencies:
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var exphbs = require('express-handlebars');
// Initialize express
var app = express();
// Snatches HTML from URLs
var request = require('request');
// Scrapes our HTML
var cheerio = require('cheerio');
var Article = require("./models/article.js");
var Note = require("./models/note.js");
// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
    type: "application/vnd.api+json"
}));
// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));
// Set the engine up for handlebars
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(express.static(__dirname + '/public'));


mongoose.connect("mongodb://localhost/newsscraper");
mongoose.Promise = Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('MONGOOSE is working');
    // we're connected!
});
// Make a request call to grab the HTML body from the site of your choice
// First, tell the console what server.js is doing

app.get("/", function(req, res) {
    Article.find().sort({
        _id: -1
    }).then(function(result) {
        // define two categories of burgers
        var articles = result;
        console.log("Articles: " + articles);
        return res.render("index", {
            articles: articles
        });
    });
});
// route to all saved articles
app.get('/saved', function(_request, response) {
    Article.find({saved: 1})
        .populate('notes')
        .exec(function(error, articles) {
            if (error) {
                response.send(error);
            } else {
                var newArticlesArray = articles.map(function(article) {
                return article;

                });
                response.render('saved', {
                    articlesSaved: newArticlesArray
                });
            }
        });
});
// route for deleting notes from saved articles
app.delete('/saved/notes/:id', function(req, res) {
        var noteId = req.params.id;
        Note.remove({ _id: noteId }, function(error, _note) {
            if (error) {
                res.send(error);
            } else {
                res.redirect('/saved');
            }
        });
    });
// Api route to see all notes in JSON format
app.get("/api/notes", function(req, res) {
    Note.find(function(err, notes) {
        if (err) return console.error(err);
        res.json(notes);
    });
});
// route to delete an article from the 'saved' page
app.put("/saved/delete/:id", function(req, res) {
    var articleDelete = req.params.id;
    console.log("articleDelete: " + articleDelete);
    Article.findByIdAndUpdate(articleDelete, {
        $set: {
            saved: 0
        }
    }).then(function(result) {
        res.redirect('/saved');
    });
});
// route to save an article
app.put('/:id', function(req, res) {
    var selectArticleId = req.params.id;
    console.log("selectArticleId: " + selectArticleId);
    Article.findByIdAndUpdate(selectArticleId, {
        $set: {
            saved: 1
        }
    }).then(function(result) {
        res.redirect('/');
    });
});
// Create a new note
app.post("/saved/notes/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    var newNote = new Note(req.body);
    console.log("NEWNOTE:" + newNote);
    var selectArticleId = req.params.id;
    console.log("selectArticleId:" + selectArticleId);
    // And save the new note the db
    newNote.save(function(error, doc) {
        // Log any errors
        if (error) {
            console.log(error);
        }
        // Otherwise...
        else {
            // Use the article id to find and update it's note
            console.log("doc._id:" + doc._id);
            Article.findOneAndUpdate({
                "_id": selectArticleId
            }, {
                $push: {
                    "notes": doc._id
                }
            }, {
                new: true
            }, function(err, newdoc) {
                // Send any errors to the browser
                if (err) {
                    res.send(err);
                }
                // Or send the newdoc to the browser
                else {
                    res.redirect("/saved");
                }
            });
        }
    });
});
// Api route to all articles in JSON format
app.get("/all", function(req, res) {
    Article.find(function(err, businesses) {
        if (err) return console.error(err);
        res.json(businesses);
    });
});
// route to scrape and post all articles
app.get("/scrape", function(req, res) {
    request("http://www.nytimes.com/", function(error, response, html) {

        var $ = cheerio.load(html);
        $("h2.story-heading").each(function(i, element) {

            var title = $(this).text();
            var link = $(element).children().attr("href");
            // console.log(result);
            // If this title element had both a title and a link
            if (title && link) {
                // Save the data in the db
                var entry = new Article({
                    title: title,
                    link: link
                });
                entry.save(function(err, doc) {
                    if (err) {
                        console.log("This is the err: " + err);
                    } else { 
                        console.log('scrape successful');
                    }
                });
            }
        });
    });
    // refresh/pull data on DOM
    res.redirect('/');
});
// Listen on port 3000 or process.env.PORT
app.listen(3000, function() {
  console.log("App running on port 3000!");
});