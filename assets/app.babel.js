(function ($, undefined) {

  const orgName = 'h5bp';
  let stars = 0;

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
    let item = `
    <li>
      <span class="name"><a href="${repo.html_url}">${repo.name}</a></span>
      &middot;
      <span class="time"><a href="${repo.html_url}/commits">${html5prettyDate(repo.pushed_at)}</a></span>
    </li>`;
    $(item).appendTo("#updated-repos");
  }

  // Create an entry for the repo in the grid of org repos
  function showRepo(repo) {
    const url = getRepoUrl(repo);
    const language = repo.language !== null ? `&middot;${repo.language}` : '';

    const $item = $(
      `<div class="unit-1-3 repo=">
        <div class="box">
        <h2 class="repo__name">${repo.name}</h2>
        <p class="repo__info">${repo.watchers} stargazers ${language}</p>
        <p class="repo__desc">${getRepoDesc(repo)}</p>
        </div>
        </div>`
    );
    $item.on("click",()=> window.location = url)
    $item.appendTo('#repos');
  }

  $.getJSON(`https://api.github.com/orgs/${orgName}/repos?callback=?`, (result) => {
    let repos = result.data;
    $('#num-repos').text(repos.length);
    for (let repo of repos) {
      repo.pushed_at = new Date(repo.pushed_at);

      let weekHalfLife = 1.146 * Math.pow(10, -9);

      let pushDelta  = (new Date()) - Date.parse(repo.pushed_at);
      let createdDelta = (new Date()) - Date.parse(repo.created_at);

      let weightForPush = 1;
      let weightForWatchers = 1.314 * Math.pow(10, 7);

      repo.hotness = weightForPush * Math.pow(Math.E, -1 * weekHalfLife * pushDelta);
      repo.hotness += weightForWatchers * repo.watchers / createdDelta;

    }
    repos.sort(function (a, b) {
      if (a.hotness < b.hotness) return 1;
      if (b.hotness < a.hotness) return -1;
      return 0;
    });

    for (let repo of repos) {
      stars += repo.stargazers_count;

      if (repo.archived === false) {
        showRepo(repo);
      }
    }
    $("#num-stargazers").text(stars.toLocaleString());
    // Sort by most-recently pushed to.
    repos.sort(function (a, b) {
      if (a.pushed_at < b.pushed_at) {
        return 1;
      }
      else if (b.pushed_at < a.pushed_at) {
        return -1;
      }
      else {
        return 0;
      }

    });

    $.each(repos.slice(0, 3), function (i, repo) {
      showRepoOverview(repo);
    });
  });

  $.getJSON(`https://api.github.com/orgs/${orgName}/members?per_page=100&callback=?`, function (result) {
    let members = result.data;
    $(function () {
      $('#num-members').text(members.length);
    });
  });

  // Relative times
  function prettyDate(rawdate) {
    let date, seconds, formats, i = 0, f;
    date = new Date(rawdate);
    seconds = (new Date() - date) / 1000;
    formats = [
      [60, 'seconds', 1],
      [120, '1 minute ago'],
      [3600, 'minutes', 60],
      [7200, '1 hour ago'],
      [86400, 'hours', 3600],
      [172800, 'Yesterday'],
      [604800, 'days', 86400],
      [1209600, '1 week ago'],
      [2678400, 'weeks', 604800]
    ];

    while (f = formats[i ++]) {
      if (seconds < f[0]) {
        return f[2] ? Math.floor(seconds / f[2]) + ' ' + f[1] + ' ago' : f[1];
      }
    }
    return 'A while ago';
  }

  // Wraps prettyDate in an HTML5 <time> element
  function html5prettyDate(rawdate) {
    return '<time datetime="' + rawdate.toISOString() + '">' + prettyDate(rawdate) + '</time>';
  }

})(jQuery);

// External 3rd party scripts
(function(doc, script) {
  let js,
    fjs = doc.getElementsByTagName(script)[0],
    add = function(url, id) {
      if (doc.getElementById(id)) {return;}
      js = doc.createElement(script);
      js.src = url;
      id && (js.id = id);
      fjs.parentNode.insertBefore(js, fjs);
    };

  // Twitter SDK
  add('https://platform.twitter.com/widgets.js', 'twitter-wjs');
}(document, 'script'));
