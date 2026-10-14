// Utilitários compartilhados pelas páginas de catálogo (produtos, produto, categoria).
(function () {
  // Endereço de um produto: produto.html#p=<slug do nome>
  const slug = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  window.DuraxCatalogo = {
    slug,
    MIN_VARIACOES: 2, // a partir de quantas versões o produto ganha a página "Ver variações"
    linkProduto: it => 'produto.html#p=' + slug(it.name),
    temVariacoes: it => (it.versoes || []).length >= 2,
    // Para onde o card leva: 2+ versões → página do produto; senão, a página do catálogo PDF; senão, WhatsApp
    destino(it) {
      if (this.temVariacoes(it)) return { href: this.linkProduto(it), externo: false, cta: 'VER VARIAÇÕES →' };
      if (it.pages && it.pages.length) return { href: 'assets/catalogo/catalogo-durax-2026.pdf#page=' + it.pages[0], externo: true, cta: 'VER NO CATÁLOGO →' };
      return { href: 'https://wa.me/5511914829870?text=' + encodeURIComponent('Olá! Quero saber mais sobre: ' + it.name), externo: true, cta: 'CONSULTAR →' };
    },
    // Procura um produto pelo slug; devolve { it, ci, cat }
    acharProduto(s) {
      const dados = window.DURAX_CATALOGO || [];
      for (let ci = 0; ci < dados.length; ci++) {
        const it = dados[ci].items.find(x => slug(x.name) === s);
        if (it) return { it, ci, cat: dados[ci].name };
      }
      return null;
    }
  };
})();
