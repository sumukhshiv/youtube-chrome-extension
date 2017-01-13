var GOOGLE_API_KEY = 'AIzaSyB-IuINRJwPdV5EIOO3x8ubnwEdghT7e4g';

// Background page for debugging purposes (bkg.console.log)
var bkg = chrome.extension.getBackgroundPage();
var channelsGlobal = null;

// Returns all channels from local storage
function getChannels() {
  // bkg.console.log("in getChannels");
  if (channelsGlobal !== null) {
    return channelsGlobal
  }
  var channels_str = localStorage.getItem('channels');
  if (channels_str != null && channels_str != undefined) {
    channelsGlobal = JSON.parse(channels_str);
  }
  return channelsGlobal;
}

// Event handler for "x" button that removes channel from localStorage
// when clicked and updates UI
function removeChannel() {
  // bkg.console.log("in removeChannel");
  var id = $(this).prop('id');
  var channels = getChannels();
  channels.splice(id, 1);
  localStorage.setItem('channels', JSON.stringify(channels));
  showList();

  return false;
}

// Updates UI by adding appropriate html
function showList() {
  // bkg.console.log("in showList");
  var channels = getChannels();

  var html = '<p>';
  for (var i=0;i<channels.length;i++) {
    var title = channels[i];
    html += '<a href= "https://www.youtube.com/' + title + '">' + channels[i] + '<button class="remove" id="b-r' + i + '"></button></a>';
  }
  html += '</p>';
  $('#channel-list').html(html);
  $('.remove').click(removeChannel);
}

// Adds channel to localStorage based on current input in search_bar
function addChannel() {
  // bkg.console.log("in addChannel");
  var input = $('#search_bar').val();
  if (input != "") {
    searchForChannel(input);
  }
  return false;
}

function searchForChannel(channelQuery) {
  /*
    request with parameters {
      part: snippet
      q: channelQuery
      maxResults: 1
      type: channel
    }
  */
  var requestURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=" + channelQuery + "&key=" + GOOGLE_API_KEY;
  $.getJSON(requestURL, function(data) {
      bkg.console.log(data);
      var snippet = data.items[0].snippet;
      var title = snippet.title;
      var thumbnailURL = snippet.thumbnails.default.url;
      bkg.console.log(title + " and also URL" + thumbnailURL);
      
      // get channels from localStorage, or if already in javascript.
      // add the title (username) to the channels list
      var channels = getChannels();
      channels.push(title);
      localStorage.setItem('channels', JSON.stringify(channels));
      showList();
      $('#search_bar').val("");

    })
    .done(function() { bkg.console.log('getJSON request succeeded!'); })
    .fail(function(jqXHR, textStatus, errorThrown) { alert('getJSON request failed! ' + textStatus); })
    .always(function() { bkg.console.log('getJSON request ended!'); });
}

// Start function when document is ready
function start() {
  $('#add-channel-btn').click(addChannel);
  showList();
  $('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
}

$(document).ready(start);

//Not sure if it's okay to have two document.ready's (WILL CHECK TOMORROW)
//Experimenting only: opens new tabs for channel links (hardcoded)
// $(document).ready(function(){
//    $('body').on('click', 'a', function(){
//      chrome.tabs.create({url: $(this).attr('href')});
//      return false;
//    });
// });

// A cool GT Analyze function used for initial testing.
// function analyzeGTSwag() {
//   var checkPageButton = document.getElementById('add-channel-btn');
//   checkPageButton.addEventListener('click', function() {

//     chrome.tabs.getSelected(null, function(tab) {
//       d = document;

//       var f = d.createElement('form');
//       f.action = 'http://gtmetrix.com/analyze.html?bm';
//       f.method = 'post';
//       var i = d.createElement('input');
//       i.type = 'hidden';
//       i.name = 'url';
//       i.value = tab.url;
//       f.appendChild(i);
//       d.body.appendChild(f);
//       f.submit();
//     });
//   }, false);
// }
