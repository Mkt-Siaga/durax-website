// Catálogo filtrável da página de produtos. Dados em js/catalogo.js (window.DURAX_CATALOGO).
(function () {
  const PDF = 'assets/catalogo/catalogo-durax-2026.pdf';
  // Ícone da categoria usado quando o produto não tem foto
  const ICONES = [['FIXA', 'l1'], ['FERRAGENS', 'r5'], ['FERR', 'l2'], ['PERF', 'l3'], ['ILUM', 'l4'], ['HIDR', 'l5'], ['UTIL', 'l6'],
    ['SOLD', 'r1'], ['PINT', 'r2'], ['SUPO', 'r3'], ['JARD', 'r4'], ['BRIN', 'r6'], ['ABRA', 'l3']];
  const iconeDa = cat => {
    const u = cat.toUpperCase();
    const m = ICONES.find(([k]) => k === 'FERRAGENS' ? u === k : u.startsWith(k));
    return 'assets/site/icon-' + (m ? m[1] : 'l1') + '.png';
  };
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const dados = window.DURAX_CATALOGO || [];
  const todos = dados.flatMap((c, ci) => c.items.map(it => ({ ...it, ci, cat: c.name })));

  const elBusca = document.getElementById('busca');
  const elCats = document.getElementById('categorias');
  const elGrade = document.getElementById('grade');
  const elTitulo = document.getElementById('titulo');
  const elTotal = document.getElementById('total');
  const elVazio = document.getElementById('vazio');

  const estado = { cat: -1, q: '' };

  function lerUrl() {
    const cat = location.hash.match(/cat=(-?\d+)/);
    estado.cat = cat ? +cat[1] : -1;
    const q = new URLSearchParams(location.search).get('q') || (location.hash.match(/q=([^&]+)/) || [])[1];
    if (q) estado.q = decodeURIComponent(q);
    elBusca.value = estado.q;
  }

  function card(it) {
    const led = /^Painel/i.test(it.name);
    const href = led ? 'categoria.html' : PDF + '#page=' + it.pages[0];
    const foto = it.img
      ? '<img src="' + esc(it.img) + '" alt="' + esc(it.name) + '" loading="lazy">'
      : '<img class="icone" src="' + iconeDa(it.cat) + '" alt="' + esc(it.name) + '" loading="lazy">';
    const versoes = it.variants && it.variants.length
      ? '<span class="produto-versoes">Versões: ' + esc(it.variants.join(', ')) + '</span>' : '';
    return '<a class="produto" href="' + href + '"' + (led ? '' : ' target="_blank" rel="noopener"') + '>' +
      '<div class="produto-foto">' + foto + '</div>' +
      '<div class="produto-info">' +
        '<span class="produto-cat">' + esc(it.cat) + '</span>' +
        '<span class="produto-nome">' + esc(it.name) + '</span>' + versoes +
        '<span class="produto-rodape"><span>Pág. ' + it.pages.join(', ') + '</span><span>' +
          (led ? 'VER VARIAÇÕES →' : 'VER NO CATÁLOGO →') + '</span></span>' +
      '</div></a>';
  }

  function render() {
    const nq = norm(estado.q.trim());
    const bate = it => !nq || norm(it.name + ' ' + (it.variants || []).join(' ') + ' ' + it.cat).includes(nq);
    const filtrados = todos.filter(bate);

    const cats = [{ label: 'Todas as categorias', i: -1, n: filtrados.length },
      ...dados.map((c, i) => ({ label: c.name, i, n: filtrados.filter(it => it.ci === i).length }))];
    elCats.innerHTML = cats.map(c =>
      '<button type="button" data-cat="' + c.i + '"' + (c.i === estado.cat ? ' class="ativo" aria-pressed="true"' : ' aria-pressed="false"') + '>' +
      '<span>' + esc(c.label) + '</span><small>' + c.n + '</small></button>').join('');

    const itens = filtrados.filter(it => estado.cat < 0 || it.ci === estado.cat);
    elGrade.innerHTML = itens.map(card).join('');
    elTitulo.textContent = estado.cat < 0 ? 'Todos os produtos' : (dados[estado.cat] || {}).name || '';
    elTotal.textContent = itens.length;
    elVazio.hidden = itens.length > 0;
    elVazio.textContent = 'Nenhum produto encontrado para "' + estado.q + '".';
  }

  elCats.addEventListener('click', e => {
    const b = e.target.closest('button[data-cat]'); if (!b) return;
    estado.cat = +b.dataset.cat;
    try { history.replaceState(null, '', '#cat=' + estado.cat); } catch (err) {}
    render();
  });
  elBusca.addEventListener('input', () => { estado.q = elBusca.value; render(); });
  window.addEventListener('hashchange', () => { lerUrl(); render(); });

  lerUrl();
  render();
})();
