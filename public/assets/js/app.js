//=======================================================
// Grab the articles as a json
//=======================================================

$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append(
      "<div class='container'>" +
      "<h2 data-id='" + data[i]._id + "' data-toggle='modal' data-target='#exampleModal'>" + data[i].title + "</h2>" +
      "<p data-id='" + data[i]._id + "'>"
      + data[i].link + "<br />"
      + data[i].summary + "</p>" +
      "<button type='button' class='btn btn-danger save'data-id='" + data[i]._id + "'> "+
      "Save Article" +
      "</button>"+ "   " +
      "<button type='button' class='btn btn-primary save'data-id='" + data[i]._id + "'> "+
      "Delete Article" +
      "</button>"+
      "</div>" + "<br><br>"
    );
  }
});

//=======================================================
// Grab the saved articles as a json
//=======================================================

$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#savedArticles").append(
      "<div class='container'>" +
      "<h2 data-id='" + data[i]._id + "' data-toggle='modal' data-target='#exampleModal'>" + data[i].title + "</h2>" +
      "<p data-id='" + data[i]._id + "'>"
      + data[i].link + "<br />"
      + data[i].summary + "</p>" +
      "<button type='button' class='btn btn-primary delete'data-id='" + data[i]._id + "'> "+
      "Delete Article" +
      "</button>"+
      "</div>" + "<br><br>"
    );
  }
});

//=======================================================
//DELETE: delete an article user selected
//=======================================================
$(document).on("click", ".delete", function () {
  // Save the id from the button
  var thisId = $(this).attr("data-id");
  // Now make an ajax call 
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      res.json(data);
    });
});

//=======================================================
//GET: read a note (if any) on an article user selected
//=======================================================

// Whenever someone clicks a h2 tag
$(document).on("click", "h2", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button type='button' class='btn btn-secondary' data-dismiss='modal' data-id='" + data._id + "' id='savenote'>Save</button>");
      // A button to close modal
      $("#notes").append("<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>");
      

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

//=======================================================
//POST: edit note on an article
//=======================================================


// When you click the savenote button
$(document).on("click", "#savenote", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // POST : change the note to user input
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// When you click the savenote button
$(document).on("click", "#close", function () {
  console.log("No Change");
});
