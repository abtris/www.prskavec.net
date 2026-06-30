/* jshint esversion: 11, browser: true */
// Search overlay for prskavec.net — queries the Algolia blog_hugo index
// directly via REST (the key below is a search-only key, safe to expose).
//
// UI: command-palette modal opened via the header button or the "/" key.
// Keyboard: ↑↓ to move, Enter to open, Esc to close.

(function () {
  'use strict';

  const APP_ID = 'MVMZX0V323';
  const SEARCH_KEY = 'fb75ba39d4a2a4dbd39e69a66cff0777';
  const INDEX = 'blog_hugo';
  const ENDPOINT = `https://${APP_ID}-dsn.algolia.net/1/indexes/${INDEX}/query`;
  const HITS_PER_PAGE = 8;
  const DEBOUNCE_MS = 180;

  // Friendly section labels for the result chips.
  const SECTION_LABELS = {
    talk: 'Talk',
    post: 'Writing',
    reader: 'Reader',
    courses: 'Course',
    authors: 'About',
  };

  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const empty = document.getElementById('search-empty');
  const triggers = document.querySelectorAll('[data-search-trigger]');

  if (!overlay || !input || !results) return;

  let selectedIndex = 0;
  let currentHits = [];
  let debounceTimer = null;
  let abortController = null;

  function open() {
    overlay.dataset.open = 'true';
    document.body.style.overflow = 'hidden';
    setTimeout(() => input.focus(), 30);
  }

  function close() {
    overlay.dataset.open = 'false';
    document.body.style.overflow = '';
    input.value = '';
    currentHits = [];
    selectedIndex = 0;
    results.innerHTML = '';
    if (empty) empty.dataset.visible = 'true';
  }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);
  }

  function highlight(html) {
    // Algolia returns _highlightResult fragments with <em>...</em> wrappers
    // marking matched terms — keep those, but escape everything else.
    if (!html) return '';
    // Split on <em>...</em>, escape outside, leave inside (but escape its
    // content too — Algolia values shouldn't contain raw HTML, but be safe).
    return html.replace(/<em>([\s\S]*?)<\/em>/g, (_, inner) =>
      `<mark>${escapeHTML(inner)}</mark>`
    ).replace(/<(?!\/?mark>)/g, '&lt;');
  }

  function renderHits(hits) {
    currentHits = hits || [];
    selectedIndex = 0;
    if (!currentHits.length) {
      results.innerHTML = '';
      if (empty) {
        empty.dataset.visible = 'true';
        empty.textContent = input.value.trim() ?
          `No results for “${input.value.trim()}”.` :
          'Try a search above.';
      }
      return;
    }
    if (empty) empty.dataset.visible = 'false';

    results.innerHTML = currentHits.map((hit, i) => {
      const sectionLabel = SECTION_LABELS[hit.section] || hit.section || 'Page';
      const titleH = (hit._highlightResult && hit._highlightResult.title && hit._highlightResult.title.value) || escapeHTML(hit.title || '');
      const summary =
        (hit._highlightResult && hit._highlightResult.summary && hit._highlightResult.summary.value) ||
        (hit._snippetResult && hit._snippetResult.content && hit._snippetResult.content.value) ||
        escapeHTML((hit.summary || '').slice(0, 180));
      return `
        <li>
          <a href="${escapeHTML(hit.relpermalink || hit.permalink || '#')}"
             class="search-hit"
             data-i="${i}"
             aria-selected="${i === selectedIndex}">
            <span class="search-hit-section">${escapeHTML(sectionLabel)}</span>
            <span class="search-hit-body">
              <span class="search-hit-title">${highlight(titleH)}</span>
              ${summary ? `<span class="search-hit-summary">${highlight(summary)}</span>` : ''}
            </span>
            <span class="search-hit-arrow" aria-hidden="true">↗</span>
          </a>
        </li>
      `;
    }).join('');

    bindHitMouseHandlers();
  }

  function bindHitMouseHandlers() {
    results.querySelectorAll('.search-hit').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        selectedIndex = Number(el.dataset.i);
        updateSelection();
      });
    });
  }

  function updateSelection() {
    const hits = results.querySelectorAll('.search-hit');
    hits.forEach((el, i) => {
      el.setAttribute('aria-selected', i === selectedIndex ? 'true' : 'false');
      if (i === selectedIndex) el.scrollIntoView({ block: 'nearest' });
    });
  }

  async function runSearch(query) {
    if (abortController) abortController.abort();
    abortController = new AbortController();

    if (!query.trim()) {
      renderHits([]);
      return;
    }
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'X-Algolia-Application-Id': APP_ID,
          'X-Algolia-API-Key': SEARCH_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          hitsPerPage: HITS_PER_PAGE,
          attributesToSnippet: ['content:24', 'summary:24'],
          highlightPreTag: '<em>',
          highlightPostTag: '</em>',
        }),
        signal: abortController.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      renderHits(data.hits || []);
    } catch (err) {
      if (err.name === 'AbortError') return;
      if (empty) {
        empty.dataset.visible = 'true';
        empty.textContent = 'Search is temporarily unavailable.';
      }
      results.innerHTML = '';
    }
  }

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => runSearch(input.value), DEBOUNCE_MS);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentHits.length) {
        selectedIndex = (selectedIndex + 1) % currentHits.length;
        updateSelection();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentHits.length) {
        selectedIndex = (selectedIndex - 1 + currentHits.length) % currentHits.length;
        updateSelection();
      }
    } else if (e.key === 'Enter') {
      if (currentHits.length) {
        e.preventDefault();
        const hit = currentHits[selectedIndex];
        if (hit) {
          window.location.href = hit.relpermalink || hit.permalink;
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  });

  overlay.addEventListener('click', (e) => {
    // Click on the backdrop (not the inner panel) closes
    if (e.target === overlay || e.target.hasAttribute('data-search-close')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.dataset.open === 'true') {
      e.preventDefault();
      close();
      return;
    }

    // "/" opens the overlay (GitHub-style); skipped when the user is typing
    // in any form field so they can still type a literal slash there.
    if (e.key === '/' && overlay.dataset.open !== 'true') {
      const tag = (e.target.tagName || '').toLowerCase();
      const editable = e.target.isContentEditable || tag === 'input' || tag === 'textarea' || tag === 'select';
      if (!editable) {
        e.preventDefault();
        open();
      }
    }
  });

  triggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    });
  });
})();
