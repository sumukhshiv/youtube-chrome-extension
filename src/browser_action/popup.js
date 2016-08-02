function get_todos() {
    var todos = new Array;
    var todos_str = localStorage.getItem('todo');
    if (todos_str !== null) {
        todos = JSON.parse(todos_str);
    }
    return todos;
}

function add() {
    var task = document.getElementById('task').value;

    var todos = get_todos();
    todos.push(task);
    localStorage.setItem('todo', JSON.stringify(todos));

    show();

    return false;
}

function remove() {
    var id = this.getAttribute('id');
    var todos = get_todos();
    todos.splice(id, 1);
    localStorage.setItem('todo', JSON.stringify(todos));

    show();

    return false;
}

function show() {
    var todos = get_todos();

    var html = '<ul>';
    for(var i=0; i<todos.length; i++) {
        html += '<li>' + todos[i] + '<button class="remove" id="' + i  + '">x</button></li>';
    };
    html += '</ul>';

    document.getElementById('todos').innerHTML = html;

    var buttons = document.getElementsByClassName('remove');
    for (var i=0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', remove);
    };
}

document.getElementById('add').addEventListener('click', add);
show();



//
// $(document).ready( function() {
//   $('#add-channel-btn').click(function() {
//     var input = $("#search_bar").val();
//
//     if (input != "") {
//       $('#channel-list').append("<p>" + input + "</p>");
//       $("#search_bar").val("");
//     }
//   })
// });



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
