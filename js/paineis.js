// Painéis LED (usados por categoria.html e produto.html). O índice na lista é o #p=N da página de produto.
// Dados provisórios (mesma lista do design); em produção, vir do ERP/catálogo.
window.DURAX_PAINEIS = [
  'PAINEL LED REDONDO DE EMBUTIR 6W 6500K BIVOLT', 'PAINEL LED REDONDO DE EMBUTIR 12W 6500K BIVOLT', 'PAINEL LED REDONDO DE EMBUTIR 18W 6500K BIVOLT',
  'PAINEL LED QUADRADO DE EMBUTIR 6W 6500K BIVOLT', 'PAINEL LED QUADRADO DE EMBUTIR 12W 6500K BIVOLT', 'PAINEL LED QUADRADO DE EMBUTIR 18W 6500K BIVOLT',
  'PAINEL LED REDONDO DE SOBREPOR 12W 6500K BIVOLT', 'PAINEL LED REDONDO DE SOBREPOR 18W 6500K BIVOLT', 'PAINEL LED REDONDO DE SOBREPOR 24W 6500K BIVOLT',
  'PAINEL LED QUADRADO DE SOBREPOR 12W 6500K BIVOLT', 'PAINEL LED QUADRADO DE SOBREPOR 18W 6500K BIVOLT', 'PAINEL LED QUADRADO DE SOBREPOR 24W 6500K BIVOLT',
  'PAINEL LED REDONDO DE EMBUTIR 24W 6500K BIVOLT', 'PAINEL LED QUADRADO DE EMBUTIR 24W 6500K BIVOLT', 'PAINEL LED REDONDO DE EMBUTIR 12W 3000K BIVOLT',
  'PAINEL LED REDONDO DE EMBUTIR 18W 3000K BIVOLT', 'PAINEL LED QUADRADO DE SOBREPOR 24W 4000K PRETO', 'PAINEL LED QUADRADO DE EMBUTIR 18W 6500K PRETO',
  'PAINEL LED QUADRADO DE PLÁSTICO EMB 18W 6500K', 'PAINEL LED QUADRADO DE PLÁSTICO SOBR 18W 6500K', 'PAINEL LED QUADRADO DE PLÁSTICO SOBR 24W 6500K', 'PAINEL LED QUADRADO DE PLÁSTICO EMB 24W 6500K'
].map((n, i) => {
  const formato = n.includes('REDONDO') ? 'Redondo' : 'Quadrado';
  const instalacao = /EMBUTIR|\bEMB\b/.test(n) ? 'Embutir' : 'Sobrepor';
  const potencia = +n.match(/(\d+)W/)[1], temp = +n.match(/(\d+)K/)[1];
  const cor = n.includes('PRETO') ? 'Preto' : 'Branco', plast = n.includes('PLÁSTICO'), bivolt = n.includes('BIVOLT');
  const name = 'Painel LED ' + formato + (plast ? ' de plástico' : '') + ' de ' + instalacao.toLowerCase() + ' ' + potencia + 'W ' + temp + 'K' +
    (bivolt ? ' bivolt' : '') + (cor === 'Preto' ? ' preto' : '');
  // Foto do portfólio Siaga por formato/instalação (códigos H01NB00001/05/09/13)
  const foto = 'assets/produtos/painel-led-' + instalacao.toLowerCase() + '-' + formato.toLowerCase() + '.jpg';
  return { i, name, formato, instalacao, potencia, temp, cor, plast, bivolt, foto };
});
