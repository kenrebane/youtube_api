$(document).ready(function() {


  //Searchbar handler
  var field = $("#query"),
      btn = $("#searchBtn"),
      speed = 500;


  //Focus handler
  $(field).on("focus", function() {
    $(this).animate({
      width: "100%"
    }, speed);
    $(btn).animate({
      right: "1vw"
    }, speed);
  });

  //Blur event handler
  $(field).on("blur", function() {
    if ( field.val() === "" ) {
      $(field).animate({
        width: "45%"
      }, speed, function() {});
      $(btn).animate({
        right: "35vw"
      }, speed, function() {});
    }
  });

  //Prevent the form from submitting
  $("#search_form").submit(function(e) {
    e.preventDefault();
  });

  //$(".button-container").style.justifyContent = "center";
});

//////////////////////////Helper functions
function search() {
  //Clear results
  $("#results").html("");
  $("#buttons").html("");

  //Get form input
  var q = $("#query").val();

  //Run GET request on API
  $.get(
    "https://www.googleapis.com/youtube/v3/search", {
      part: "snippet, id",
      q: q,
      type: "video",
      key: "AIzaSyAwGdcl9VnjOoORzEfF8ZfeArlLPXbbl2Y"},
      function(data) {

        var nextPageToken = data.nextPageToken,
            prevPageToken = data.prevPageToken;

        $.each(data.items, function(i, item) {
          //Get output
          var output = getOutput(item);

          //Display results
          $("#results").append(output);

        });

        var buttons = getButtons(prevPageToken, nextPageToken, q);

        //Display button
        $("#buttons").append(buttons);
      }
  );

}

function nextPage() {

  var token = $("#next-button").data("token"),
      query = $("#next-button").data("query");

  //Clear results
  $("#results").html("");
  $("#buttons").html("");

  //Get form input
  var q = $("#query").val();

  //Run GET request on API
  $.get(
    "https://www.googleapis.com/youtube/v3/search", {
      part: "snippet, id",
      q: q,
      pageToken: token,
      type: "video",
      key: "AIzaSyAwGdcl9VnjOoORzEfF8ZfeArlLPXbbl2Y"},
      function(data) {
        
        var nextPageToken = data.nextPageToken,
            prevPageToken = data.prevPageToken;

        $.each(data.items, function(i, item) {
          //Get output
          var output = getOutput(item);

          //Display results
          $("#results").append(output);

        });

        var buttons = getButtons(prevPageToken, nextPageToken, q);

        //Display button
        $("#buttons").append(buttons);
      }
  );
}

function prevPage() {

    var token = $("#prev-button").data("token"),
        query = $("#prev-button").data("query");

    //Clear results
    $("#results").html("");
    $("#buttons").html("");

    //Get form input
    var q = $("#query").val();

    //Run GET request on API
    $.get(
      "https://www.googleapis.com/youtube/v3/search", {
        part: "snippet, id",
        q: q,
        pageToken: token,
        type: "video",
        key: "AIzaSyAwGdcl9VnjOoORzEfF8ZfeArlLPXbbl2Y"},
        function(data) {

          var nextPageToken = data.nextPageToken,
              prevPageToken = data.prevPageToken;

          $.each(data.items, function(i, item) {
            //Get output
            var output = getOutput(item);

            //Display results
            $("#results").append(output);

          });

          var buttons = getButtons(prevPageToken, nextPageToken, q);

          //Display button
          $("#buttons").append(buttons);
        }
    );
}
function getOutput(item) {
  var id = item.id.videoId,
      title = item.snippet.title,
      description = item.snippet.description,
      thumb = item.snippet.thumbnails.medium.url,
      channelTitle = item.snippet.channelTitle,
      date = item.snippet.publishedAt;

      //Output string

      var output = "<li>" +
                     "<div class='list-left'>" +
                       "<img src=" + thumb + ">" +
                     "</div>" +
                     "<div class='list-right'>" +
                       "<h3><a data-fancybox href='https://www.youtube.com/embed/"+id+"'>"+title+"</a></h3>" +
                       "<small>By <span class='cTitle'>"+channelTitle+"</span> on " +date+ "</small>" +
                       "<p>" + description + "</p>" +
                     "</div>" +
                   "</li>" +
                   "<div class='clearfix'></div>";


      return output;

}

function getButtons(prevPageToken, nextPageToken, q) {
  if ( !prevPageToken ) {
    var btnOutput = "<div class='button-container'>" +
                      "<button id='next-button' class='paging-button' " +
                        "data-token='"+nextPageToken+"' "+
                        "data-query='"+q+"'" +
                        "onclick='nextPage();'>Next page</button></div> " ;
  } else {
    var btnOutput = "<div class='button-container'>" +
                      "<button id='prev-button' class='paging-button' " +
                        "data-token='"+prevPageToken+"' "+
                        "data-query='"+q+"'" +
                        "onclick='prevPage();'>Prev page</button>" +
                      "<button id='next-button' class='paging-button' " +
                        "data-token='"+nextPageToken+"' "+
                        "data-query='"+q+"'" +
                        "onclick='nextPage();'>Next page</button></div> " ;
  }

  return btnOutput;
}
