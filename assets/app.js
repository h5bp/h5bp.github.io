"use strict";

function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function ($, undefined) {
  var orgName = 'h5bp';
  var stars = 0;

  // Return the repo url
  function getRepoUrl(repo) {
    return repo.homepage || repo.html_url;
  }

  // Return the repo description
  function getRepoDesc(repo) {
    return repo.description;
  }

  // Display a repo's overview (for recent updates section)
  function showRepoOverview(repo) {
    var item = "\n    <li>\n      <span class=\"name\"><a href=\"".concat(repo.html_url, "\">").concat(repo.name, "</a></span>\n      &middot;\n      <span class=\"time\"><a href=\"").concat(repo.html_url, "/commits\">").concat(html5prettyDate(repo.pushed_at), "</a></span>\n    </li>");
    $(item).appendTo("#updated-repos");
  }

  // Create an entry for the repo in the grid of org repos
  function showRepo(repo) {
    var url = getRepoUrl(repo);
    var language = repo.language !== null ? "&middot;".concat(repo.language) : '';

    // Create links for GitHub repo and homepage
    var githubLink = "<a href=\"".concat(repo.html_url, "\" class=\"repo__link repo__link--github\" title=\"View source code\">GitHub</a>");
    var homepageLink = repo.homepage ? "<a href=\"".concat(repo.homepage, "\" class=\"repo__link repo__link--homepage\" title=\"Visit project homepage\">Homepage</a>") : '';
    var linksHtml = "<div class=\"repo__links\">".concat(githubLink).concat(homepageLink, "</div>");
    var $item = $("<div class=\"unit-1-3 repo=\">\n        <div class=\"box\">\n        <h2 class=\"repo__name\">".concat(repo.name, "</h2>\n        <p class=\"repo__info\">").concat(repo.watchers, " stargazers ").concat(language, "</p>\n        <p class=\"repo__desc\">").concat(getRepoDesc(repo), "</p>\n        ").concat(linksHtml, "\n        </div>\n        </div>"));
    $item.on("click", function (e) {
      // Don't navigate if clicking on a link
      if (!$(e.target).hasClass('repo__link')) {
        window.location = url;
      }
    });
    $item.appendTo('#repos');
  }
  $.getJSON("https://api.github.com/orgs/".concat(orgName, "/repos?callback=?"), function (result) {
    var repos = result.data;
    $('#num-repos').text(repos.length);
    var _iterator = _createForOfIteratorHelper(repos),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
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
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    repos.sort(function (a, b) {
      if (a.hotness < b.hotness) return 1;
      if (b.hotness < a.hotness) return -1;
      return 0;
    });
    var _iterator2 = _createForOfIteratorHelper(repos),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _repo = _step2.value;
        stars += _repo.stargazers_count;
        if (_repo.archived === false) {
          showRepo(_repo);
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    $("#num-stargazers").text(stars.toLocaleString());
    // Sort by most-recently pushed to.
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
  });

  // Relative times
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
  }

  // Wraps prettyDate in an HTML5 <time> element
  function html5prettyDate(rawdate) {
    return "<time datetime=\"".concat(rawdate.toISOString(), "\">").concat(prettyDate(rawdate), "</time>");
  }
})(jQuery);

// External 3rd party scripts
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
    };

  // Twitter SDK
  add('https://platform.twitter.com/widgets.js', 'twitter-wjs');
})(document, 'script');
