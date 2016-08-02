$(document).ready( function() {
  $('#add-channel-btn').click(function() {
    var input = $("#search_bar").val();
    if (input != "") {
      $('#channel-list').append("<li>" + input + "</li");
      $("#search_bar").val(""); 
    }
  })
});


// Cool GT Analyze swag
// document.addEventListener('DOMContentLoaded', function() {
  // var checkPageButton = document.getElementById('checkPage');
  // checkPageButton.addEventListener('click', function() {

  //   chrome.tabs.getSelected(null, function(tab) {
  //     d = document;

  //     var f = d.createElement('form');
  //     f.action = 'http://gtmetrix.com/analyze.html?bm';
  //     f.method = 'post';
  //     var i = d.createElement('input');
  //     i.type = 'hidden';
  //     i.name = 'url';
  //     i.value = tab.url;
  //     f.appendChild(i);
  //     d.body.appendChild(f);
  //     f.submit();
  //   });
  // }, false);
// }, false);

