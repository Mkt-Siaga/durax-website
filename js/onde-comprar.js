// Página: Onde comprar — busca por CEP + filtro por tipo de revenda.
(function () {
  // ===== Dados das revendas (edite aqui) =====
  // tipo: 'Loja de material de construção' | 'Home center' | 'Atacado / distribuidor'
  //       (precisa ser igual ao texto das opções do <select id="oc-tipo">)
  // distancia: texto exibido na etiqueta (ex.: '1,2 km').
  // cep: opcional, reservado para a futura busca por proximidade.
  // TODO: substituir pelos dados reais / conectar à base de revendas Durax.
  var REVENDAS = [
    { tipo: 'Loja de material de construção', distancia: '1,2 km', nome: 'Nome da revenda', endereco: 'Endereço, bairro – cidade/UF', cep: '' },
    { tipo: 'Home center', distancia: '3,8 km', nome: 'Nome da revenda', endereco: 'Endereço, bairro – cidade/UF', cep: '' },
    { tipo: 'Atacado / distribuidor', distancia: '6,5 km', nome: 'Nome da revenda', endereco: 'Endereço, bairro – cidade/UF', cep: '' }
  ];
  var TODOS = 'Todos os tipos';

  var form = document.getElementById('oc-busca');
  var campoCep = document.getElementById('oc-cep');
  var campoTipo = document.getElementById('oc-tipo');
  var titulo = document.getElementById('oc-titulo');
  var itens = document.getElementById('oc-itens');
  if (!form || !itens) return;

  var buscado = '';

  function el(tag, cls, texto) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (texto != null) e.textContent = texto;
    return e;
  }

  function render() {
    var tipo = campoTipo.value;
    var lista = REVENDAS.filter(function (r) { return tipo === TODOS || r.tipo === tipo; });
    titulo.textContent = buscado ? 'Revendas próximas a ' + buscado : 'Revendas próximas';
    itens.innerHTML = '';
    if (!lista.length) {
      itens.appendChild(el('p', 'oc-vazio', 'Nenhuma revenda encontrada para este tipo.'));
      return;
    }
    lista.forEach(function (r) {
      var card = el('div', 'oc-revenda');
      card.appendChild(el('span', 'oc-revenda-tag', (r.tipo + ' · ' + r.distancia).toUpperCase()));
      card.appendChild(el('span', 'oc-revenda-nome', r.nome));
      card.appendChild(el('span', 'oc-revenda-end', r.endereco));
      itens.appendChild(card);
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // TODO: integrar busca real por CEP (base de revendas / geolocalização).
    buscado = campoCep.value.trim();
    render();
  });
  campoTipo.addEventListener('change', render);

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
