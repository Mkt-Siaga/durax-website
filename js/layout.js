// Cabeçalho e rodapé compartilhados por todas as páginas.
// Uso: <header id="site-header" data-ativo="produtos"></header> e <footer id="site-footer"></footer>
(function () {
  const WHATSAPP = 'https://wa.me/5541988597870';
  const PAGINAS = {
    inicio: 'index.html',
    produtos: 'produtos.html',
    categoria: 'categoria.html',
    produto: 'produto.html',
    onde: 'onde-comprar.html',
    blog: 'blog.html',
    sobre: 'sobre.html',
    revendedor: 'seja-revendedor.html'
  };
  const NAV = [
    { k: 'produtos', label: 'Produtos', mega: true },
    { k: 'onde', label: 'Onde comprar' },
    { k: 'blog', label: 'Blog Duráximo' },
    { k: 'sobre', label: 'Sobre' }
  ];
  // [rótulo, ícone, índice da categoria em DURAX_CATALOGO]
  const MEGA = [
    ['Fixadores, ancoragem e movimentação', 'l1', 0],
    ['Ferramentas manuais', 'l2', 1],
    ['Perfuração e acessórios', 'l3', 3],
    ['Iluminação e elétrica', 'l4', 4],
    ['Hidráulica, água e irrigação', 'l5', 5],
    ['Utilidade de obra e transporte', 'l6', 6],
    ['Solda, corte térmico e apoio', 'r1', 7],
    ['Pintura e acabamento', 'r2', 8],
    ['Suporte e instalação', 'r3', 9],
    ['Jardinagem e uso rural', 'r4', 10],
    ['Ferragens', 'r5', 11],
    ['Brindes e diversos', 'r6', 12]
  ];
  const LOGO = '<a href="' + PAGINAS.inicio + '" class="logo">' +
    '<img class="so-escuro" src="assets/logo/durax-logo-branco.png" alt="Durax">' +
    '<img class="so-claro" src="assets/logo/durax-logo-preto.png" alt="Durax"></a>';
  const LOGO_RODAPE = '<img src="assets/logo/durax-logo-branco.png" alt="Durax">';
  const ICONE_TEMA = '<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 1.5a6.5 6.5 0 0 1 0 13Z" fill="currentColor"/></svg>';
  const temaAtual = () => document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const rotuloTema = () => temaAtual() === 'light' ? 'Modo escuro' : 'Modo claro';
  const LUPA = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D8D8D3" stroke-width="2.2" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><line x1="15.5" y1="15.5" x2="21" y2="21"/></svg>';
  const SETA = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><polyline points="2,3.5 5,6.5 8,3.5"/></svg>';

  function renderHeader(el) {
    const ativo = el.dataset.ativo || '';
    const nav = NAV.map(n =>
      '<a href="' + PAGINAS[n.k] + '"' + (n.mega ? ' data-mega' : '') + (n.k === ativo ? ' class="ativo"' : '') + '>' +
      n.label + (n.mega ? SETA : '') + '</a>').join('');
    const mega = MEGA.map(([label, icon, i]) =>
      '<a href="' + PAGINAS.produtos + '#cat=' + i + '"><img src="assets/site/icon-' + icon + '.png" alt="">' + label + '</a>').join('');

    el.className = 'site-header';
    el.innerHTML =
      '<div class="topbar"><div class="container">' +
        '<span><strong>Seu estoque sempre cheio com a Durax.</strong> Receba seus pedidos em tempo recorde. ' +
        '<a class="cta" href="' + PAGINAS.revendedor + '">Garanta seu estoque</a></span>' +
        '<span class="topbar-links"><a href="' + WHATSAPP + '" target="_blank" rel="noopener">WhatsApp (41) 98859-7870</a><a href="#">Área do revendedor</a></span>' +
        '<button class="tema-toggle" type="button" aria-label="Alternar tema">' + ICONE_TEMA + '<span>' + rotuloTema() + '</span></button>' +
      '</div></div>' +
      '<div class="navbar"><div class="container">' + LOGO +
        '<nav class="nav" aria-label="Principal">' + nav + '</nav>' +
        '<div class="nav-spacer"></div>' +
        '<form class="busca-topo" action="' + PAGINAS.produtos + '" role="search">' + LUPA +
          '<input name="q" placeholder="Buscar produto ou código" aria-label="Buscar produto"></form>' +
        '<a class="btn" href="' + PAGINAS.revendedor + '">Seja revendedor</a>' +
        '<button class="menu-toggle" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '</div></div>' +
      '<div class="mega"><div class="container">' +
        '<div class="mega-cats">' + mega + '</div>' +
        '<div class="mega-promo"><span class="eyebrow">CATÁLOGO 2026</span><strong>Toda a linha Durax em um arquivo</strong>' +
        '<a class="btn" href="' + PAGINAS.inicio + '#catalogo">Baixar catálogo</a></div>' +
      '</div></div>' +
      '<div class="menu-mobile">' + NAV.map(n => '<a href="' + PAGINAS[n.k] + '">' + n.label + '</a>').join('') +
        '<a class="btn" href="' + PAGINAS.revendedor + '">Seja revendedor</a></div>';

    const fecharMega = () => el.classList.remove('mega-aberto');
    el.querySelectorAll('.nav a').forEach(a => a.addEventListener('mouseenter', () =>
      el.classList.toggle('mega-aberto', a.hasAttribute('data-mega'))));
    el.addEventListener('mouseleave', fecharMega);
    el.querySelectorAll('.mega a').forEach(a => a.addEventListener('click', fecharMega));
    const btnTema = el.querySelector('.tema-toggle');
    btnTema.addEventListener('click', () => {
      const novo = temaAtual() === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', novo);
      try { localStorage.setItem('durax-tema', novo); } catch (e) {}
      btnTema.querySelector('span').textContent = rotuloTema();
      document.dispatchEvent(new CustomEvent('durax:tema', { detail: novo }));
    });
    const toggle = el.querySelector('.menu-toggle');
    toggle.addEventListener('click', () => {
      const aberto = el.classList.toggle('mobile-aberto');
      toggle.setAttribute('aria-expanded', aberto);
    });

    const zap = document.createElement('a');
    zap.className = 'btn whatsapp-flutuante';
    zap.href = WHATSAPP; zap.target = '_blank'; zap.rel = 'noopener';
    zap.setAttribute('aria-label', 'WhatsApp');
    zap.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#171717" stroke-width="2" aria-hidden="true"><path d="M4 20l1.4-4.2A8 8 0 1 1 8.2 18.6Z"/></svg>WhatsApp';
    document.body.appendChild(zap);
  }

  function renderFooter(el) {
    const col = (titulo, links) => '<div class="footer-col"><span class="titulo">' + titulo + '</span>' +
      links.map(([t, h]) => '<a href="' + h + '">' + t + '</a>').join('') + '</div>';
    el.className = 'site-footer';
    el.innerHTML =
      '<div class="container footer-grid">' +
        '<div class="footer-col footer-marca">' + LOGO_RODAPE +
          '<p>Ferramentas e materiais para construção civil, com qualidade inspecionada na fábrica e estoque no Brasil.</p>' +
          '<div class="redes"><a href="#">INSTAGRAM</a><a href="#">LINKEDIN</a><a href="#">YOUTUBE</a></div></div>' +
        col('PRODUTOS', [
          ['Adesivos e produtos químicos', PAGINAS.produtos], ['Abrasivos, ferragens e solda', PAGINAS.produtos],
          ['EPIs', PAGINAS.produtos], ['Material elétrico e iluminação', PAGINAS.categoria],
          ['Ferramentas de corte', PAGINAS.produtos], ['Ferramentas manuais', PAGINAS.produtos]]) +
        col('DURAX', [
          ['Sobre a marca', PAGINAS.sobre], ['Onde comprar', PAGINAS.onde], ['Seja revendedor', PAGINAS.revendedor],
          ['Blog Duráximo', PAGINAS.blog], ['Centros de distribuição', '#']]) +
        col('SUPORTE TÉCNICO', [['FISPQ', '#'], ['Certificado de Aprovação (CA)', '#'], ['Manuais', '#'], ['Política de garantia', '#']]) +
        '<div class="footer-col"><span class="titulo">ATENDIMENTO</span>' +
          '<a class="destaque" href="' + WHATSAPP + '" target="_blank" rel="noopener">WhatsApp (41) 98859-7870</a>' +
          '<span>SAC (11) 91482-9870</span><span>R. Surubim, 577 – Cidade Monções<br>São Paulo – SP</span></div>' +
      '</div>' +
      '<div class="footer-base"><div class="container">' +
        '<span>© Durax 2025–2026</span>' +
        '<nav><a href="#">Privacidade</a><a href="#">Política de cookies</a><a href="#">Termos de uso</a><a href="#">Código de ética</a></nav>' +
        '<span class="siaga">UMA MARCA <span><img src="assets/site/siaga.png" alt="Siaga Corp"></span></span>' +
      '</div></div>';
  }

  const h = document.getElementById('site-header'); if (h) renderHeader(h);
  const f = document.getElementById('site-footer'); if (f) renderFooter(f);
})();
