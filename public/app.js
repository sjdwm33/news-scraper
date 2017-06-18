// Grab the articles as a json
$(document).on("click", "#scraper", function(){
  $.getJSON("/scrape", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      $("#articles").append(
        "<div  class='panel panel-default'> <div class='panel-heading'>" + data[i].title + "" + "<button data-id='" + data[i]._id + "'class='btn btn-success' id='save'>Save Article</button> </div><div class='panel-body'>" + data[i].link + "</div> </div"
        );
    }
  });
});

