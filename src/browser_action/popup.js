// Background page for debugging purposes (bkg.console.log)
var bkg = chrome.extension.getBackgroundPage();


// Returns all channels from local storage
function getChannels() {
  // bkg.console.log("in getChannels");
  var channels = [];
  var channels_str = localStorage.getItem('channels');
  if (channels_str != null && channels_str != undefined) {
    channels = JSON.parse(channels_str);
  }
  return channels;
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

  var html = '<ul>';
  for (var i=0;i<channels.length;i++) {
    html += '<li>' + channels[i] + '<button class="remove" id="' + i + '">x</button></li>';
  }
  html += '</ul>';
  $('#channel-list').html(html);
  $('.remove').click(removeChannel);
}

// Adds channel to localStorage based on current input in search_bar
function addChannel() {
  // bkg.console.log("in addChannel");
  var input = $('#search_bar').val();
  if (input != "") {
    var channels = getChannels();
    channels.push(input);
    localStorage.setItem('channels', JSON.stringify(channels));
    showList();
    $('#search_bar').val("");
  }

  return false;
}

// Start function when document is ready
function start() {
  $('#add-channel-btn').click(addChannel);
  showList();
}

$(document).ready(start);

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
