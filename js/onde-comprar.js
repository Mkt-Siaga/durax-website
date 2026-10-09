// Página: Onde comprar — distribuidores Durax, ordenados pela proximidade do CEP digitado e filtráveis por estado.
(function () {
  // ===== Distribuidores (edite aqui) =====
  // lat/lng: posição do pino no mapa (pode pegar no Google Maps: clique direito no local → coordenadas).
  var REVENDAS = [
    { nome: 'Sargento', razao: 'Sargento Ferragens Ltda.', cnpj: '31.555.733/0001-16',
      endereco: 'Rodovia Washington Luiz, 14574, Quadra 5, Lotes 6 e 33 — Santa Cruz da Serra, Duque de Caxias/RJ',
      uf: 'RJ', cep: '25265-008', site: 'https://sargentoferragens.com.br/', tel: '(21) 2757-5709', lat: -22.7102, lng: -43.2904 },
    { nome: 'Rei das Ferragens', razao: 'Nova Distribuidora de Ferragens Ltda.', cnpj: '02.595.626/0001-13',
      endereco: 'Rodovia Boiadeira GYN23, s/n, Quadra Área, Lote Área, Galpão 01 — Fazenda Salinos, Goiânia/GO',
      uf: 'GO', cep: '74396-095', site: 'https://www.reidaferragem.com.br/', tel: '(62) 3221-7700', lat: -16.6809, lng: -49.2533 }, // pino no centro de Goiânia (endereço não localizado no mapa)
    { nome: 'Parceirão', razao: 'A. O. Martins Importação e Exportação Ltda.', cnpj: '07.409.655/0001-67',
      endereco: 'Avenida Transcontinental, 2976 — Primavera, Ji-Paraná/RO',
      uf: 'RO', cep: '76914-688', site: 'https://www.parceiraoatacadista.com.br/', tel: '(69) 3424-7174', lat: -10.8857, lng: -61.9347 },
    { nome: 'Abreu & Silva', razao: 'Abreu & Silva Distribuidor Ltda.', cnpj: '04.790.656/0001-06',
      endereco: "Rua Padre José de Souza Leite, 265 — Ariado, Olho d'Água das Flores/AL",
      uf: 'AL', cep: '57442-000', site: 'https://www.abreuesilva.com.br/', tel: '(81) 3771-0320', lat: -9.5254, lng: -37.2908 },
    { nome: 'Thibabem', razao: 'Comercial & Distribuidora Thibabem Ltda.', cnpj: '65.359.911/0001-55',
      endereco: 'Avenida Manuel Vida, 1580 — Imaculada Conceição, Varginha/MG',
      uf: 'MG', cep: '37070-025', site: 'https://thibabem.com.br/', tel: '(35) 3690-3100', lat: -21.5930, lng: -45.4488 }
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

  // ===== Mapa (Leaflet + Esri Gray Canvas escuro/claro conforme o tema do site) =====
  var mapa = null, camada = null, rotulos = null, pinos = [];
  var BRASIL = [[-33.8, -73.9], [5.3, -34.8]];
  function urlTiles() {
    var claro = document.documentElement.getAttribute('data-theme') === 'light';
    return 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/' +
      (claro ? 'World_Light_Gray_Base' : 'World_Dark_Gray_Base') + '/MapServer/tile/{z}/{y}/{x}';
  }
  function urlRotulos() { // nomes de cidades e ruas
    return urlTiles().replace('_Base/', '_Reference/');
  }
  function iniciarMapa() {
    var div = document.getElementById('oc-mapa');
    if (!div || typeof L === 'undefined') return;
    mapa = L.map(div, { scrollWheelZoom: false, zoomSnap: 0.5 }).fitBounds(BRASIL);
    camada = L.tileLayer(urlTiles(), {
      maxZoom: 16,
      attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors'
    }).addTo(mapa);
    rotulos = L.tileLayer(urlRotulos(), { maxZoom: 16 }).addTo(mapa);
    document.addEventListener('durax:tema', function () { camada.setUrl(urlTiles()); rotulos.setUrl(urlRotulos()); });
  }
  function popupHtml(r) {
    var rota = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(r.endereco + ', ' + r.cep);
    var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); };
    return '<div class="oc-popup"><span class="oc-popup-nome">' + esc(r.nome) + '</span>' +
      '<span class="oc-popup-end">' + esc(r.endereco) + '</span>' +
      '<a href="tel:+55' + numeros(r.tel) + '">' + esc(r.tel) + '</a>' +
      '<a href="' + rota + '" target="_blank" rel="noopener">COMO CHEGAR ↗</a></div>';
  }
  function marcar(nome) {
    pinos.forEach(function (p) { p.icone.classList.toggle('ativo', p.r.nome === nome); });
    [].forEach.call(itens.querySelectorAll('.oc-revenda'), function (c) { c.classList.toggle('ativo', c.dataset.nome === nome); });
  }
  function desenharPinos(lista) {
    if (!mapa) return;
    mapa.invalidateSize();
    pinos.forEach(function (p) { p.m.remove(); });
    pinos = lista.map(function (r) {
      var m = L.marker([r.lat, r.lng], {
        icon: L.divIcon({ className: '', html: '<div class="oc-pino"></div>', iconSize: [22, 22], iconAnchor: [11, 11], popupAnchor: [0, -14] }),
        title: r.nome, alt: r.nome
      }).addTo(mapa).bindPopup(popupHtml(r));
      m.on('click', function () { marcar(r.nome); });
      return { m: m, r: r, icone: m.getElement().firstChild };
    });
    if (lista.length === 1) mapa.setView([lista[0].lat, lista[0].lng], 11);
    else if (lista.length) mapa.fitBounds(L.latLngBounds(lista.map(function (r) { return [r.lat, r.lng]; })).pad(0.25));
  }
  function focar(nome) {
    var p = pinos.filter(function (x) { return x.r.nome === nome; })[0];
    if (!p) return;
    mapa.flyTo(p.m.getLatLng(), 11, { duration: 0.8 });
    p.m.openPopup(); marcar(nome);
  }
  itens.addEventListener('click', function (e) {
    if (e.target.closest('a')) return;
    var c = e.target.closest('.oc-revenda'); if (c && mapa) focar(c.dataset.nome);
  });

  function render() {
    var uf = campoUf.value;
    var lista = REVENDAS.filter(function (r) { return uf === TODOS || r.uf === uf; });
    var cepOk = numeros(buscado).length >= 5;
    if (cepOk) lista = lista.slice().sort(function (x, y) { return distanciaCep(buscado, x.cep) - distanciaCep(buscado, y.cep); });
    titulo.textContent = cepOk ? 'Distribuidores mais próximos de ' + buscado : 'Distribuidores Durax';
    itens.innerHTML = '';
    if (!lista.length) {
      itens.appendChild(el('p', 'oc-vazio', 'Nenhum distribuidor neste estado.'));
      desenharPinos([]);
      return;
    }
    lista.forEach(function (r, i) {
      var card = el('div', 'oc-revenda');
      card.dataset.nome = r.nome;
      card.title = 'Ver no mapa';
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
    desenharPinos(lista);
    // Com CEP buscado, destaca o mais próximo no mapa
    if (cepOk && mapa) focar(lista[0].nome);
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
  iniciarMapa();
  render();
})();
