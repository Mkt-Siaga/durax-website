// Página: Onde comprar — distribuidores Durax, ordenados pela proximidade do CEP digitado e filtráveis por estado.
(function () {
  // ===== Distribuidores (edite aqui) =====
  var REVENDAS = [
    { nome: 'Sargento', razao: 'Sargento Ferragens Ltda.', cnpj: '31.555.733/0001-16',
      endereco: 'Rodovia Washington Luiz, 14574, Quadra 5, Lotes 6 e 33 — Santa Cruz da Serra, Duque de Caxias/RJ',
      uf: 'RJ', cep: '25265-008', site: 'https://sargentoferragens.com.br/', tel: '(21) 2757-5709' },
    { nome: 'Rei das Ferragens', razao: 'Nova Distribuidora de Ferragens Ltda.', cnpj: '02.595.626/0001-13',
      endereco: 'Rodovia Boiadeira GYN23, s/n, Quadra Área, Lote Área, Galpão 01 — Fazenda Salinos, Goiânia/GO',
      uf: 'GO', cep: '74396-095', site: 'https://www.reidaferragem.com.br/', tel: '(62) 3221-7700' },
    { nome: 'Parceirão', razao: 'A. O. Martins Importação e Exportação Ltda.', cnpj: '07.409.655/0001-67',
      endereco: 'Avenida Transcontinental, 2976 — Primavera, Ji-Paraná/RO',
      uf: 'RO', cep: '76914-688', site: 'https://www.parceiraoatacadista.com.br/', tel: '(69) 3424-7174' },
    { nome: 'Abreu & Silva', razao: 'Abreu & Silva Distribuidor Ltda.', cnpj: '04.790.656/0001-06',
      endereco: "Rua Padre José de Souza Leite, 265 — Ariado, Olho d'Água das Flores/AL",
      uf: 'AL', cep: '57442-000', site: 'https://www.abreuesilva.com.br/', tel: '(81) 3771-0320' },
    { nome: 'Thibabem', razao: 'Comercial & Distribuidora Thibabem Ltda.', cnpj: '65.359.911/0001-55',
      endereco: 'Avenida Manuel Vida, 1580 — Imaculada Conceição, Varginha/MG',
      uf: 'MG', cep: '37070-025', site: 'https://thibabem.com.br/', tel: '(35) 3690-3100' }
  ];
  var TODOS = 'Todos os estados';

  var form = document.getElementById('oc-busca');
  var campoCep = document.getElementById('oc-cep');
  var campoUf = document.getElementById('oc-tipo');
  var titulo = document.getElementById('oc-titulo');
  var itens = document.getElementById('oc-itens');
  if (!form || !itens) return;

  // Opções do filtro: estados que têm distribuidor
  REVENDAS.map(function (r) { return r.uf; }).filter(function (u, i, a) { return a.indexOf(u) === i; }).sort()
    .forEach(function (uf) { var o = document.createElement('option'); o.textContent = uf; campoUf.appendChild(o); });

  var buscado = '';

  function el(tag, cls, texto) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (texto != null) e.textContent = texto;
    return e;
  }
  function link(cls, href, texto, externo) {
    var a = el('a', cls, texto); a.href = href;
    if (externo) { a.target = '_blank'; a.rel = 'noopener'; }
    return a;
  }
  var numeros = function (s) { return (s || '').replace(/\D/g, ''); };

  // Proximidade aproximada pelo CEP: a faixa inicial do CEP corresponde à região/estado.
  function distanciaCep(cepA, cepB) {
    var a = numeros(cepA), b = numeros(cepB);
    if (a.length < 5 || b.length < 5) return Infinity;
    return Math.abs(parseInt(a.slice(0, 5), 10) - parseInt(b.slice(0, 5), 10));
  }

  function render() {
    var uf = campoUf.value;
    var lista = REVENDAS.filter(function (r) { return uf === TODOS || r.uf === uf; });
    var cepOk = numeros(buscado).length >= 5;
    if (cepOk) lista = lista.slice().sort(function (x, y) { return distanciaCep(buscado, x.cep) - distanciaCep(buscado, y.cep); });
    titulo.textContent = cepOk ? 'Distribuidores mais próximos de ' + buscado : 'Distribuidores Durax';
    itens.innerHTML = '';
    if (!lista.length) {
      itens.appendChild(el('p', 'oc-vazio', 'Nenhum distribuidor neste estado.'));
      return;
    }
    lista.forEach(function (r, i) {
      var card = el('div', 'oc-revenda');
      var tag = 'DISTRIBUIDOR · ' + r.uf + (cepOk && i === 0 && numeros(buscado)[0] === numeros(r.cep)[0] ? ' · MAIS PRÓXIMO' : '');
      card.appendChild(el('span', 'oc-revenda-tag', tag));
      card.appendChild(el('span', 'oc-revenda-nome', r.nome));
      card.appendChild(el('span', 'oc-revenda-end', r.endereco + ' · CEP ' + r.cep));
      var contato = el('span', 'oc-revenda-contato');
      contato.appendChild(link('', 'tel:+55' + numeros(r.tel), r.tel));
      contato.appendChild(link('', r.site, r.site.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') + ' ↗', true));
      card.appendChild(contato);
      itens.appendChild(card);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    buscado = campoCep.value.trim();
    render();
  });
  campoUf.addEventListener('change', render);

  // A Home envia para onde-comprar.html#cep=00000-000: preenche o campo e já aplica a busca.
  function lerHash() {
    var m = location.hash.match(/cep=([^&]+)/);
    if (!m) return;
    try { buscado = decodeURIComponent(m[1]); } catch (err) { buscado = m[1]; }
    campoCep.value = buscado;
  }
  window.addEventListener('hashchange', function () { lerHash(); render(); });
  lerHash();
  render();
})();
