// Button 1

$('#basicDataButton').on('click', function(wtf_is_this) {
  update_dom();
});

function update_dom() {

  var user_dom_should_work_with = $('#usersGitHubUserFieldInput').val();

  console.log("user_dom_should_work_with = " + user_dom_should_work_with)
  // If the user/client has entered text in the field, we note that.
  if (user_dom_should_work_with) {
    client_modded_default = true;
    view_needs_update = true;
  }

  // Then this part of the code manages the text input field.

  // if we have no text in the input field and no default set,
  if (!user_dom_should_work_with && !default_username) {
    // the user has not set a GitHub user to query.
  }
  // else, if we have no text in the input field but a default is set,
  else if (!user_dom_should_work_with && default_username) {
    // we use the default;
    user_dom_should_work_with = default_username;
    // If it's the first load on the browser, do nothing.
    // If it's the second load and the original default has not been modded,
    if (num_of_actions_client_actioned == 1 && !client_modded_default) {
      get_basic_user_data(user_dom_should_work_with);
    }
    else {
      get_basic_user_data(user_dom_should_work_with);
    }
  }
  // else if we have text in the input field and a default already set,"
  else if (user_dom_should_work_with && default_username) {

    // We should see if there is any change and if there is,"
    if (!(user_dom_should_work_with === default_username)) {
      get_basic_user_data(user_dom_should_work_with);
      reset_pages_view();
    }
  }
  else {
    get_basic_user_data(user_dom_should_work_with);
  }

  // Clear the text field and change the placeholder.
  update_input_text_field(user_dom_should_work_with);

  // Let the user know how many calls they have left.
  update_api_calls_remain_view();

  num_of_actions_client_actioned++;
}

function get_basic_user_data(user_dom_should_work_with) {
  // update the global variable.
  default_username = user_dom_should_work_with;

  var basic_github_user_api_string = "https://api.github.com/users/";
  var url_to_call = basic_github_user_api_string + default_username;

  requestJSON(url_to_call, function(json) {
    var basic_user_data_html_string = "NOT_SET";
    var error_string = "update_dom() could not get github_rate_limit_url_string"

    if (json.message == "Not Found") {
      basic_user_data_html_string = error_string;
    }
    else {
      default_user_object = json;
    }
    update_basic_user_data_view();
  });
}

function update_basic_user_data_view() {

  var fullname = default_user_object.name;
  var username = default_user_object.login;
  var users_email = default_user_object.email;

  if (fullname === undefined || fullname === null) {
    fullname = username;
  }

  if (users_email === "null") {
    users_email = default_user_object.html_url;
  }

  var innerHTML = "";
  innerHTML += '<div>';
    innerHTML += '<div id="basicGitHubUserData">';
      innerHTML += '<h2>';
        innerHTML += '<span class="queriedUsersNameOrHandle">' + fullname + '';
          innerHTML += '<span class="queriedUsersContactInfo"><a class="queriedUsersContactInfo" href="' + default_user_object.email + '" target="_blank">';
            innerHTML += '(@' + username;
          innerHTML += ')</a>'
          innerHTML += '</span>';
        innerHTML += '</span>';
      innerHTML += '</h2>';
      innerHTML += '<div class="queriedUsersAvatar">';
        innerHTML += '<a href="' + default_user_object.html_url + '" target="_blank">';
        innerHTML += '<img class="avatar_image" src="' + default_user_object.avatar_url + '" alt="' + fullname + '">';
        innerHTML += '</a>';
      innerHTML += '</div>';
      innerHTML += '<div class="queriedUsersRepoDataStats">';
        innerHTML += 'Public Repos : ' + default_user_object.public_repos;
        innerHTML += '</br>';
        innerHTML += 'Public Gists : ' + default_user_object.public_gists;
    innerHTML += '</div>';
  innerHTML += '</div>';
  innerHTML += '</br>';

  $('#basicGitHubUserDataContainer').html(innerHTML);
}

function update_input_text_field(user_to_work_with) {
  
  //var valueInTextInputField = 
  if (user_to_work_with) {
    if (client_modded_default) {
      document.getElementsByName('usersGitHubUserFieldInput')[0].placeholder = user_to_work_with;

    }
    else {
      document.getElementsByName('usersGitHubUserFieldInput')[0].placeholder = 'Enter a GitHub username here. Default : ' + user_to_work_with;
    }
  }
  else {
    document.getElementsByName('usersGitHubUserFieldInput')[0].placeholder = 'Enter a GitHub username here.';
  }
  clear_input_field();
}

function clear_input_field() {
  document.getElementsByName('usersGitHubUserFieldInput').value = '';
}

function update_api_calls_remain_view() {
  var github_rate_limit_url_string = 'https://api.github.com/rate_limit';

  requestJSON(github_rate_limit_url_string, function(json) {

    var basicGitHubAPIrateString = "NOT_SET";
    var error_string = "update_dom() could not get github_rate_limit_url_string"

    if (json.message == "Not Found") {
      basicGitHubAPIrateString = error_string;
      console_display_value(error_string);
    }
    else {
      var calls_remaining = json.resources.core.remaining;
      basicGitHubAPIrateString = "<p id=\"apiCallsRemaining\"> API calls remaining : " + calls_remaining + " </p>";
    }
    $('#githubAPIdata').html(basicGitHubAPIrateString);
  });
}

function console_display_value(val_in) {
  console.log(val_in);
}

function requestJSON(url, callback) {
  $.ajax({
    url: url,
    complete: function(xhr) {
      callback.call(null, xhr.responseJSON);
    }
  });
}

var view_needs_update = true;
var num_of_actions_client_actioned = 0;
var client_modded_default = false;
var default_username = "KoreaHaos";
var default_user_object;

update_dom();

// Button 2

$('#GitHubPagesButton').on('click', function(wtf_is_this) {
  manage_user_input_field();
  if (!default_user_object && default_username) {
    build_default_user_object(populate_pages_data);
    $('#githubPagesData').html('<div id="loader"><img src="gifs/waiting_black.gif" alt="loading..."></div>');
  }
  else {
    if (we_need_to_update_default_user_object()) {
      build_default_user_object(populate_pages_data);
      $('#githubPagesData').html('<div id="loader"><img src="gifs/waiting_black.gif" alt="loading..."></div>');
    }
    else {
      if (view_needs_update) {
        build_default_user_object(populate_pages_data);
        $('#githubPagesData').html('<div id="loader"><img src="gifs/waiting_black.gif" alt="loading..."></div>');
      }
    }
  }
});

function populate_pages_data(data_to_populate_default_user_object_with) {
  default_user_object = data_to_populate_default_user_object_with;

  var num_of_repos_to_call_for = default_user_object.public_repos;

  if (num_of_repos_to_call_for > 100) {
    num_of_repos_to_call_for = 100;
    console.log("MORE THAN 100 REPOS!");
  }

  var github_users_repos_api_string = default_user_object.repos_url;
  var pagination_concatination_string = "?per_page=" + num_of_repos_to_call_for;
  var error_string = "populate_pages_data() API call failed!";

  var url_to_call = github_users_repos_api_string + pagination_concatination_string;

  requestJSON(url_to_call, function(json_returned) {
    if (json_returned.message == "Not Found") {
      console_display_value(error_string);
    }
    else {
      default_user_object.repos_api_data = json_returned;
      for (var i = 0; i < default_user_object.repos_api_data.length; i++) {
        if (default_user_object.repos_api_data[i].has_pages) {
          var github_pages_url_string = "http://" + default_user_object.login + ".github.io/" + default_user_object.repos_api_data[i].name;
          default_user_object.repos_api_data[i].repos_pages_url = github_pages_url_string;
        }
      }
    }
    $('#githubPagesData').html(make_github_pages_html_from_default_user_object());
  });
}

function make_github_pages_html_from_default_user_object() {
  var return_html_string = "";
  return_html_string += "";
  return_html_string += '<div class="repolistRoundTwo">';
  for (var i = 0; i < default_user_object.repos_api_data.length; i++) {
    return_html_string += '<div class="landscape_inline">';
    return_html_string += '<a class="float_link_left" href = "';
    return_html_string += default_user_object.repos_api_data[i].html_url;
    return_html_string += '" target="_blank">'
    return_html_string += default_user_object.repos_api_data[i].name;
    return_html_string += '</a>'
    
    if (default_user_object.repos_api_data[i].has_pages) {
      return_html_string += '<a href = "';
      return_html_string += default_user_object.repos_api_data[i].repos_pages_url;
      return_html_string += '" target="_blank">'
      return_html_string += '<img class="float_right" src="../img/star_icon_transparent.png" alt="gh-pages link" id="ghPagesLink">'
      return_html_string += '</a>'
    }
    return_html_string += "</div>";
  }
  return_html_string += "</ul>";
  return_html_string += "</div>";

  return return_html_string;
}

function build_default_user_object(function_to_call_once_user_object_is_built) {
  // This function updates the global variable 'default_user_object'.

  var basic_github_user_api_string = "https://api.github.com/users/";
  var url_to_call = basic_github_user_api_string + default_username;

  var error_string = "build_default_user_object() API call failed!";

  requestJSON(url_to_call, function(json_returned) {
    if (json_returned.message == "Not Found") {
      console_display_value(error_string);
    }
    function_to_call_once_user_object_is_built(json_returned);
  });
}

function we_need_to_update_default_user_object() {
  if (default_username.toUpperCase() === default_user_object.login.toUpperCase()) {
    return false;
  }
  else {
    console.log("default_username has been modified.");
    return true;
  }
}

function manage_user_input_field() {

  var user_dom_should_work_with = $('#usersGitHubUserFieldInput').val();

  // If the user/client has entered text in the field, we note that.
  if (user_dom_should_work_with) {
    client_modded_default = true;
    view_needs_update = true;
  }

  if (user_dom_should_work_with && default_username) {
    // We should see if there is any change and if there is,"
    if (!(user_dom_should_work_with === default_username)) {
      default_username = user_dom_should_work_with;
      view_needs_update = true;
    }
  }
  else if (user_dom_should_work_with && !default_username) {
    default_username = user_dom_should_work_with;
    view_needs_update = true;
  }

  if (num_of_actions_client_actioned < 2) {
    view_needs_update = true;
  }
  update_input_text_field(default_username);
}

function reset_pages_view() {
  $('#githubPagesData').html('<div id="pagesDataBlank"></div>');
}

// Button 3 : A basic reset on the app, clears default user.

$('#resetButton').on('click', function(wtf_is_this) {
  location.reload();
});
