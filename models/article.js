// Require mongoose
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true,
        validate: {
            validator: function (linkOfArticle, cb) {
                Article.find({
                    link: linkOfArticle
                }, function (err, docs) {
                    cb(docs.length === 0);
                });
            },
            message: "Article link already exists"
        }
    },
    saved: {
        type: Number,
        default: 0
    },
     notes: [{
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }]
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
