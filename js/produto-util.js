// Utilitários compartilhados pelas páginas de catálogo (produtos, produto, categoria).
(function () {
  // Endereço de um produto: produto.html#p=<slug do nome>
  const slug = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  window.DuraxCatalogo = {
    slug,
    MIN_VARIACOES: 2, // a partir de quantas versões o produto ganha a página "Ver variações"
    linkProduto: it => 'produto.html#p=' + slug(it.name),
    temVariacoes: it => (it.versoes || []).length >= 2,
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
