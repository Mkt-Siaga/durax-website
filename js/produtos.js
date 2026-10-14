// Catálogo filtrável da página de produtos. Dados em js/catalogo.js (window.DURAX_CATALOGO).
(function () {
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

  // versoes: [[código SIAGA, descrição], ...]
  const textoVersoes = it => (it.versoes || []).map(v => v[0] + ' ' + v[1]).join(' ');

  function card(it, nq) {
    const d = window.DuraxCatalogo.destino(it);
    const temPagina = it.pages && it.pages.length;
    // Sem foto: aviso neutro (o ícone da categoria parecia outro produto)
    const foto = it.img
      ? '<img src="' + esc(it.img) + '" alt="' + esc(it.name) + '" loading="lazy">'
      : '<div class="sem-foto"><img src="assets/logo/durax-logo-preto.png" alt=""><span>Foto em breve</span></div>';
    const rodape = (it.novo ? 'Lançamento · ' : '') + (temPagina ? 'Pág. ' + it.pages.join(', ') : '');
    const link = '<a class="produto" href="' + d.href + '"' + (d.externo ? ' target="_blank" rel="noopener"' : '') + '>' +
      '<div class="produto-foto">' + foto + '</div>' +
      '<div class="produto-info">' +
        '<span class="produto-cat">' + esc(it.cat) + '</span>' +
        '<span class="produto-nome">' + esc(it.name) + '</span>' +
        '<span class="produto-rodape"><span>' + rodape + '</span><span>' + d.cta + '</span></span>' +
      '</div></a>';
    const v = it.versoes || [];
    if (!v.length) return '<div class="produto-card">' + link + '</div>';
    // Na busca, abre a lista e destaca as versões que batem
    const acha = x => nq && norm(x[0] + ' ' + x[1]).includes(nq);
    const algumaBate = v.some(acha);
    const linhas = v.map(x =>
      '<li' + (acha(x) ? ' class="bate"' : '') + '><code>' + esc(x[0]) + '</code><span>' + esc(x[1]) + '</span></li>').join('');
    return '<div class="produto-card">' + link +
      '<details class="produto-versoes"' + (algumaBate ? ' open' : '') + '>' +
        '<summary>' + v.length + (v.length === 1 ? ' versão' : ' versões') + '</summary>' +
        '<ul>' + linhas + '</ul></details></div>';
  }

  function render() {
    const nq = norm(estado.q.trim());
    const bate = it => !nq || norm(it.name + ' ' + (it.variants || []).join(' ') + ' ' + textoVersoes(it) + ' ' + it.cat).includes(nq);
    const filtrados = todos.filter(bate);

    const cats = [{ label: 'Todas as categorias', i: -1, n: filtrados.length },
      ...dados.map((c, i) => ({ label: c.name, i, n: filtrados.filter(it => it.ci === i).length }))];
    elCats.innerHTML = cats.map(c =>
      '<button type="button" data-cat="' + c.i + '"' + (c.i === estado.cat ? ' class="ativo" aria-pressed="true"' : ' aria-pressed="false"') + '>' +
      '<span>' + esc(c.label) + '</span><small>' + c.n + '</small></button>').join('');

    const itens = filtrados.filter(it => estado.cat < 0 || it.ci === estado.cat);
    elGrade.innerHTML = itens.map(it => card(it, nq)).join('');
    // Rola cada lista aberta até a primeira versão encontrada na busca
    elGrade.querySelectorAll('.produto-versoes[open] ul').forEach(ul => {
      const b = ul.querySelector('.bate'); if (b) ul.scrollTop = b.offsetTop - ul.offsetTop - 8;
    });
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
