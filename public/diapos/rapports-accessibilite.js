// Corrige uniquement la navigation de l’enveloppe du rapport Playwright exporté.
// Les résultats, traces et données du rapport d’origine restent intacts.
(() => {
  const style = document.createElement('style');
  style.textContent = '.version { color: inherit !important; opacity: 1 !important; }';
  document.head.append(style);
  const corriger = () => {
    document.querySelectorAll('a[aria-selected]:not([role="tab"])').forEach(a => {
      if (a.getAttribute('aria-selected') === 'true') a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
      a.removeAttribute('aria-selected');
    });
    document.querySelectorAll('textarea:not([aria-label]):not([aria-labelledby])').forEach(el => el.setAttribute('aria-label', 'Source code'));
  };
  corriger();
  new MutationObserver(corriger).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-selected'] });
})();
