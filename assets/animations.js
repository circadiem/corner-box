/* ============================================================
   THE CORNER BOX — ANIMATIONS
   Scroll reveals, page load, micro-interactions
   ============================================================ */

(function () {
  'use strict';

  /* ── Page Load Reveal ── */
  function pageLoadReveal () {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    // Stagger first 3 visible elements on load
    var count = 0;
    elements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        el.style.transitionDelay = (count * 80) + 'ms';
        el.classList.add('is-visible');
        count++;
      }
    });
  }

  /* ── Scroll Reveal ── */
  function initScrollReveal () {
    var elements = document.querySelectorAll('.reveal:not(.is-visible)');
    if (!elements.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── Staggered Children ── */
  function initStaggeredChildren () {
    var grids = document.querySelectorAll('.product-grid, .archive-preview__grid, .drop-archive__grid');
    grids.forEach(function (grid) {
      var children = grid.querySelectorAll('.reveal');
      children.forEach(function (child, i) {
        child.style.transitionDelay = (i * 60) + 'ms';
      });
    });
  }

  /* ── Cart Count Update ── */
  function updateCartCount () {
    var dot = document.querySelector('.cart-count');
    if (!dot) return;

    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        dot.classList.toggle('is-visible', cart.item_count > 0);
        var link = document.querySelector('.cart-link');
        if (link) {
          link.setAttribute('aria-label', cart.item_count + ' items in your selection');
        }
      })
      .catch(function () {}); // Silently fail on non-Shopify environments
  }

  /* ── Button Press Feedback ── */
  function initButtonFeedback () {
    document.querySelectorAll('.btn, .product-form__btn, .hero__cta, .page-list__btn, .contact-form__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        btn.style.transform = 'scale(0.98)';
        setTimeout(function () {
          btn.style.transform = '';
        }, 120);
      });
    });
  }

  /* ── FAQ Accordion Height Fix ── */
  // Re-measure on resize for smooth max-height transition
  function initFaqResize () {
    var openItems = document.querySelectorAll('.faq-item.is-open .faq-item__body');
    if (!openItems.length) return;

    window.addEventListener('resize', function () {
      openItems.forEach(function (body) {
        if (body.closest('.faq-item').classList.contains('is-open')) {
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }

  /* ── Run ── */
  document.addEventListener('DOMContentLoaded', function () {
    pageLoadReveal();
    initScrollReveal();
    initStaggeredChildren();
    updateCartCount();
    initButtonFeedback();
    initFaqResize();
  });

  // Re-run scroll reveals after any dynamic content
  document.addEventListener('shopify:section:load', function () {
    initScrollReveal();
  });

})();
