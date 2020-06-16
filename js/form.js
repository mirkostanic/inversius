document.addEventListener("DOMContentLoaded", function() {
	document.forms["contact-form"].addEventListener("submit", postData);
});

function postData(formsubmission) {

	var name = encodeURIComponent(document.getElementById("name").value);
	var email = encodeURIComponent(document.getElementById("email").value);
	var message = encodeURIComponent(document.getElementById("message").value);

	// Checks if fields are filled-in or not, returns response "<p>Please enter your details.</p>" if not.
	if (name == "" || email == "") {
		document.getElementById("response").innerHTML = "<p>Please enter your details.</p>";
		return;
	}

	// Parameters to send to PHP script. The bits in the "quotes" are the POST indexes to be sent to the PHP script.
	var params = "name=" + name + "&email=" + email + "&message=" + message;

	var http = new XMLHttpRequest();
	http.open("POST", "send.php", true);

	// Set headers
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.setRequestHeader("Content-length", params.length);
	http.setRequestHeader("Connection", "close");

	http.onreadystatechange = function() {
		if (http.readyState == 4 && http.status == 200) {
			document.getElementById("contact-form").innerHTML = http.responseText;
		}
	}
	http.send(params);
	formsubmission.preventDefault();
}