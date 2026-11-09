/* Turns the entries in content/posts.js into pages. You should not need to edit this file. */
(function () {
  "use strict";

  var TYPES = { thesis: "Thesis", project: "Project", blog: "Blog" };
  var PLURAL = { thesis: "Theses", project: "Projects", blog: "Blog posts" };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function parseDate(iso) {
    var parts = String(iso || "").split("-");
    var y = +parts[0] || 1970, m = +parts[1] || 1, d = +parts[2] || 1;
    return new Date(y, m - 1, d);
  }

  function fmtDate(post) {
    if (post.dateLabel) return post.dateLabel;
    var parts = String(post.date || "").split("-");
    if (parts.length === 1) return parts[0];
    var opts = parts.length === 2 ? { year: "numeric", month: "short" } : { year: "numeric", month: "short", day: "numeric" };
    return parseDate(post.date).toLocaleDateString("en", opts);
  }

  function slug(text, used) {
    var base = String(text).toLowerCase().replace(/<[^>]*>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
    var id = base, n = 2;
    while (used[id]) id = base + "-" + n++;
    used[id] = true;
    return id;
  }

  function ytId(input) {
    var s = String(input || "").trim();
    var m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/);
    if (m) return m[1];
    return /^[\w-]{11}$/.test(s) ? s : "";
  }

  function allPosts(includeDrafts) {
    var list = (typeof POSTS !== "undefined" ? POSTS : []).filter(function (p) { return includeDrafts || !p.draft; });
    return list.slice().sort(function (a, b) { return parseDate(b.date) - parseDate(a.date); });
  }

  function postUrl(p) { return "post.html?id=" + encodeURIComponent(p.id); }

  /* ---------- list entries ---------- */
  function entryHtml(p) {
    var tags = (p.tags || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
    return '<li class="entry' + (p.cover ? " has-thumb" : "") + '" data-type="' + esc(p.type) + '">' +
      '<p class="entry-date">' + esc(fmtDate(p)) + "</p>" +
      '<div class="entry-main">' +
        '<p class="entry-type"><span class="swatch swatch-' + esc(p.type) + '" aria-hidden="true"></span>' +
          esc(TYPES[p.type] || "Post") + (p.status ? '<span class="entry-status">' + esc(p.status) + "</span>" : "") + "</p>" +
        '<h3 class="entry-title"><a href="' + postUrl(p) + '">' + esc(p.title) + "</a></h3>" +
        '<p class="entry-summary">' + esc(p.summary) + "</p>" +
        (tags ? '<ul class="tags">' + tags + "</ul>" : "") +
      "</div>" +
      (p.cover ? '<img class="entry-thumb" src="' + esc(p.cover) + '" alt="" loading="lazy">' : "") +
      "</li>";
  }

  function renderHome(el) {
    var posts = allPosts(false);
    var featured = posts.filter(function (p) { return p.featured; });
    var rest = posts.filter(function (p) { return !p.featured; });
    var show = featured.concat(rest).slice(0, 4);
    el.innerHTML = show.map(entryHtml).join("");
  }

  function renderWork(listEl, filterEl) {
    var posts = allPosts(false);
    var current = (new URLSearchParams(location.search).get("type")) || "all";
    var kinds = ["all"].concat(Object.keys(TYPES).filter(function (t) {
      return posts.some(function (p) { return p.type === t; });
    }));
    if (kinds.indexOf(current) < 0) current = "all";

    function draw() {
      var shown = posts.filter(function (p) { return current === "all" || p.type === current; });
      listEl.innerHTML = shown.length ? shown.map(entryHtml).join("") : '<li class="empty">Nothing here yet.</li>';
      filterEl.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.type === current));
      });
    }

    filterEl.innerHTML = kinds.map(function (k) {
      var count = k === "all" ? posts.length : posts.filter(function (p) { return p.type === k; }).length;
      var label = k === "all" ? "All" : PLURAL[k];
      return '<button type="button" data-type="' + k + '" aria-pressed="false">' + label + ' <span class="count">' + count + "</span></button>";
    }).join("");

    filterEl.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      current = b.dataset.type;
      var url = new URL(location.href);
      if (current === "all") url.searchParams.delete("type"); else url.searchParams.set("type", current);
      history.replaceState(null, "", url);
      draw();
    });
    draw();
  }

  /* ---------- post blocks ---------- */
  function figure(src, caption, alt) {
    return '<figure class="fig"><button class="zoom" type="button" data-src="' + esc(src) + '" data-caption="' + esc(caption || "") +
      '" aria-label="View larger: ' + esc(caption || alt || "image") + '"><img src="' + esc(src) + '" alt="' + esc(alt || caption || "") +
      '" loading="lazy"></button>' + (caption ? "<figcaption>" + esc(caption) + "</figcaption>" : "") + "</figure>";
  }

  function video(urlOrId, caption) {
    var id = ytId(urlOrId);
    if (!id) return '<p class="note">That YouTube link could not be read. Check the address in content/posts.js.</p>';
    return '<figure class="fig"><div class="yt"><button class="yt-play" type="button" data-id="' + id +
      '" aria-label="Play video' + (caption ? ": " + esc(caption) : "") + '"><img src="https://i.ytimg.com/vi/' + id +
      '/hqdefault.jpg" alt="" loading="lazy"><span class="yt-icon" aria-hidden="true"></span></button></div>' +
      (caption ? "<figcaption>" + esc(caption) + "</figcaption>" : "") + "</figure>";
  }

  function blockHtml(b, ctx) {
    if (b.h) { var id = slug(b.h, ctx.used); ctx.toc.push({ id: id, text: b.h }); return '<h2 id="' + id + '">' + esc(b.h) + "</h2>"; }
    if (b.h3) return "<h3>" + esc(b.h3) + "</h3>";
    if (b.p) return "<p>" + b.p + "</p>";
    if (b.list) return "<ul>" + b.list.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>";
    if (b.olist) return "<ol>" + b.olist.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ol>";
    if (b.img) return figure(b.img, b.caption, b.alt);
    if (b.gallery) return '<div class="gallery">' + b.gallery.map(function (g) { return figure(g.src, g.caption, g.alt); }).join("") + "</div>";
    if (b.youtube) return video(b.youtube, b.caption);
    if (b.quote) return "<blockquote><p>" + b.quote + "</p>" + (b.by ? "<footer>" + esc(b.by) + "</footer>" : "") + "</blockquote>";
    if (b.code) return "<pre><code>" + esc(b.code) + "</code></pre>";
    if (b.note) return '<p class="note">' + b.note + "</p>";
    if (b.html) return b.html;
    return "";
  }

  function renderPost(el) {
    var id = new URLSearchParams(location.search).get("id");
    var posts = allPosts(true);
    var post = posts.filter(function (p) { return p.id === id; })[0];

    if (!post) {
      document.title = "Post not found | " + SITE.name;
      el.innerHTML = '<div class="wrap page-head"><h1>Post not found</h1><p>There is no post with that address. <a href="work.html">Browse all work</a>.</p></div>';
      return;
    }

    document.title = post.title + " | " + SITE.name;
    var ctx = { toc: [], used: {} };
    var body = (post.body || []).map(function (b) { return blockHtml(b, ctx); }).join("");

    var files = (post.files || []).length
      ? '<h2 id="downloads">Downloads</h2><ul class="downloads">' + post.files.map(function (f) {
          return '<li><a href="' + esc(f.url) + '" target="_blank" rel="noopener">' + esc(f.label) + "</a></li>";
        }).join("") + "</ul>"
      : "";
    if (files) ctx.toc.push({ id: "downloads", text: "Downloads" });

    var toc = ctx.toc.length > 1
      ? '<nav class="toc" aria-label="On this page"><p class="toc-title">On this page</p><ul>' +
        ctx.toc.map(function (t) { return '<li><a href="#' + t.id + '">' + esc(t.text) + "</a></li>"; }).join("") + "</ul></nav>"
      : "";

    var tags = (post.tags || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
    var published = allPosts(false);
    var idx = published.findIndex(function (p) { return p.id === post.id; });
    var next = idx >= 0 ? published[idx + 1] : null;

    el.innerHTML =
      '<article class="post">' +
        '<header class="wrap post-head">' +
          '<a class="back" href="work.html' + (post.type ? "?type=" + encodeURIComponent(post.type) : "") + '">All ' + esc((PLURAL[post.type] || "Work").toLowerCase()) + "</a>" +
          '<p class="entry-type"><span class="swatch swatch-' + esc(post.type) + '" aria-hidden="true"></span>' + esc(TYPES[post.type] || "Post") +
            (post.status ? '<span class="entry-status">' + esc(post.status) + "</span>" : "") +
            '<span class="post-date">' + esc(fmtDate(post)) + "</span>" +
            (post.draft ? '<span class="entry-status">Draft preview</span>' : "") + "</p>" +
          "<h1>" + esc(post.title) + "</h1>" +
          '<p class="post-summary">' + esc(post.summary) + "</p>" +
          (tags ? '<ul class="tags">' + tags + "</ul>" : "") +
        "</header>" +
        (post.cover ? '<div class="wrap">' + figure(post.cover, "", post.title).replace('class="fig"', 'class="fig cover"') + "</div>" : "") +
        '<div class="wrap post-layout">' + toc +
          '<div class="prose">' + (post.video ? video(post.video) : "") + body + files + "</div>" +
        "</div>" +
        (next ? '<div class="wrap"><a class="next" href="' + postUrl(next) + '"><span class="next-label">Next post</span><span class="next-title">' + esc(next.title) + "</span></a></div>" : "") +
      "</article>";
  }

  /* ---------- interactions: YouTube click-to-load and image viewer ---------- */
  function wireInteractions() {
    var dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    dialog.innerHTML = '<form method="dialog"><button class="lb-close" aria-label="Close image">Close</button></form><img alt=""><p class="lb-caption"></p>';
    document.body.appendChild(dialog);
    var lbImg = dialog.querySelector("img"), lbCap = dialog.querySelector(".lb-caption");
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });

    document.addEventListener("click", function (e) {
      var play = e.target.closest(".yt-play");
      if (play) {
        var box = play.parentNode;
        box.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + play.dataset.id +
          '?autoplay=1&rel=0" title="YouTube video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
        return;
      }
      var zoom = e.target.closest(".zoom");
      if (zoom) {
        lbImg.src = zoom.dataset.src;
        lbImg.alt = zoom.querySelector("img").alt;
        lbCap.textContent = zoom.dataset.caption;
        if (dialog.showModal) dialog.showModal();
      }
    });
  }

  window.Portfolio = { renderHome: renderHome, renderWork: renderWork, renderPost: renderPost, wire: wireInteractions };
})();
