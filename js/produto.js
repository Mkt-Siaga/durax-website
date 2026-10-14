// Página de produto (qualquer item do catálogo): produto.html#p=<slug do nome>.
// Mostra foto, categoria, botões (catálogo PDF, onde comprar, revenda) e a tabela de variações com filtro.
(function () {
  const U = window.DuraxCatalogo;
  const PDF = 'assets/catalogo/catalogo-durax-2026.pdf';
  const WHATSAPP = 'https://wa.me/5511914829870';
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const el = id => document.getElementById(id);

  function render() {
    const m = location.hash.match(/p=([^&]+)/);
    const achado = m && U.acharProduto(decodeURIComponent(m[1]));
    if (!achado) {
      el('pd-nome').textContent = 'Produto não encontrado';
      el('pd-resumo').innerHTML = 'Veja a <a href="produtos.html">linha completa de produtos</a>.';
      el('pd-versoes-sec').hidden = true; el('pd-rel-sec').hidden = true;
      return;
    }
    const { it, ci, cat } = achado;
    const v = it.versoes || [];
    document.title = it.name + ' — Durax';
    el('pd-trilha').innerHTML = '<a href="index.html">Início</a><span>/</span><a href="produtos.html">Produtos</a><span>/</span>' +
      '<a href="produtos.html#cat=' + ci + '">' + esc(cat) + '</a><span>/</span><span aria-current="page">' + esc(it.name) + '</span>';
    el('pd-cat').textContent = cat.toUpperCase() + (it.novo ? ' · LANÇAMENTO' : '');
    el('pd-nome').textContent = it.name;
    el('pd-resumo').textContent = v.length
      ? v.length + (v.length === 1 ? ' variação disponível' : ' variações disponíveis') + ', com código e embalagem.'
      : 'Códigos, medidas e embalagens: consulte o comercial Durax.';
    el('pd-foto').innerHTML = it.img
      ? '<img src="' + esc(it.img) + '" alt="' + esc(it.name) + '">'
      : '<div class="sem-foto"><img src="assets/logo/durax-logo-preto.png" alt=""><span>Foto em breve</span></div>';
    const pag = it.pages && it.pages[0];
    el('pd-acoes').innerHTML =
      (pag ? '<a class="btn" href="' + PDF + '#page=' + pag + '" target="_blank" rel="noopener">Ver no catálogo · pág. ' + pag + '</a>' : '') +
      '<a class="btn-outline" href="onde-comprar.html">Onde comprar</a>' +
      '<a class="btn-outline" href="' + WHATSAPP + '?text=' + encodeURIComponent('Olá! Quero comprar para revenda: ' + it.name) + '" target="_blank" rel="noopener">Comprar para revenda</a>';

    // Variações
    el('pd-versoes-sec').hidden = !v.length;
    const filtrar = () => {
      const q = norm(el('pd-filtro').value.trim());
      const linhas = v.filter(x => !q || norm(x[0] + ' ' + x[1]).includes(q));
      el('pd-linhas').innerHTML = linhas.map(x => '<tr><td class="pd-cod">' + esc(x[0]) + '</td><td>' + esc(x[1]) + '</td></tr>').join('') ||
        '<tr><td colspan="2" class="pd-vazio">Nenhuma variação com "' + esc(el('pd-filtro').value) + '".</td></tr>';
      el('pd-contagem').textContent = (q ? linhas.length + ' de ' : '') + v.length + (v.length === 1 ? ' variação' : ' variações');
    };
    el('pd-filtro').value = '';
    el('pd-filtro').oninput = filtrar;
    filtrar();

    // Mais da categoria (prioriza os que têm foto)
    const outros = (window.DURAX_CATALOGO[ci].items || []).filter(x => x !== it)
      .sort((a, b) => (b.img ? 1 : 0) - (a.img ? 1 : 0)).slice(0, 4);
    el('pd-rel-sec').hidden = !outros.length;
    el('pd-relacionados').innerHTML = outros.map(x => {
      const href = U.temVariacoes(x) ? U.linkProduto(x) : (x.pages && x.pages[0] ? PDF + '#page=' + x.pages[0] : 'produtos.html#cat=' + ci);
      const ext = !U.temVariacoes(x) && x.pages && x.pages[0];
      return '<a class="pd-rel" href="' + href + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' +
        '<div class="pd-rel-foto">' + (x.img ? '<img src="' + esc(x.img) + '" alt="" loading="lazy">' : '<span>Foto em breve</span>') + '</div>' +
        '<span class="pd-rel-nome">' + esc(x.name) + '</span></a>';
    }).join('');
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);
  render();
})();
