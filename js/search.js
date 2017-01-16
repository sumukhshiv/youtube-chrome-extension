// var GOOGLE_API_KEY = 'AIzaSyB-IuINRJwPdV5EIOO3x8ubnwEdghT7e4g';

// var bkg = chrome.extension.getBackgroundPage();
// // // Called automatically when JavaScript client library is loaded.
// // function onClientLoad() {
// //     gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
// // }

// // // Called automatically when YouTube API interface is loaded (see line 9).
// // function onYouTubeApiLoad() {
// //     // This API key is intended for use only in this lesson.
// //     // See https://goo.gl/PdPA1 to get a key for your own applications.
// //     // bkg.console.log('at least in onyoutubeapiload')
// //     gapi.client.setApiKey('AIzaSyB-IuINRJwPdV5EIOO3x8ubnwEdghT7e4g');
// // }

// function searchForChannel(channelQuery) {
// 	// var xmlHttp = new XMLHttpRequest();
// 	// bkg.console.log('at least in onyoutubeapiload')
// 	// var request = gapi.client.youtube.search.list({
// 	// 	q: 'hi',
// 	// 	part: 'snippet'
// 	// });
// 	// request.execute(function(response) {
// 	// 	bkg.console.log('we succeede boi');
// 	// });
// 	// bkg.console.log('we in here tho');
// 	if (channelQuery === "") {
// 		return;
// 	}
// 	var requestURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=" + channelQuery + "&key=" + GOOGLE_API_KEY;
// 	$.getJSON(requestURL, function(data) {
//       bkg.console.log(data);
//     })
//     .done(function() { alert('getJSON request succeeded!'); })
// .fail(function(jqXHR, textStatus, errorThrown) { alert('getJSON request failed! ' + textStatus); })
// .always(function() { alert('getJSON request ended!'); });

//     // getJSON(handlerURL + "&callback=?", 
//     // function(jsonResult){
//     //     alert("Success!");
//     // })

// }