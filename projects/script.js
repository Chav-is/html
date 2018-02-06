var editing = false;
var blockStatus = {};
var blockTimer = {};
var blockOrder = {};

$( document ).ready(function() {

    const projectID = window.location.pathname.substring(9,15); //window.location.pathname
    $('#titleOutlet').html('Loading Project '+projectID);

    $.getJSON( "http://test.kailerg.com/projects/exampleProject.json", function( data ) {
        pageSave = data;
        $('#titleOutlet').html(data.title);
        $('#taglineOutlet').html(data.tagline);
        $('#headimage').removeAttr("style");
        $('#headimage').css("background-image", "url("+data.image+")");
        listPages(data.pages);
        listAuthors(data.authors);
        displayProject(data.pages[0]);
    });


    $('#newBlock').click(function(){
        alert("New block");
    });

    

}); // End of document.ready





// Functin that runs every half second to control state
window.setInterval(function(){
    
    for (key in blockTimer) {
        if (blockTimer[key] > 0) {
            blockTimer[key] -= 1;
        } else {
            if (blockStatus[key] == "edited") {
                saveBlock(key);
            }
        }
    }

}, 500);


// Toggle between viewing and editing
function toggleEdit() {
    if (editing) {
        editing = false;
        document.getElementById("editButton").textContent="Enable Editing";
        $('.content').each(function() {
            $(this).attr('readonly','readonly');
            $(this).attr('editable','false');
        });
        $('.editor').each(function() {
            $(this).attr('hidden','true;');
        });
        $('.typeInfo').each(function() {
            $(this).attr('hidden','true;');
        });
        $('#newBlock').attr('hidden','true;');

    } else {
        editing = true;
        document.getElementById("editButton").textContent="Save and Finish Editing";
        $('.content').each(function() {
            $(this).removeAttr('readonly');
            $(this).attr('editable','true');
        });
        $('.editor').each(function() {
            $(this).removeAttr('hidden');
        });
        $('.typeInfo').each(function() {
            $(this).removeAttr('hidden');
        });
        $('#newBlock').removeAttr('hidden');

        $('.moveUp').click(function(){
            var clickedKey = $(this).attr("bid");
            if (blockOrder[clickedKey] > 1) {
                for (key in blockOrder) {
                    if (blockOrder[key] == blockOrder[clickedKey] - 1) {
                        var oldOrder = blockOrder[clickedKey];
                        blockOrder[clickedKey] = blockOrder[key];
                        $('#'+clickedKey).attr('style','order:'+blockOrder[key]);
                        blockOrder[key] = oldOrder;
                        $('#'+key).attr('style','order:'+oldOrder);
                        break;
                    }
                }
            } else {
                $(this).fadeOut(100).fadeIn(100);
            }
            var clickedOrder = blockOrder[clickedKey];
        });

        $('.moveDown').click(function(){
            var clickedKey = $(this).attr("bid");
            if (blockOrder[clickedKey] < Object.keys(blockOrder).length) {
                for (key in blockOrder) {
                    if (blockOrder[key] == blockOrder[clickedKey] + 1) {
                        var oldOrder = blockOrder[clickedKey];
                        blockOrder[clickedKey] = blockOrder[key];
                        $('#'+clickedKey).attr('style','order:'+blockOrder[key]);
                        blockOrder[key] = oldOrder;
                        $('#'+key).attr('style','order:'+oldOrder);
                        break;
                    }
                }
            } else {
                $(this).fadeOut(100).fadeIn(100);
            }
            var clickedOrder = blockOrder[clickedKey];
        });


    }
}


function listAuthors(data) {

    $('#authorOutlet').empty();
    $('#authorOutlet').append("Created by ");
    if (data.length > 1) {
        for (author in data) {
            var $author = $("<a>", {text: data[author].name, class:"pageButton", href: "/students/"+data[author].uid});
        }
        $('#authorOutlet').append($author);
        $('#authorOutlet').append(", and");
    } else {
        var $author = $("<a>", {text: data[0].name, class:"pageButton", href: "/students/"+data[0].uid});
        $('#authorOutlet').append($author);
    }

}

function listPages(data) {
    var first = true;
    $('#pages').empty();
    for (page in data) {
        if (first) {
            var $block = $("<div>", {text: data[page].name, class:"pageButton", id:"selectedPage", pageID: page});
        } else {
            var $block = $("<div>", {text: data[page].name, class:"pageButton", pageID: page});
        }
        $('#pages').append($block);
        first = false;
    }
    $('.pageButton').click(function(){
        $('#selectedPage').removeAttr("id");
        $(this).attr("id","selectedPage");
        displayProject(pageSave.pages[$(this).attr("pageID")]);
    });
}

function displayProject(data) {
    blockStatus = {};
    blockTimer = {};
    blockOrder = {};
    $('#project').empty();
    for (block in data.blocks) {
        if (data.blocks[block].type == "image") {
            var $block = $("<div>", {style: "background-image: url("+data.blocks[block].content+"); order:"+data.blocks[block].order, class:"block "+data.blocks[block].type, id:data.blocks[block].bid});
            $('#project').append($block);
        } else {
            var $block = $("<div>", {text: "", class:"block "+data.blocks[block].type, id: data.blocks[block].bid, style: "order:"+data.blocks[block].order});
            var $content = $("<textarea>", {text: data.blocks[block].content, id: "text"+data.blocks[block].bid, class:"content "+data.blocks[block].type, readonly:"readonly", oninput:"resizeArea(this);textChanged(this);", onresize:"resizeArea(this);"});
            var $moveUp = $("<div>", {text: "move up", class:"moveUp editorButton", bid:data.blocks[block].bid});
            var $moveDown = $("<div>", {text: "move down", class:"moveDown editorButton", bid:data.blocks[block].bid});
            var $delete = $("<div>", {text: "delete", class:"delete editorButton", bid:data.blocks[block].bid});
            var $editor = $("<div>", {text: "", class:"editor saved", hidden:"hidden"});
            var $info = $("<div>", {text: data.blocks[block].type, class:"typeInfo", hidden:"hidden"});
            $editor.append($moveUp);
            $editor.append($moveDown);
            $editor.append($delete);
            $block.append($editor);
            $block.append($content);
            $block.append($info);
            $('#project').append($block);
        }
        blockStatus[data.blocks[block].bid] = "saved";
        blockTimer[data.blocks[block].bid] = 0;
        blockOrder[data.blocks[block].bid] = data.blocks[block].order;
    }

    for (let index = 0; index < $('.content').length; index++) {
        resizeArea($('.content')[index]);
    }
    for (element in $('.content')) {
        resizeArea(element);
    }

    if (editing) {
        alert ("Should start editing");
        editing = false;
        toggleEdit();
    } else {
        alert("You were not editing");
    }



} // End of displayProject()


function resizeArea(item) {
    console.log("resizing "+item.id);
    item.style.height = 0;
    item.style.height = (item.scrollHeight+4) + 'px';
    document.getElementById(item.id.substring(4,12)).height = item.style.height;
}

function textChanged(item) {
    var blockid = item.id.substring(4,12)
    blockStatus[blockid] = "edited"
    blockTimer[blockid] = 8;
    $('#'+blockid+" .editor").removeClass("saved saving").addClass( "edited" );

}


function saveBlock(key) {
    $('#'+key+" .editor").removeClass("saved edited").addClass( "saving" );
    blockStatus[key] = "saving";
    setTimeout(function afterTwoSeconds() {
        if (blockStatus[key] = "saving") {
            $('#'+key+" .editor").removeClass("saving edited").addClass( "saved" );
            blockStatus[key] = "saved";
        }
      }, 1400)
}

function documentScroll() {
    var scroll = document.body.scrollTop;

    
}