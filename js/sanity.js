
(function () {
  'use strict';

  /* ─── Portable Text → HTML ────────────────────────────────────────── */
  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderMarks(child) {
    var t = esc(child.text || '');
    var marks = child.marks || [];
    if (marks.indexOf('strong') >= 0) t = '<strong>' + t + '</strong>';
    if (marks.indexOf('em') >= 0) t = '<em>' + t + '</em>';
    return t;
  }

  function ptToHtml(blocks) {
    if (!blocks || !blocks.length) return '';
    return blocks.map(function (block) {
      if (block._type !== 'block') return '';
      var inner = (block.children || []).map(renderMarks).join('');
      switch (block.style) {
        case 'h2':         return '<h2>' + inner + '</h2>';
        case 'blockquote': return '<blockquote>' + inner + '</blockquote>';
        default:           return '<p>' + inner + '</p>';
      }
    }).join('');
  }

  /* ─── HTML generators ─────────────────────────────────────────────── */
  function pad(n) { return String(n).padStart(3, '0'); }

  function etCardHtml(p, idx, extraClass) {
    var imgHtml = p.imageUrl
      ? '<div style="margin:-clamp(22px,3vw,36px) -clamp(18px,2.5vw,28px) clamp(11px,1.5vw,16px);aspect-ratio:3/2;overflow:hidden;">' +
        '<img src="' + esc(p.imageUrl) + '" alt="" loading="lazy" ' +
        'style="width:100%;height:100%;object-fit:cover;object-position:50% 30%;' +
        'filter:grayscale(1) brightness(.6) contrast(1.08);' +
        'transition:transform .7s cubic-bezier(.16,1,.3,1);display:block;"></div>'
      : '';
    return '<div class="et-card' + (extraClass ? ' ' + extraClass : '') +
      '" data-post="' + idx + '" data-cat="' + esc(p.filterTag || '') + '">' +
      imgHtml +
      '<div class="et-top"><span class="et-n">' + esc(p.num || pad(idx + 1)) + '</span>' +
      '<span class="et-tag">' + esc(p.cat) + '</span></div>' +
      '<h3 class="et-title">' + esc(p.title) + '</h3>' +
      '<p class="et-exc">' + esc(p.exc) + '</p>' +
      '<div class="et-foot"><span>' + esc(p.date) + '</span>' +
      '<div class="mdot"></div><span>' + esc(p.read) + '</span>' +
      '<span class="et-arr">→</span></div></div>';
  }

  function genEtList(posts) {
    return posts.map(function (p, i) {
      return '<div class="et-list-item" data-post="' + i + '" data-cat="' + esc(p.filterTag || '') + '">' +
        '<span class="et-list-n">' + esc(p.num || pad(i + 1)) + '</span>' +
        '<span class="et-list-title">' + esc(p.title) + '</span>' +
        '<span class="et-list-cat">' + esc(p.cat) + '</span>' +
        '<span class="et-list-dur">' + esc(p.read) + '</span>' +
        '</div>';
    }).join('');
  }

  // Études page grid (posts 1..N)
  function genEtGrid(posts) {
    return posts.slice(1).map(function (p, idx) {
      return etCardHtml(p, idx + 1, '');
    }).join('');
  }

  // Home page preview (first 3 posts)
  function genHomeCards(posts) {
    var classes = ['rv', 'rv d1', 'rv d2'];
    return posts.slice(0, 3).map(function (p, i) {
      return etCardHtml(p, i, classes[i] || 'rv');
    }).join('');
  }

  // Featured article (post 0) — image LEFT (.feat-img), text RIGHT (2-col .feat-grid CSS)
  function genFeatured(p) {
    var imgCol = p.imageUrl
      ? '<div class="feat-img">' +
          '<div class="feat-in"><img src="' + esc(p.imageUrl) + '" alt="" loading="lazy"></div>' +
          '<div class="feat-badge">' + esc(p.num || '001') + '</div>' +
        '</div>'
      : '';
    var textCol = '<div>' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:10px;">' +
      '<span class="feat-cat">' + esc(p.cat) + '</span>' +
      '<span style="font-family:var(--mono);font-size:9px;color:var(--s15);">' + esc(p.num || '001') + '</span>' +
      '</div>' +
      '<h2 class="feat-title">' + esc(p.title) + '</h2>' +
      '<p class="feat-exc">' + esc(p.exc) + '</p>' +
      '<div class="feat-meta"><span>' + esc(p.date) + '</span><div class="mdot"></div>' +
      '<span>' + esc(p.read) + '</span><div class="mdot"></div>' +
      '<span>' + esc(p.cat) + '</span></div>' +
      '<button class="read-btn" data-post="0">Lire l\'\u00e9tude \u2192</button>' +
      '</div>';
    return imgCol + textCol;
  }

  /* ─── Services accordion ──────────────────────────────────────────── */
  function attachAccordion(list) {
    if (!list) return;
    list.querySelectorAll('.svc-row').forEach(function (row) {
      row.addEventListener('click', function () {
        var item = row.parentElement;
        var wasOpen = item.classList.contains('open');
        list.querySelectorAll('.svc-item').forEach(function (it) { it.classList.remove('open'); });
        if (!wasOpen) item.classList.add('open');
      });
    });
  }

  /* ─── Apply Sanity data to the DOM ───────────────────────────────── */
  function applyContent(data) {
    var articles = data.articles || [];
    var settings = data.settings || {};

    /* --- Articles --- */
    if (articles.length) {
      // Build POSTS-compatible objects
      var newPosts = articles.map(function (a) {
        return {
          num:       a.number || '',
          cat:       a.category || '',
          filterTag: a.filterTag || '',
          title:     a.title || '',
          date:      a.publishedDate || '',
          read:      a.readingTime || '',
          exc:       a.excerpt || '',
          body:      ptToHtml(a.body || []),
          imageUrl:  a.coverImageUrl || null
        };
      });

      // Update global POSTS array in-place (the main IIFE holds the reference)
      if (Array.isArray(window.__CORVYN_POSTS)) {
        window.__CORVYN_POSTS.length = 0;
        newPosts.forEach(function (p) { window.__CORVYN_POSTS.push(p); });
      }

      // All et-lists (home, about, services, études)
      var listHtml = genEtList(newPosts);
      document.querySelectorAll('.et-list').forEach(function (el) {
        el.innerHTML = listHtml;
      });

      // Études page grid (articles 1..N)
      var grid = document.getElementById('et-grid');
      if (grid) grid.innerHTML = genEtGrid(newPosts);

      // Home page preview cards
      var homeCards = document.getElementById('et-cards-home');
      if (homeCards) homeCards.innerHTML = genHomeCards(newPosts);

      // Featured article (études page)
      var feat = document.querySelector('.feat-grid');
      if (feat && newPosts.length) {
        feat.innerHTML = genFeatured(newPosts[0]);
        feat.setAttribute('data-post', '0');
      }

      // Article count label
      var countEl = document.getElementById('articles-count');
      if (countEl) {
        countEl.textContent = String(newPosts.length).padStart(2, '0') + ' textes';
      }
    }

    /* --- Images --- */
    if (settings.heroImageUrl) {
      var heroImg = document.getElementById('hero-img');
      if (heroImg) {
        heroImg.src = settings.heroImageUrl;
        heroImg.removeAttribute('srcset');
      }
    }
    if (settings.servicesImageUrl) {
      var svcImg = document.getElementById('svc-img');
      if (svcImg) {
        svcImg.src = settings.servicesImageUrl;
        svcImg.removeAttribute('srcset');
      }
    }

    /* --- Services list --- */
    if (settings.services && settings.services.length) {
      var svcList = document.querySelector('.svc-list');
      if (svcList) {
        svcList.innerHTML = settings.services.map(function (s) {
          return '<li class="svc-item">' +
            '<div class="svc-row"><span class="svc-name">' + esc(s.name) + '</span>' +
            '<span class="svc-plus">+</span></div>' +
            '<div class="svc-drawer"><div class="svc-drawer-in">' + esc(s.description) + '</div></div>' +
            '</li>';
        }).join('');
        attachAccordion(svcList);
      }
    }
  }

  /* ─── Category filter ────────────────────────────────────────────── */
  (function () {
    var filterBar = document.querySelector('.filter-bar');
    if (!filterBar) return;
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.flt');
      if (!btn) return;
      filterBar.querySelectorAll('.flt').forEach(function (b) { b.classList.remove('on'); });
      btn.classList.add('on');
      var filt = btn.getAttribute('data-filt') || 'tous';
      // Grid cards
      document.querySelectorAll('#et-grid .et-card').forEach(function (el) {
        var cat = el.getAttribute('data-cat') || '';
        el.style.display = (filt === 'tous' || cat === filt) ? '' : 'none';
      });
      // List items
      document.querySelectorAll('#et-list .et-list-item').forEach(function (el) {
        var cat = el.getAttribute('data-cat') || '';
        if (!cat) {
          var idx = parseInt(el.getAttribute('data-post'), 10);
          var post = window.__CORVYN_POSTS && window.__CORVYN_POSTS[idx];
          cat = (post && post.filterTag) ? post.filterTag : '';
        }
        el.style.display = (filt === 'tous' || cat === filt) ? '' : 'none';
      });
    });
  })();

  /* ─── Fetch from /api/content ─────────────────────────────────────── */
  // Update post cover image when an article is opened
  fetch('/api/content')
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function (data) {
      if (data && (data.articles.length || data.settings.heroImageUrl)) {
        applyContent(data);
      }
    })
    .catch(function (err) {
      // Silent fail — hardcoded fallback content stays visible
      console.warn('[CORVYN] Sanity content unavailable, using fallback.', err);
    });
})();
