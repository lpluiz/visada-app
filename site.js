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

// Entrada ao rolar: fade + sobe. Os elementos de cima já vêm marcados no HTML (sem piscar);
// os de baixo são marcados aqui, com defasagem por grupo. Quem pede menos movimento vê tudo parado.
(function () {
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const grupos = [['.cabeca', 0], ['.etapas > li', 0.09], ['.modelos > article', 0.08], ['#recursos > article', 0.1], ['.doc-texto', 0], ['.doc-previa', 0.08], ['.baixar', 0], ['.autor > div', 0], ['.autor > a', 0.08]];
  grupos.forEach(([sel, passo]) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.setAttribute('data-reveal', '');
      if (passo && i) el.style.setProperty('--rd', (i * passo).toFixed(2) + 's');
    });
  });
  const alvos = document.querySelectorAll('[data-reveal]');
  if (reduz || !('IntersectionObserver' in window)) { alvos.forEach((e) => e.classList.add('in')); return; }
  const io = new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
      if (e.target.dataset.reveal === 'num') contar(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  alvos.forEach((e) => io.observe(e));

  function contar(div) {
    const b = div.querySelector('b'); if (!b) return;
    const m = b.textContent.trim().match(/^([\d.]+)(.*)$/); if (!m) return;
    const fim = b.textContent.trim(), alvo = parseInt(m[1].replace(/\./g, ''), 10), suf = m[2];
    if (!isFinite(alvo)) return;
    const dur = 900, t0 = performance.now();
    (function passo(t) {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      if (p < 1) { b.textContent = Math.round(alvo * e).toLocaleString('pt-BR') + suf; requestAnimationFrame(passo); }
      else b.textContent = fim;
    })(t0);
  }
})();
