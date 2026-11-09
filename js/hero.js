/* Hero animation: a two-link arm (inverse kinematics) that follows the pointer
   and drags a rope (verlet physics). It is a small nod to deformable-object manipulation. */
(function () {
  "use strict";
  var canvas = document.getElementById("arm");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var hero = canvas.closest("section") || document.body;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var css = getComputedStyle(document.documentElement);
  var INK = css.getPropertyValue("--ink").trim() || "#0D1321";
  var ACCENT = css.getPropertyValue("--accent").trim() || "#E4500F";
  var PAPER = css.getPropertyValue("--paper").trim() || "#F4F6F8";
  var GUIDE = "#AEB7C4";

  var W, H, floor, base, L1, L2, segLen, thick;
  var N = 26, rope = [];
  var cur = { x: 0, y: 0 }, aim = { x: 0, y: 0 }, tip = { x: 0, y: 0 }, elbow = { x: 0, y: 0 };
  var pointer = null, lastMove = -1e9, running = false;

  function resize() {
    var r = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    floor = H - 28;
    base = { x: W * 0.34, y: floor };
    L1 = Math.min(H * 0.46, W * 0.30);
    L2 = Math.min(H * 0.40, W * 0.27);
    segLen = Math.max(7, H * 0.026);
    thick = Math.max(9, H * 0.028);
    cur.x = base.x + (L1 + L2) * 0.6; cur.y = floor - L2 * 0.6;
    solve(cur.x, cur.y);
    rope = [];
    for (var i = 0; i < N; i++) rope.push({ x: tip.x + i * 0.5, y: tip.y, px: tip.x + i * 0.5, py: tip.y });
    for (var s = 0; s < 90; s++) stepRope();
    draw();
  }

  function solve(tx, ty) {
    var dx = tx - base.x, dy = ty - base.y;
    var d = Math.hypot(dx, dy) || 1;
    var maxR = L1 + L2 - 2, minR = Math.abs(L1 - L2) + 8;
    var k = Math.min(Math.max(d, minR), maxR) / d;
    dx *= k; dy *= k; d *= k;
    var a = Math.atan2(dy, dx);
    var c = Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)));
    var shoulder = a - Math.acos(c);
    elbow.x = base.x + Math.cos(shoulder) * L1;
    elbow.y = base.y + Math.sin(shoulder) * L1;
    tip.x = base.x + dx; tip.y = base.y + dy;
  }

  function stepRope() {
    var i, p;
    for (i = 1; i < N; i++) {
      p = rope[i];
      var vx = (p.x - p.px) * 0.985, vy = (p.y - p.py) * 0.985;
      if (p.y >= floor - 0.5) vx *= 0.7;
      p.px = p.x; p.py = p.y;
      p.x += vx; p.y += vy + 0.5;
    }
    for (var it = 0; it < 12; it++) {
      rope[0].x = tip.x; rope[0].y = tip.y;
      for (i = 0; i < N - 1; i++) {
        var a = rope[i], b = rope[i + 1];
        var dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 0.0001;
        var diff = (d - segLen) / d;
        if (i === 0) { b.x -= dx * diff; b.y -= dy * diff; }
        else { a.x += dx * diff * 0.5; a.y += dy * diff * 0.5; b.x -= dx * diff * 0.5; b.y -= dy * diff * 0.5; }
        if (b.y > floor) b.y = floor;
      }
    }
  }

  function step(now) {
    var idle = now - lastMove > 2500;
    if (idle || !pointer) {
      var t = now / 1000, reach = L1 + L2;
      aim.x = base.x + reach * 0.55 + Math.cos(t * 0.7) * reach * 0.28;
      aim.y = floor - L1 * 0.55 + Math.sin(t * 1.1) * L1 * 0.42;
    } else {
      aim.x = pointer.x; aim.y = pointer.y;
    }
    aim.x = Math.max(14, Math.min(W - 14, aim.x));
    aim.y = Math.min(aim.y, floor - 8);
    cur.x += (aim.x - cur.x) * 0.12;
    cur.y += (aim.y - cur.y) * 0.12;
    solve(cur.x, cur.y);
    stepRope();
  }

  function line(a, b, w, color) {
    ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
  }

  function joint(p, r) {
    ctx.fillStyle = PAPER; ctx.strokeStyle = INK; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // reach envelope
    ctx.save();
    ctx.setLineDash([4, 7]); ctx.strokeStyle = GUIDE; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(base.x, base.y, L1 + L2, Math.PI, Math.PI * 2); ctx.stroke();
    ctx.restore();

    // floor and base
    ctx.strokeStyle = INK; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, floor + 1); ctx.lineTo(W, floor + 1); ctx.stroke();
    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.moveTo(base.x - 34, floor + 1); ctx.lineTo(base.x - 20, floor - 16); ctx.lineTo(base.x + 20, floor - 16); ctx.lineTo(base.x + 34, floor + 1); ctx.closePath(); ctx.fill();

    // links
    line(base, elbow, thick, INK);
    line(elbow, tip, thick * 0.8, INK);
    joint(base, thick * 0.95);
    joint(elbow, thick * 0.85);

    // gripper
    var ang = Math.atan2(tip.y - elbow.y, tip.x - elbow.x);
    var ux = Math.cos(ang), uy = Math.sin(ang), px = -uy, py = ux;
    ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineCap = "round";
    [-1, 1].forEach(function (s) {
      ctx.beginPath();
      ctx.moveTo(tip.x + px * s * 7, tip.y + py * s * 7);
      ctx.lineTo(tip.x + ux * 14 + px * s * 4, tip.y + uy * 14 + py * s * 4);
      ctx.stroke();
    });

    // rope
    ctx.strokeStyle = ACCENT; ctx.lineWidth = 4.5; ctx.lineJoin = "round"; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(rope[0].x, rope[0].y);
    for (var i = 1; i < N; i++) ctx.lineTo(rope[i].x, rope[i].y);
    ctx.stroke();
    ctx.fillStyle = ACCENT;
    ctx.beginPath(); ctx.arc(rope[N - 1].x, rope[N - 1].y, 5, 0, Math.PI * 2); ctx.fill();
  }

  var last = 0, acc = 0;
  function loop(now) {
    if (!running) return;
    acc += Math.min(now - last, 100); last = now;
    while (acc >= 16.67) { step(now); acc -= 16.67; }
    draw();
    requestAnimationFrame(loop);
  }
  function start() { if (running || reduce) return; running = true; last = performance.now(); acc = 0; requestAnimationFrame(loop); }
  function stop() { running = false; }

  hero.addEventListener("pointermove", function (e) {
    var r = canvas.getBoundingClientRect();
    pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    lastMove = performance.now();
  });

  var rt;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(resize, 120); });

  resize();
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) { entries[0].isIntersecting ? start() : stop(); }).observe(canvas);
  } else { start(); }
})();
