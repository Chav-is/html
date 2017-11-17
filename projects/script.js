var pageData = null

$(document).ready(function () {

  $.get( "retrieveProject.php", { pid: getParameterByName('pid') } ).done(function( response ) {
      pageData = JSON.parse(response);
      initPage(pageData);
      loadPage(pageData,Object.keys(pageData["pages"])[0]);
  });


  // Initialize editor
  $('.block').click(function(e){
    $(e.target).prepend("<a>Saving changes...</a>");
  });


  // Decode page that was clicked
  $(document).on('click', "a.pageTitle", function(e) {
    loadPage(pageData,$(e.target).text());
    $("#viewing").attr('id', "");
    $(e.target).attr('id', "viewing");
  });


  // Start editing
  $('#edit').click(function(e){
    $('#project .block').each(function() {
      $(this).attr('contenteditable', 'true');
    });
  });



});


// Write in titles and authors
function initPage(data) {
  // Write the title in the title area
  $( "#titleOutlet" ).text(data["title"]);

  // Diplsy head image
  $("#headImage").css("background-image", "url('" + data["headimage"] + "')");

  // List the authors in the title area
  for (var key in data["authors"]) {
    if (key == data["authors"].length - 1 && data["authors"].length > 1) {
      $('#authorOutlet').append(", and ");
    }
    var $author = $("<a>", {text: data["authors"][key]["name"], href:"/students?uid="+data["authors"][key]["uid"]});
    $('#authorOutlet').append($author);
    if (key < data["authors"].length - 2) {
      $('#authorOutlet').append(", ");
    }

  }

  // List the pages in the pages tab
  for (var key in Object.keys(data["pages"])) {
    if (key == 0) {
      var $pageTitle = $("<a>", {text: Object.keys(data["pages"])[key],id:"viewing",class:"pageTitle"});
    } else {
      var $pageTitle = $("<a>", {text: Object.keys(data["pages"])[key],class:"pageTitle"});
    }
    $('#pageOutlet').append($pageTitle);

  }
}


// Load a specefic page
function loadPage(data, page) {
  // Clear page
  $('#project').empty()
  // Iterate trhough every block in the specefied page
  for (var key in data["pages"][page]) {

    if (data["pages"][page][key]["type"]=="paragraph") {
        var $block = $("<p>", {text: data["pages"][page][key]["content"],class:"block"});
        $('#project').append($block);
    } else if (data["pages"]["About"][key]["type"]=="title") {
        var $block = $("<h1>", {text: data["pages"][page][key]["content"],class:"block"});
        $('#project').append($block);
    } else if (data["pages"]["About"][key]["type"]=="image") {
      var $block = $("<img>", {src: data["pages"][page][key]["content"],class:"block image"});
      $('#project').append($block);
    } else if (data["pages"]["About"][key]["type"]=="link") {
      var $block = $("<a>", {text: data["pages"][page][key]["content"],href: data["pages"][page][key]["link"],class:"block",target:"_blank"});
      $('#project').append($block);
    }

  }
}


// Get parameters from URL
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
