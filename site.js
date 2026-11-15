/* © 2026 Luiz Paulo Santos. Site do VISADA. */
'use strict';

// Abas das demonstrações (teclado: setas esquerda/direita).
(function () {
  const abas = [...document.querySelectorAll('.abas [role="tab"]')];
  const escolher = (aba, foco) => {
    abas.forEach((a) => {
      const sel = a === aba;
      a.setAttribute('aria-selected', String(sel));
      a.tabIndex = sel ? 0 : -1;
      document.getElementById(a.getAttribute('aria-controls')).hidden = !sel;
    });
    if (foco) aba.focus();
  };
  abas.forEach((a, i) => {
    a.tabIndex = i === 0 ? 0 : -1;
    a.addEventListener('click', () => escolher(a));
    a.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const n = (i + (e.key === 'ArrowRight' ? 1 : abas.length - 1)) % abas.length;
      escolher(abas[n], true);
    });
  });
})();

// Imagem ampliada.
(function () {
  const dlg = document.querySelector('.lupa');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  const img = dlg.querySelector('img'), leg = dlg.querySelector('.lupa-leg');
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.ampliar');
    if (!b) return;
    img.src = b.dataset.img;
    img.alt = (b.querySelector('img') || {}).alt || '';
    leg.textContent = b.dataset.leg || '';
    dlg.showModal();
  });
  dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('.lupa-x')) dlg.close(); });
})();
