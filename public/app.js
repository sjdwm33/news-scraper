// Grab the articles as a json
$(document).on("click", "#scraper", function(){
  $.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append(
        "<div data-id='" + data[i]._id + "' class='panel panel-default'> <div class='panel-heading'>" + data[i].title + "    " + "<button class='btn btn-success' id='saveArticle'>Save Article</button> </div><div class='panel-body'>" + data[i].link + "</div>"
        );
    }
  });
});

// //Save an article
// $(document).on("click", "#saveArticle", function() {
//   // Grab the id associated with the article from the submit button
//   var thisId = $(this).attr("data-id");

//   // Run a POST request to change the note, using what's entered in the inputs
//   $.ajax({
//     method: "POST",
//     url: "/articles/" + thisId,
//     data: {
//       // Value taken from title input
//       title: this.title,
//       // Value taken from note textarea
//       link: this.link
//     }
//   })
//     // With that done
//     .done(function(data) {
//       // Log the response
//       console.log(data);
//       $("#savedArticles").append("<h2>" + data.title + "</h2>");
//       $("#savedArticles").append("<p>" + data.link + <"</p>");
//     });

//   // Also, remove the values entered in the input and textarea for note entry
//   $("#titleinput").val("");
//   $("#bodyinput").val("");
// });

// //Click to add new note
// $(document).on("click", "#new", function() {

//   // Save the id from the p tag
//   var thisId = $(this).attr("data-id");

//   // Now make an ajax call for the Article
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId
//   })
//     // With that done, add the note information to the page
//     .done(function(data) {
//       console.log(data);
//       // The title of the article
//       $("#notes").append("<h2>" + data.title + "</h2>");
//       // A textarea to add a new note body
//       $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//       // A button to submit a new note, with the id of the article saved to it
//       $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
//     });
// });

// // When you click the savenote button
// $(document).on("click", "#saveNote", function() {
//   // Grab the id associated with the article from the submit button
//   var thisId = $(this).attr("data-id");

//   // Run a POST request to change the note, using what's entered in the inputs
//   $.ajax({
//     method: "POST",
//     url: "/articles/" + thisId,
//     data: {
//       // Value taken from note textarea
//       body: $("#bodyinput").val()
//     }
//   })
//     .done(function(data) {
//       // Log the response
//       console.log(data);
//       $("#savedNotes").append("<p>" + data.body + "</p>");
//     });

//   // Also, remove the values entered in the input and textarea for note entry
//   $("#bodyinput").val("");
// });

//   // Empty the notes from the note section
//   $(document).on("click", "#deleteNote", function(){
//   	$("#notes").empty();
//   });
//   