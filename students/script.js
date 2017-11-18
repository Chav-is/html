$(document).ready(function () {


  $.get( "grabStudentName.php", { uid: getParameterByName('uid') } ).done(function( data ) {
      $('#studentName').append(data);
      console.log(data);
  });


});


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


var loggedIn = false;
var $loginToast = $('<span>Successfully Logged In!</span>').add($('<button onclick="Materialize.Toast.removeAll();" class="btn-flat toast-action">Yay!</button>'));
function logIn() {
	loggedIn = true;
	$('.editable').attr('contenteditable','true');
	Materialize.toast($loginToast, 4000)
}

function startEditing(element) {
	if (loggedIn === true) {
		$(element).addClass('editing')
	}
}

function loadProfile() {
	$.ajax({
		method: 'post',
		url: '/grabStudentName',
		data: {
			uuid: getParameterByName('id')
		},
		success: function (profile) {
			console.log(profile);
			$('#name').val('John');
			var projects = profile.projectsJSON;
			var projectAmount = projects.length;
			for(var i = 0; i < projectAmount; i++) {
				$('#project-cards').append('<div class="card horizontal hoverable">\n' +
					'            <div class="card-image center" style="padding-left: 10px; margin-top: 10px;">\n' +
					'                <img width="86" height="86" src="https://maxcdn.icons8.com/Share/icon/Logos//google_logo1600.png">\n' +
					'                <h6>Student Corner</h6>\n' +
					'            </div>\n' +
					'            <div class="card-stacked">\n' +
					'                <div class="card-content">\n' +
					'                    <p>This is an short, but helpful project description. </p>\n' +
					'                    <a href="#" style="margin-top: 40px;" class="btn red waves-effect">Go</a>\n' +
					'                </div>\n' +
					'            </div>\n' +
					'        </div>')
			}
		},
		error: function (result, err) {
			console.log(err);
			console.log(result);
		}
	})
}

function submitEdit() {
	if (!$(".editable").is(":focus")) {
		$('.editable').attr('contenteditable','false');
	}
}