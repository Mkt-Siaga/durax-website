// Categoria Painéis LED: filtros (formato, instalação, potência, temperatura de cor, cor) e ordenação.
// Dados dos painéis em js/paineis.js (window.DURAX_PAINEIS).
(function () {
  const PRODUTOS = window.DURAX_PAINEIS || [];
  const FACETAS = [
    { k: 'formato', label: 'FORMATO', opts: ['Redondo', 'Quadrado'] },
    { k: 'instalacao', label: 'INSTALAÇÃO', opts: ['Embutir', 'Sobrepor'] },
    { k: 'potencia', label: 'POTÊNCIA', opts: [6, 12, 18, 24], fmt: v => v + 'W' },
    { k: 'temp', label: 'TEMPERATURA DE COR', opts: [3000, 4000, 6500], fmt: v => v + 'K' },
    { k: 'cor', label: 'COR', opts: ['Branco', 'Preto'] }
  ];
  const CHECK = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#171717" stroke-width="2.2" aria-hidden="true"><polyline points="1.5,5 4,7.5 8.5,2.5"/></svg>';
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (f, v) => f.fmt ? f.fmt(v) : v;

  const elFacetas = document.getElementById('facetas');
  const elChips = document.getElementById('chips');
  const elGrade = document.getElementById('grade');
  const elTotal = document.getElementById('total');
  const elVazio = document.getElementById('vazio');
  const elOrdenar = document.getElementById('ordenar');
  const elLimpar = document.querySelector('.filtros [data-limpar]');

  const estado = { sel: {}, sort: 'rel' };

  // Passa nos filtros ativos (ignorando a faceta `pular`, para as contagens)
  const passa = (p, pular) => FACETAS.every(f => f.k === pular || !(estado.sel[f.k] || []).length || estado.sel[f.k].includes(p[f.k]));

  function alternar(k, v) {
    const cur = estado.sel[k] || [];
    estado.sel[k] = cur.includes(v) ? cur.filter(x => x !== v) : cur.concat(v);
    render();
  }

  function card(p) {
    return '<a class="painel" href="produto.html#p=' + p.i + '">' +
      '<div class="painel-foto"><img src="assets/site/painel-led.png" alt="' + esc(p.name) + '" loading="lazy"></div>' +
      '<div class="painel-info">' +
        '<div class="painel-tags"><span class="tag-forte">' + p.potencia + 'W</span><span class="tag">' + p.temp + 'K</span><span class="tag">' + esc(p.instalacao) + '</span></div>' +
        '<span class="painel-nome">' + esc(p.name) + '</span>' +
        '<span class="painel-ean">EAN: a informar</span>' +
      '</div></a>';
  }

  function render() {
    let itens = PRODUTOS.filter(p => passa(p));
    if (estado.sort === 'up') itens = itens.slice().sort((a, b) => a.potencia - b.potencia);
    if (estado.sort === 'down') itens = itens.slice().sort((a, b) => b.potencia - a.potencia);

    elFacetas.innerHTML = FACETAS.map(f =>
      '<div class="faceta" role="group" aria-labelledby="faceta-' + f.k + '">' +
        '<span class="faceta-rotulo" id="faceta-' + f.k + '">' + f.label + '</span>' +
        f.opts.map(v => {
          const on = (estado.sel[f.k] || []).includes(v);
          const n = PRODUTOS.filter(p => p[f.k] === v && passa(p, f.k)).length;
          return '<button type="button" class="opcao" data-k="' + f.k + '" data-v="' + esc(v) + '" aria-pressed="' + on + '">' +
            '<span class="opcao-caixa">' + CHECK + '</span>' +
            '<span class="opcao-nome">' + esc(fmt(f, v)) + '</span><span class="opcao-qtd">' + n + '</span></button>';
        }).join('') +
      '</div>').join('');

    const chips = FACETAS.flatMap(f => (estado.sel[f.k] || []).map(v =>
      '<button type="button" class="chip" data-k="' + f.k + '" data-v="' + esc(v) + '" aria-label="Remover filtro ' + esc(fmt(f, v)) + '">' + esc(fmt(f, v)) + ' ✕</button>'));
    elChips.innerHTML = chips.join('');
    elChips.hidden = !chips.length;
    elLimpar.hidden = !chips.length;

    elGrade.innerHTML = itens.map(card).join('');
    elTotal.textContent = itens.length;
    elVazio.hidden = itens.length > 0;
  }

  function aoClicarFiltro(e) {
    const b = e.target.closest('button[data-k]'); if (!b) return;
    const f = FACETAS.find(x => x.k === b.dataset.k);
    const v = f.opts.find(o => String(o) === b.dataset.v);
    alternar(f.k, v);
    // Mantém o foco no mesmo botão após redesenhar
    const mesmo = e.currentTarget.querySelector('button[data-k="' + f.k + '"][data-v="' + b.dataset.v + '"]');
    if (mesmo) mesmo.focus(); else elFacetas.querySelector('button[data-k="' + f.k + '"]').focus();
  }
  elFacetas.addEventListener('click', aoClicarFiltro);
  elChips.addEventListener('click', aoClicarFiltro);
  document.querySelectorAll('[data-limpar]').forEach(b => b.addEventListener('click', () => { estado.sel = {}; render(); }));
  elOrdenar.addEventListener('change', () => { estado.sort = elOrdenar.value; render(); });

  render();
})();
