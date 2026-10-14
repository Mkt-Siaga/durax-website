// Painéis LED (página categoria.html): monta a lista a partir das versões reais do catálogo
// (js/catalogo.js), lendo formato, instalação, potência, temperatura, corpo e cor da descrição.
window.DURAX_PAINEIS = (function () {
  const dados = window.DURAX_CATALOGO || [];
  const U = window.DuraxCatalogo;
  const lista = [];
  dados.forEach(c => c.items.forEach(it => {
    if (!/^Painel (de )?LED/i.test(it.name)) return;
    (it.versoes || []).forEach(v => {
      const d = (v[1] || '').toUpperCase();
      const formato = /REDOND/.test(d) ? 'Redondo' : /QUADRAD/.test(d) ? 'Quadrado' : (/redondo/i.test(it.name) ? 'Redondo' : 'Quadrado');
      const instalacao = /SOBREP|\bSOB\b/.test(d) ? 'Sobrepor' : /EMBUT|\bEMBU?\b/.test(d) ? 'Embutir' : (/sob/i.test(it.name) ? 'Sobrepor' : 'Embutir');
      const pw = d.match(/(\d+)\s*W\b/), tk = d.match(/(\d{4})\s*K\b/);
      const corpo = /ALUM/.test(d) ? 'Alumínio' : 'Plástico';
      const cor = /PRET/.test(d) ? 'Preto' : 'Branco';
      const potencia = pw ? +pw[1] : null, temp = tk ? +tk[1] : null;
      lista.push({
        i: lista.length, codigo: v[0], descricao: v[1],
        name: 'Painel LED ' + formato.toLowerCase() + ' de ' + instalacao.toLowerCase() + (potencia ? ' ' + potencia + 'W' : '') + (temp ? ' ' + temp + 'K' : '') + (corpo === 'Alumínio' ? ' alumínio' : '') + (cor === 'Preto' ? ' preto' : ''),
        formato, instalacao, potencia, temp, corpo, cor,
        foto: it.img || ('assets/produtos/painel-led-' + instalacao.toLowerCase() + '-' + formato.toLowerCase() + '.jpg'),
        link: U ? U.linkProduto(it) : 'produtos.html'
      });
    });
  }));
  return lista;
})();
