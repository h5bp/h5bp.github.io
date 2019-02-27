"use strict";

(function ($, undefined) {
  var orgName = 'h5bp';
  var stars = 0; // Return the repo url

  function getRepoUrl(repo) {
    return repo.homepage || repo.html_url;
  } // Return the repo description


  function getRepoDesc(repo) {
    return repo.description;
  } // Display a repo's overview (for recent updates section)


  function showRepoOverview(repo) {
    var item = "\n    <li>\n      <span class=\"name\"><a href=\"".concat(repo.html_url, "\">").concat(repo.name, "</a></span>\n      &middot;\n      <span class=\"time\"><a href=\"").concat(repo.html_url, "/commits\">").concat(html5prettyDate(repo.pushed_at), "</a></span>\n    </li>");
    $(item).appendTo("#updated-repos");
  } // Create an entry for the repo in the grid of org repos


  function showRepo(repo) {
    var url = getRepoUrl(repo);
    var language = repo.language !== null ? "&middot;".concat(repo.language) : '';
    var $item = $("<div class=\"unit-1-3 repo=\">\n        <div class=\"box\">\n        <h2 class=\"repo__name\">".concat(repo.name, "</h2>\n        <p class=\"repo__info\">").concat(repo.watchers, " stargazers ").concat(language, "</p>\n        <p class=\"repo__desc\">").concat(getRepoDesc(repo), "</p>\n        </div>\n        </div>"));
    $item.on("click", function () {
      return window.location = url;
    });
    $item.appendTo('#repos');
  }

  $.getJSON("https://api.github.com/orgs/".concat(orgName, "/repos?callback=?"), function (result) {
    var repos = result.data;
    $('#num-repos').text(repos.length);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = repos[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var repo = _step.value;
        repo.pushed_at = new Date(repo.pushed_at);
        var weekHalfLife = 1.146 * Math.pow(10, -9);
        var pushDelta = new Date() - Date.parse(repo.pushed_at);
        var createdDelta = new Date() - Date.parse(repo.created_at);
        var weightForPush = 1;
        var weightForWatchers = 1.314 * Math.pow(10, 7);
        repo.hotness = weightForPush * Math.pow(Math.E, -1 * weekHalfLife * pushDelta);
        repo.hotness += weightForWatchers * repo.watchers / createdDelta;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    repos.sort(function (a, b) {
      if (a.hotness < b.hotness) return 1;
      if (b.hotness < a.hotness) return -1;
      return 0;
    });
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = repos[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _repo = _step2.value;
        stars += _repo.stargazers_count;

        if (_repo.archived === false) {
          showRepo(_repo);
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    $("#num-stargazers").text(stars.toLocaleString()); // Sort by most-recently pushed to.

    repos.sort(function (a, b) {
      if (a.pushed_at < b.pushed_at) {
        return 1;
      } else if (b.pushed_at < a.pushed_at) {
        return -1;
      } else {
        return 0;
      }
    });
    $.each(repos.slice(0, 3), function (i, repo) {
      showRepoOverview(repo);
    });
  });
  $.getJSON("https://api.github.com/orgs/".concat(orgName, "/members?per_page=100&callback=?"), function (result) {
    var members = result.data;
    $(function () {
      $('#num-members').text(members.length);
    });
  }); // Relative times

  function prettyDate(rawdate) {
    var date,
        seconds,
        formats,
        i = 0,
        f;
    date = new Date(rawdate);
    seconds = (new Date() - date) / 1000;
    formats = [[60, 'seconds', 1], [120, '1 minute ago'], [3600, 'minutes', 60], [7200, '1 hour ago'], [86400, 'hours', 3600], [172800, 'Yesterday'], [604800, 'days', 86400], [1209600, '1 week ago'], [2678400, 'weeks', 604800]];

    while (f = formats[i++]) {
      if (seconds < f[0]) {
        return f[2] ? Math.floor(seconds / f[2]) + ' ' + f[1] + ' ago' : f[1];
      }
    }

    return 'A while ago';
  } // Wraps prettyDate in an HTML5 <time> element


  function html5prettyDate(rawdate) {
    return '<time datetime="' + rawdate.toISOString() + '">' + prettyDate(rawdate) + '</time>';
  }
})(jQuery); // External 3rd party scripts


(function (doc, script) {
  var js,
      fjs = doc.getElementsByTagName(script)[0],
      add = function add(url, id) {
    if (doc.getElementById(id)) {
      return;
    }

    js = doc.createElement(script);
    js.src = url;
    id && (js.id = id);
    fjs.parentNode.insertBefore(js, fjs);
  }; // Twitter SDK


  add('https://platform.twitter.com/widgets.js', 'twitter-wjs');
})(document, 'script');
