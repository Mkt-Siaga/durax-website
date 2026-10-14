// Home: carrossel de destaques, busca por CEP (leva para Onde comprar) e cadastro da newsletter.
(function () {
  // Carrossel (adaptado do "Product Carousel" do 21st.dev): um produto com foto por categoria
  // (lançamento, se houver), depois os demais lançamentos. Dados em js/catalogo.js.
  var trilho = document.getElementById('carrossel-trilho');
  if (trilho && window.DURAX_CATALOGO && window.DuraxCatalogo) {
    var esc = function (s) {
      return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
    };
    var MAX = 14;
    var escolhidos = [];
    var ja = {};
    var pega = function (it, cat) {
      if (escolhidos.length >= MAX || ja[it.name] || !it.img) return;
      ja[it.name] = true;
      escolhidos.push({ it: it, cat: cat });
    };
    window.DURAX_CATALOGO.forEach(function (c) {
      var it = c.items.find(function (x) { return x.img && x.novo; }) || c.items.find(function (x) { return x.img; });
      if (it) pega(it, c.name);
    });
    window.DURAX_CATALOGO.forEach(function (c) { c.items.forEach(function (it) { if (it.novo) pega(it, c.name); }); });

    var secao = trilho.closest('.home-carrossel');
    var barra = document.getElementById('carrossel-progresso');
    var calmo = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var cards = escolhidos.map(function (e, i) {
      var it = e.it, d = window.DuraxCatalogo.destino(it), n = (it.versoes || []).length;
      return '<li class="carrossel-item" style="--i:' + Math.min(i, 6) + '">' +
        '<a class="carrossel-card" href="' + esc(d.href) + '"' + (d.externo ? ' target="_blank" rel="noopener"' : '') + '>' +
          '<span class="carrossel-foto">' +
            '<img src="' + esc(it.img) + '" alt="' + esc(it.name) + '" loading="lazy">' +
            (it.novo ? '<span class="carrossel-selo">Lançamento</span>' : '') +
          '</span>' +
          '<span class="carrossel-info">' +
            '<span class="carrossel-cat">' + esc(e.cat) + '</span>' +
            '<span class="carrossel-nome">' + esc(it.name) + '</span>' +
            '<span class="carrossel-rodape"><span>' + (n ? n + (n === 1 ? ' versão' : ' versões') : '') + '</span><span class="carrossel-cta">' + d.cta + '</span></span>' +
          '</span>' +
        '</a></li>';
    }).join('');
    var esqueletos = new Array(7).join('<li class="carrossel-esqueleto" aria-hidden="true"><span></span><span></span><span></span></li>');

    // Setas: rolam ~80% da largura visível e somem nas pontas; a barra amarela mostra a posição
    var setas = document.querySelectorAll('.carrossel-seta');
    var atualizar = function () {
      var fim = trilho.scrollWidth - trilho.clientWidth;
      setas[0].disabled = trilho.scrollLeft <= 1;
      setas[1].disabled = trilho.scrollLeft >= fim - 1;
      document.querySelector('.carrossel-setas').hidden = fim <= 1;
      if (barra && fim > 1) {
        barra.style.setProperty('--tam', (trilho.clientWidth / trilho.scrollWidth * 100) + '%');
        barra.style.setProperty('--pos', (trilho.scrollLeft / fim) + '');
      }
    };

    // Troca os esqueletos pelos cards; cada foto sai do desfoque quando termina de carregar
    var montar = function () {
      trilho.innerHTML = cards;
      trilho.removeAttribute('aria-busy');
      // Sem scroll-snap enquanto os cards deslizam (senão o trilho "gruda" no card ainda deslocado)
      var inicio = function () { trilho.scrollTo({ left: 0, behavior: 'instant' }); };
      inicio();
      secao.classList.add('carrossel-pronto', 'carrossel-entrando');
      var itens = trilho.querySelectorAll('.carrossel-item');
      var ultimo = itens[Math.min(itens.length, 7) - 1];
      var fim = function () {
        if (!secao.classList.contains('carrossel-entrando')) return;
        secao.classList.remove('carrossel-entrando'); inicio(); atualizar();
      };
      if (ultimo) ultimo.addEventListener('animationend', fim, { once: true });
      setTimeout(fim, ultimo ? 2500 : 0); // reserva, caso o fim da animação não chegue
      trilho.querySelectorAll('.carrossel-foto img').forEach(function (img) {
        var ok = function () { img.parentNode.classList.add('carregada'); };
        if (img.complete && img.naturalWidth) ok();
        else { img.addEventListener('load', ok); img.addEventListener('error', ok); }
      });
      atualizar();
    };
    setas.forEach(function (b) {
      b.addEventListener('click', function () {
        trilho.scrollBy({ left: +b.dataset.dir * trilho.clientWidth * 0.8, behavior: 'smooth' });
      });
    });
    trilho.addEventListener('scroll', atualizar, { passive: true });
    window.addEventListener('resize', atualizar);

    // Entrada: esqueletos piscando até a seção aparecer na tela; então o cabeçalho sobe
    // e, depois de um instante de "carregamento", os cards entram um a um
    if ('IntersectionObserver' in window && !calmo) {
      trilho.innerHTML = esqueletos;
      trilho.setAttribute('aria-busy', 'true');
      secao.classList.add('carrossel-espera');
      var obs = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return;
        obs.disconnect();
        secao.classList.add('carrossel-visivel');
        setTimeout(montar, 750);
      }, { threshold: 0.2 });
      obs.observe(secao);
    } else {
      montar();
    }
  }

  var formCep = document.getElementById('form-cep');
  if (formCep) {
    formCep.addEventListener('submit', function (e) {
      e.preventDefault();
      var cep = document.getElementById('cep').value.trim();
      window.location.href = 'onde-comprar.html#cep=' + encodeURIComponent(cep);
    });
  }

  var formNews = document.getElementById('form-news');
  var ok = document.getElementById('news-ok');
  if (formNews && ok) {
    formNews.addEventListener('submit', function (e) {
      e.preventDefault();
      // TODO: integrar envio (newsletter — nome, e-mail, perfil)
      formNews.hidden = true;
      formNews.style.display = 'none';
      ok.hidden = false;
    });
  }
})();
