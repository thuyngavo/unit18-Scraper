//==================================================================
//Render articles to page
//==================================================================

//variable to indicate container for rendering articles
var articleContainer = $(".article-container");

// empty the article container
articleContainer.empty();


//function to render articles to page
$.get("/articles").then(function(data) {
  //loop through each article in database
  for (var i = 0; i < data.length; i++) {
    //if there are articles
    if (data && data.length) {
    //render then to the page
    renderArticles(data);
    // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  } else {
    //else render empty alert
    renderEmpty();
}
  }
});

//function to render articles
function renderArticles(data) {
  //variable to hold empty array
  var articlePanels = [];
  // loop through articles data and push to article panels array
  for (var i = 0; i < data.length; i++) {
      articlePanels.push(createPanel(data[i]));
  }
  // once we have all of the HTML for the articles stored in our articlePanels array, append them to the articlePanels container
  articleContainer.append(articlePanels);
}

//function to create article cards
function createPanel(data) {
  //variable to print articles in card
  var panel = 
    $(["<div class='card' style='width: 18rem;'>",
          "<div class='card-body'>",
            "<h5 class='card-title'>", data.title, "</h5>",
            "<p class='card-text'>", data.summary ,"</p>",
            "<p class='card-text'>", data.summary ,"</p>",
            "<a href='#' class='card-link'>", data.link, "</a>",
            "<a href='#' class='card-link delete btn.delete'>Delete</a>",
            "<a href='#' class='card-link readLink notes'>Notes</a>",
          "</div>",
        "</div>"   
      ].join("")
    );
  //attach the article's id
  panel.data("_id", article._id);
  //return panel element
  return panel;
}

//function to render an emtpy article container
function renderEmpty() {
  //variable to print that there are no articles
  var emptyAlert =
  $([`<div class='alert alert-warning text-center'>
        <h4>No articles saved...</h4>
      </div>
      <div class='panel panel-default'>
        <div class='panel-heading text-center'>
          <h4>Lets go back and scrape some articles.</h4>
        </div>
        <div class='panel-body text-center'>
          <h4><a href='/'>BACK</a></h4>
        </div>
      </div>`
    ].join("")
  );
  //render alert html to page
  articleContainer.append(emptyAlert);
}

//==================================================================
//click function to delete article
//==================================================================

//onclick function to delete saved article
$(document).on("click", ".btn.delete", function(){
  //variable to grab article user selects to delete
  var articleToDelete = $(this).parents(".panel").data();

  //ajax call to initiate delete from db
  $.ajax({
    method: "DELETE",
    url: "/api/title/" + articleToDelete._id
  }).then(function(data) {
    //reload page 
    if (data.ok) {
        location.reload();
    }
});
});

//==================================================================
//click functions for notes
//==================================================================

//onclick function for note button
$(document).on("click", ".btn.notes", function() {
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
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

//==================================================================
//click function to edit notes
//==================================================================

//on click
$(document).on("click", ".btn.save", function() {
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
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


//==================================================================
//click function to save notes
//==================================================================

// //on click
// $(document).on("click", ".btn.save", function() {
//   // variable s to grab user input
//   var noteData;
//   var newNote = $(".bootbox-body textarea").val().trim();

//   //if there is new input
//   if (newNote) {
//       //change current note to new input
//       noteData = {
//           _id: $(this).data("article")._id,
//           noteText: newNote
//       };

//       $.post("/api/notes", noteData).then(function() {
//           //close the modal
//           bootbox.hideAll();
//       });
//   }
// });

//==================================================================
//click function to delete notes
//==================================================================

//on click
$(document).on("click", ".btn.note-delete" , function() {

    //variable to grab id of note selected
    var noteToDelete = $(this).data("_id");

    //ajax call to delete from db
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
  }).then(function() {
      //hide the modal
      bootbox.hideAll();
  });
});











// /* global bootbox */
// $(document).ready(function() {
//   // setting class article-container div where all the content will go
//   // adding event listeners to any dynamically generated "save article" & "scrape new article" buttons
//   var articleContainer = $(".article-container");
//   $(document).on("click", ".btn.save", handleArticleSave);
//   $(document).on("click", ".scrape-new", handleArticleScrape);

//   // once the page is ready, run the initPage function to kick things off
//   initPage();
  
//   function initPage() {
//       // empty the article container, run an AJAX request for any unsaved headlines
//       articleContainer.empty();
//       $.get("/api/headlines?saved=false")
//         .then(function(data) {
//             // if we have headlines, render them to the page
//             if (data && data.length) {
//                 renderArticles(data);
//             } else {
//                 // otherwise render a message explaining we have no articles
//                 renderEmpty();
//             }
//           });
//       }

//       function renderArticles(articles) {
//           // this function handles appending html containing our article data to the page with an array of JSON with all available articles
//           var articlePanels = [];
//           // pass each article JSON object to the createPanel function which returns a bootstrap panel with article data inside
//           for (var i = 0; i < articles.length; i++) {
//               articlePanels.push(createPanel(articles[i]));
//           }
//           // once we have all of the HTML for the articles stored in our articlePanels array, append them to the articlePanels container
//           articleContainer.append(articlePanels);
//       }

//       function createPanel(article) {
//           // this function takes in a single JSON object for an article/headline
//           // it constructs a jQuery element containing all of the formatted HTML for the article panel
//           var panel =
//           $(["<div class='panel panel-default'>",
//             "<div class='panel-heading'>",
//             "<h4>",
//             article.headline,
//             "</h4>",
//             article.url,
//             "</div>",
//             "<div class='panel-body'>",
//             "<a class='readLink btn btn-secondary' href='"+article.url+"' target='_blank' rel='noopener'>Read Article",
//             "</a>",
//             "<a class='btn btn-success save'>",
//             "Save Article",
//             "</a>",
//             "</div>",
//             "</div>"
//       ].join(""));
//       // we attach the article's id to the jQuery element & will use this when trying to figure out which article the user wants to save
//     panel.data("_id", article._id);
//     // return the constructed panel jQuery element
//     return panel;
//   }
//   function renderEmpty() {
//       // this function renders some HTML to the page saying we don't have any articles to view
//       var emptyAlert =
//       $(["<div class='alert alert-warning text-center'>",
//         "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
//         "</div>",
//         "<div class='panel panel-default'>",
//         "<div class='panel-heading text-center'>",
//         "<h3>What Would You Like To Do?</h3>",
//         "</div>",
//         "<div class='panel-body text-center'>",
//         "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
//         "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
//         "</div>",
//         "</div>"
//   ].join(""));
//   // appending this data to the page
//   articleContainer.append(emptyAlert);
// }

// function handleArticleSave() {
//   // this function is triggered when the user wants to save an article
//   var articleToSave = $(this).parents(".panel").data();
//   articleToSave.saved = true;
//   // using a patch method to be semantic since this updates an existing record in our collection
//   $.ajax({
//       method: "PATCH",
//       url: "/api/headlines",
//       data: articleToSave
//   })
//   .then(function(data) {
//       // if success, mongoose will send back an object with a key of "ok" (value of 1 which equals true)
//       if (data.ok) {
//           // run the initPage function again to reload the list of articles
//           initPage();
//       }
//   });
// }

// function handleArticleScrape() {
//   // this function handles the user clicking any "scrape new article" buttons
//   $.get("/api/fetch")
//     .then(function(data) {
//         // if scrape of NYTIMES successful & compared the articles to the ones in our collection, re-render articles to the page
//         // and let the user know how many unique articles we were able to save
//         initPage();
//         bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
//     });
//   }
// });
  