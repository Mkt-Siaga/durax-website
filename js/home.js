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

    trilho.innerHTML = escolhidos.map(function (e, i) {
      var it = e.it, d = window.DuraxCatalogo.destino(it), n = (it.versoes || []).length;
      return '<li class="carrossel-item" style="--i:' + i + '">' +
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

    // Setas: rolam ~80% da largura visível e somem nas pontas
    var setas = document.querySelectorAll('.carrossel-seta');
    var atualizar = function () {
      var fim = trilho.scrollWidth - trilho.clientWidth;
      setas[0].disabled = trilho.scrollLeft <= 1;
      setas[1].disabled = trilho.scrollLeft >= fim - 1;
      document.querySelector('.carrossel-setas').hidden = fim <= 1;
    };
    setas.forEach(function (b) {
      b.addEventListener('click', function () {
        trilho.scrollBy({ left: +b.dataset.dir * trilho.clientWidth * 0.8, behavior: 'smooth' });
      });
    });
    trilho.addEventListener('scroll', atualizar, { passive: true });
    window.addEventListener('resize', atualizar);
    atualizar();

    // Entrada escalonada dos cards quando a seção aparece na tela
    if ('IntersectionObserver' in window) {
      trilho.classList.add('carrossel-espera');
      var obs = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { trilho.classList.add('carrossel-visivel'); obs.disconnect(); }
      }, { threshold: 0.15 });
      obs.observe(trilho);
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
