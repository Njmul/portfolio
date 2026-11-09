/* Shared behaviour: footer year, links from content/site.js, and page rendering. */
(function () {
  "use strict";

  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  document.querySelectorAll("[data-site]").forEach(function (el) {
    var key = el.getAttribute("data-site");
    var value = typeof SITE !== "undefined" ? SITE[key] : "";
    if (!value) { (el.closest("li") || el).remove(); return; }
    el.setAttribute("href", key === "email" ? "mailto:" + value : value);
    if (el.hasAttribute("data-site-text")) el.textContent = value;
    if (/^https?:/.test(value)) { el.setAttribute("target", "_blank"); el.setAttribute("rel", "noopener"); }
  });

  var P = window.Portfolio;
  if (!P) return;
  P.wire();
  var home = document.getElementById("latest-work");
  var list = document.getElementById("work-list");
  var filters = document.getElementById("work-filters");
  var post = document.getElementById("post");
  if (home) P.renderHome(home);
  if (list && filters) P.renderWork(list, filters);
  if (post) P.renderPost(post);
})();
