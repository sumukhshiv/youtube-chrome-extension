// function addItem() {
// 	var li = document.createElement("LI");
// 	var input = document.getElementById("search_bar");
// 	li.appendChild(document.createTextNode("yo"));
// 	input.value = "";

// 	document.getElementById("channel-list").appendChild(li);
// }
$(document).ready(function() {
	console.log("hiello");
	$('#add-channel-btn').click(function () {
		$('#channel-list').append('<li> yooyooo <li>');
	})	
})
