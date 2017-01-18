var GOOGLE_API_KEY = 'AIzaSyB-IuINRJwPdV5EIOO3x8ubnwEdghT7e4g';

// Background page for debugging purposes (bkg.console.log)
var bkg = chrome.extension.getBackgroundPage();
var channelsGlobal = null;

// Define Channel object
function Channel(title, imgURL, channelId) {
  this.title = title;
  this.imgURL = imgURL;
  this.channelId = channelId;
}

// Define Video object for our convenience (will need more parameters like channelTitle, video
// duration, etc.)
function Video(videoTitle, channelTitle, imgURL, publishedAt, videoId) {
  this.videoTitle = videoTitle;
  this.channelTitle = channelTitle;
  this.imgURL = imgURL;
  this.publishedAt = publishedAt;
  this.videoId = videoId;
}

// Returns all channels from local storage
function getChannels() {
  // bkg.console.log("in getChannels");
  if (channelsGlobal !== null) {
    return channelsGlobal
  }
  var channels_str = localStorage.getItem('channels');
  if (channels_str !== null && channels_str !== undefined) {
    channelsGlobal = JSON.parse(channels_str);
  } 
  return channelsGlobal;
}

function getNewVideos() {
  // bkg.console.log('do we get to getnewvideos');
  var channels = getChannels();
  var $scope = angular.element($("#results")).scope();

  for (var i=0; i<channels.length; i++) {
    (function(i) {
      var channelId = channels[i].channelId;
      if (!(channelId in $scope.results)) {
        var requestURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=date&channelId=" + channelId + "&key=" + GOOGLE_API_KEY;
          $.getJSON(requestURL, function(data) {
              // bkg.console.log(data);
              // CONSIDER CASE WHERE THE CHANNEL HAS NO VIDEOS. IF SO, CHECK THE RESPONSE VALUE
              // AND RETURN NULL OR WHATEVER IS APPROPRIATE
              var snippet = data.items[0].snippet;
              var videoTitle = snippet.title;
              var thumbnailURL = snippet.thumbnails.high.url;
              var channelTitle = snippet.channelTitle;
              var publishedAt = (snippet.publishedAt).substring(0, 10);
              var videoId = data.items[0].id.videoId;
              var newVideo = new Video(videoTitle, channelTitle, thumbnailURL, publishedAt, videoId);
              // bkg.console.log("we DO push");
              // newVideos.push(newVideo);
              $scope.results[channelId] = newVideo;
              $scope.numNewVideos += 1;
              // $scope.results.push(newVideo);
              $scope.$apply();
              // if (i === channels.length - 1) {
              //   bkg.console.log("we pushed, we are on last element");
              //   // callback(newVideos);
              //   $scope.$apply(function() {
              //     $scope.results = newVideos;
                  // bkg.console.log("results length is " + $scope.results.length);
              //   });
              // }
          })
          .done(function() { /*bkg.console.log('getJSON request succeeded!');*/ })
          .fail(function(jqXHR, textStatus, errorThrown) { alert('getJSON request failed! ' + textStatus); })
          .always(function() { /*bkg.console.log('getJSON request ended!');*/ });
        }
      })(i);
  }
}

// Event handler for "x" button that removes channel from localStorage
// when clicked and updates UI
function removeChannel() {
  // bkg.console.log("in removeChannel");
  var id = $(this).prop('id');
  var index = parseInt(id.substring(11), 10);
  bkg.console.log("index is " + index);
  var channels = getChannels();
  bkg.console.log("length is " + channels.length);
  var channelTitle = channels[index].title;
  bkg.console.log("channel title is  " + channelTitle);
  var channelId = channels[index].channelId;
  // bkg.console.log("channelId is " + channelId);
  var $scope = angular.element($("#results")).scope();
  delete $scope.results[channelId];
  $scope.numNewVideos -= 1;
  $scope.$apply();
  channels.splice(index, 1);
  localStorage.setItem('channels', JSON.stringify(channels));
  showList();

  return false;
}

// Updates UI by adding appropriate html
function showList() {
  // bkg.console.log("in showList");
  var channels = getChannels();
  if (channels === null || channels === undefined || channels.length === 0) {
    $('#no-channels-text').show();
    $('#channel-list').html('');
    return;
  } else {
    $('#no-channels-text').hide();
  }
  var html = '<ul style="list-style:none">';
  for (var i=0;i<channels.length;i++) {
    var currentChannel = channels[i]; // channel name for linking to channel
    var title = currentChannel.title;
    var imgURL = currentChannel.imgURL;
    // var channelId = currentChannel.channelId;
    var imgsrc = '<li> <div class="channel"> <img style="width:30px; height:30px;" src=' + imgURL + '>';
    html += imgsrc + '<a href= "https://www.youtube.com/' + title + '">' + title + '</a><button class="remove" id="remove-btn-' + i + '"></button> </div></li>';
  }
  html += '</ul>';
  $('#channel-list').html(html);
  $('.remove').click(removeChannel);
}

// <li> <div class="channel"> </div> </li>

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
      // bkg.console.log(data);
      if (data.items.length === 0) {
        alert(channelQuery + " not found. Try adding again.");
      } else {
        var snippet = data.items[0].snippet;
        var title = snippet.title;
        var channelId = snippet.channelId;
        var thumbnailURL = snippet.thumbnails.default.url;
        var newChannel = new Channel(title, thumbnailURL, channelId);
        // bkg.console.log(title + " and also URL" + thumbnailURL);
        
        // get channels from localStorage, or if already in javascript.
        // add the title (username) to the channels list
        var channels = getChannels();
        channels.push(newChannel);
        localStorage.setItem('channels', JSON.stringify(channels));
        showList();

        // Add new channel's videos, if any.
        getNewVideos();        
      }
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

// AngularJS stuff
var myApp = angular.module('myApp',[]);

myApp.controller('NewVideosController', ['$scope', function($scope) {
  // $scope.results = getNewVideos();
  // $scope.results = [];

  // $scope.refreshCallback = function(results) {
  //   $scope.results = results;
  //   bkg.console.log($scope.results.length);
  // }
  $scope.numNewVideos = 0;
  $scope.results = {};
  $scope.refreshResults = function() {
    // bkg.console.log('we call refreshresults');
    getNewVideos();
  }

  $scope.openVideoLink = function(videoId) {
    bkg.console.log('we in ovl tho');
    var url = 'https://www.youtube.com/watch?v=' + videoId;
    window.open(url, '_blank');
  }

  $scope.refreshResults();

  // if (newVideos === null || newVideos === undefined || newVideos.length === 0) {
  //   $scope.hasNewVideos = true;
  // } else {
  //   $scope.hasNewVideos = true;
  // }

}]);

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
