/* Talha Laique — portfolio interactions
   No dependencies. Everything degrades gracefully without JS. */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- theme ---------- */
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('tl-theme', next); } catch (e) { /* private mode */ }
    });
  }

  /* ---------- mobile nav ---------- */
  var burger = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');
  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navLinks.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- sticky nav border + back-to-top ---------- */
  var nav = document.getElementById('nav');
  var toTop = document.getElementById('toTop');
  function onScroll() {
    var y = window.scrollY;
    if (nav) nav.classList.toggle('is-stuck', y > 8);
    if (toTop) toTop.classList.toggle('is-visible', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- active section highlighting ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll(
    '.section .kicker, .section .h2, .about, .tl, .card, .pub, .skillset, .edu__item, .stats, .cta__text, .cta__row, .more'
  );
  if ('IntersectionObserver' in window) {
    Array.prototype.forEach.call(revealTargets, function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (Math.min(i % 6, 5) * 55) + 'ms';
    });
    var revealer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(revealTargets, function (el) { revealer.observe(el); });
  }

  /* ---------- project filters ---------- */
  var filterBtns = document.querySelectorAll('.filters .chip');
  var cards = document.querySelectorAll('#projectGrid .card');
  Array.prototype.forEach.call(filterBtns, function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');
      Array.prototype.forEach.call(filterBtns, function (b) {
        b.classList.toggle('is-active', b === btn);
      });
      Array.prototype.forEach.call(cards, function (card) {
        var tags = card.getAttribute('data-tags') || '';
        var show = filter === 'all' || tags.split(' ').indexOf(filter) !== -1;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------- résumé link: hide it if the PDF isn't uploaded yet ----------
     Everything stays visible by default, so it works without JS and in the
     normal case where the file exists. We only hide on a definite 404, never
     on a network hiccup — better a working link than a vanished one. */
  var resumeEls = document.querySelectorAll('.js-resume');
  if (resumeEls.length && window.fetch && /^https?:$/.test(location.protocol)) {
    var href = resumeEls[0].getAttribute('href');
    fetch(href, { method: 'HEAD' })
      .then(function (res) {
        if (res.status === 404 || res.status === 403) {
          Array.prototype.forEach.call(resumeEls, function (el) {
            el.classList.add('resume-missing');
          });
        }
      })
      .catch(function () { /* offline or blocked — leave the link in place */ });
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
