// Monta o catálogo A4 a partir de window.DURAX_CATALOGO e pagina medindo o conteúdo de cada folha.
// Ao final grava o mapa item -> página em <script id="mapa"> (lido pelo gerar.ps1 para atualizar o site).
document.fonts.ready.then(function () {
  const RAIZ = '../../';
  const dados = window.DURAX_CATALOGO || [];
  const livro = document.getElementById('livro');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const dois = n => String(n).padStart(2, '0');
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const LOGO_P = RAIZ + 'assets/logo/durax-logo-preto.png', LOGO_B = RAIZ + 'assets/logo/durax-logo-branco.png';
  let paginas = 0;

  function folha(classe, html) {
    const p = document.createElement('section');
    p.className = 'pagina ' + (classe || '');
    p.innerHTML = html || '';
    livro.appendChild(p);
    paginas++;
    p.dataset.n = paginas;
    return p;
  }
  function rodape(p, escuro) {
    const n = +p.dataset.n, par = n % 2 === 0;
    p.insertAdjacentHTML('beforeend', '<div class="rod">' +
      (par ? '<span class="num">' + n + '</span><span>CATÁLOGO DE PRODUTOS DURAX · 2026</span>'
           : '<span>CATÁLOGO DE PRODUTOS DURAX · 2026</span><span class="num">' + n + '</span>') + '</div>');
  }
  function interna(rotulo, num) {
    const p = folha('', '<div class="cab"><span class="cab-cat">' + (num ? '<b>' + num + '</b>' : '') + esc(rotulo) + '</span>' +
      '<img src="' + LOGO_P + '" alt="Durax"></div><div class="corpo"></div>');
    if (num) p.insertAdjacentHTML('beforeend', '<div class="aba" style="top:' + (40 + (+num - 1) * 17) + 'mm">' + num + '</div>');
    rodape(p);
    return p;
  }
  const estoura = el => el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;

  // Coloca blocos em sequência, abrindo nova folha quando a atual enche
  function fluir(blocos, novaFolha, alvo) {
    let p = novaFolha(), corpo = alvo(p);
    blocos.forEach(b => {
      corpo.appendChild(b.el);
      if (estoura(corpo) && corpo.children.length > 1) {
        corpo.removeChild(b.el);
        p = novaFolha(); corpo = alvo(p); corpo.appendChild(b.el);
      }
      if (b.aoColocar) b.aoColocar(+p.dataset.n);
    });
  }

  // ---------- Capa ----------
  folha('capa', '<div class="capa-faixa"></div>' +
    '<div class="capa-topo"><img src="' + LOGO_B + '" alt="Durax"><span>EDIÇÃO 2026</span></div>' +
    '<h1>Catálogo<b>de produtos</b></h1>' +
    '<div class="capa-sub">Ferramentas e materiais para construção</div>' +
    '<div class="capa-cats">' + dados.map((c, i) => '<div><b>' + dois(i + 1) + '</b>' + esc(c.name) + '</div>').join('') + '</div>');

  // ---------- Sumário (páginas preenchidas depois) ----------
  const sum = interna('Sumário');
  const totalItens = dados.reduce((s, c) => s + c.items.length, 0);
  sum.querySelector('.corpo').innerHTML = '<div class="titulo-pag">Sumário</div>' +
    '<p class="sum-intro">' + totalItens + ' famílias de produto em ' + dados.length + ' categorias. Cada família traz suas versões com o código ' +
    'Durax/SIAGA. Códigos, medidas e embalagens podem mudar; confirme com o comercial antes de fechar o pedido.</p>' +
    dados.map((c, i) => '<div class="sum-linha"><span class="n">' + dois(i + 1) + '</span><span class="nome">' + esc(c.name) +
      ' <small>' + c.items.length + ' produtos</small></span><span class="p" data-cat="' + i + '"></span></div>').join('') +
    '<div class="sum-linha"><span class="n">—</span><span class="nome">Índice alfabético</span><span class="p" id="p-alfa"></span></div>' +
    '<div class="sum-linha"><span class="n">—</span><span class="nome">Índice por código</span><span class="p" id="p-cod"></span></div>';

  const mapa = []; // {ci, ii, name, page}
  const porCodigo = [];

  dados.forEach((c, ci) => {
    const num = dois(ci + 1);
    // Abertura da categoria
    const ab = folha('abertura', '<div class="cab-topo"><img src="' + LOGO_B + '" alt="Durax"><span>CATEGORIA ' + num + ' DE ' + dois(dados.length) + '</span></div>' +
      '<div class="abertura-num">' + num + '</div><h2>' + esc(c.name) + '</h2><div class="abertura-lista"></div>');
    rodape(ab);
    sum.querySelector('.p[data-cat="' + ci + '"]').textContent = ab.dataset.n;
    const lista = ab.querySelector('.abertura-lista');

    // Blocos de produto
    const blocos = c.items.map((it, ii) => {
      const el = document.createElement('article');
      el.className = 'prod';
      const foto = it.img
        ? '<div class="prod-foto"><img src="' + RAIZ + esc(it.img) + '" alt=""></div>'
        : '<div class="prod-foto vazia"><img src="' + LOGO_P + '" alt=""></div>';
      const v = it.versoes || [];
      const tabela = linhas => '<table class="vers"><thead><tr><th>CÓDIGO</th><th>DESCRIÇÃO</th></tr></thead><tbody>' +
        linhas.map(x => '<tr><td class="c">' + esc(x[0]) + '</td><td>' + esc(x[1]) + '</td></tr>').join('') + '</tbody></table>';
      let info;
      if (!v.length) info = '<p class="prod-sem">Códigos, medidas e embalagens: consulte o comercial Durax · WhatsApp (11) 91482-9870.</p>';
      else if (v.length > 10) { const meio = Math.ceil(v.length / 2); info = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:5mm">' + tabela(v.slice(0, meio)) + tabela(v.slice(meio)) + '</div>'; }
      else info = tabela(v);
      el.innerHTML = foto + '<div>' + (it.novo ? '<span class="prod-tag">Lançamento</span>' : '') +
        '<h3 class="prod-nome">' + esc(it.name) + '</h3>' + info + '</div>';
      // Bloco muito alto (muitas versões): ocupa a largura toda, foto em cima
      if (v.length > 40) el.style.gridTemplateColumns = '1fr';
      return { el, aoColocar: pg => {
        mapa.push({ ci, ii, name: it.name, page: pg });
        v.forEach(x => { if (x[0] && x[0] !== '—') porCodigo.push([x[0], it.name, pg]); });
        lista.insertAdjacentHTML('beforeend', '<div><span>' + esc(it.name) + '</span><b>' + pg + '</b></div>');
      } };
    });
    fluir(blocos, () => interna(c.name, num), p => p.querySelector('.corpo'));
  });

  // ---------- Índice alfabético ----------
  const alfa = mapa.slice().sort((a, b) => norm(a.name).localeCompare(norm(b.name), 'pt'));
  const entradasAlfa = []; let letra = '';
  alfa.forEach(m => {
    const l = norm(m.name)[0].toUpperCase();
    if (l !== letra) { letra = l; const h = document.createElement('div'); h.className = 'ind-letra'; h.textContent = l; entradasAlfa.push({ el: h }); }
    const d = document.createElement('div'); d.innerHTML = '<span>' + esc(m.name) + '</span><b>' + m.page + '</b>'; entradasAlfa.push({ el: d });
  });
  let primeira = true;
  const folhaIndice = (titulo, idAlvo, classe) => () => {
    const p = interna(titulo);
    const corpo = p.querySelector('.corpo');
    if (primeira) { corpo.innerHTML = '<div class="titulo-pag">' + titulo + '</div>'; document.getElementById(idAlvo).textContent = p.dataset.n; primeira = false; }
    corpo.insertAdjacentHTML('beforeend', '<div class="' + classe + '" style="column-fill:auto;height:' + (primeira ? 'auto' : '100%') + '"></div>');
    return p;
  };
  // A coluna precisa de altura fixa para encher na ordem; calcula o espaço livre depois do título
  function alvoIndice(p) {
    const corpo = p.querySelector('.corpo'), ind = corpo.lastElementChild;
    const usado = ind.offsetTop - corpo.offsetTop;
    ind.style.height = (corpo.clientHeight - usado) + 'px';
    return ind;
  }
  fluir(entradasAlfa, folhaIndice('Índice alfabético', 'p-alfa', 'ind'), alvoIndice);

  // ---------- Índice por código ----------
  primeira = true;
  const entradasCod = porCodigo.sort((a, b) => a[0].localeCompare(b[0])).map(x => {
    const d = document.createElement('div'); d.innerHTML = '<b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span><b>' + x[2] + '</b>'; return { el: d };
  });
  fluir(entradasCod, folhaIndice('Índice por código', 'p-cod', 'ind cod'), alvoIndice);

  // ---------- Contracapa ----------
  folha('contra', '<img class="contra-logo" src="' + LOGO_B + '" alt="Durax">' +
    '<h2>Ferramentas e materiais<br><b>feitos para durar.</b></h2>' +
    '<div class="contra-info">' +
      '<div><strong>ATENDIMENTO</strong>SAC e WhatsApp (11) 91482-9870<br>R. Surubim, 577 – Cidade Monções<br>São Paulo – SP</div>' +
      '<div><strong>ONDE COMPRAR</strong>Distribuidores em RJ, GO, RO, AL e MG.<br>Lista completa e mapa no site.</div>' +
      '<div><strong>SITE</strong>mkt-siaga.github.io/durax-website</div>' +
      '<div><strong>INSTAGRAM</strong>@duraxbr</div>' +
    '</div>' +
    '<div class="contra-faixa"><span>UMA MARCA SIAGA CORP</span><img src="' + RAIZ + 'assets/site/siaga-preto.png" alt="Siaga Corp"></div>');

  // Resultado para o gerador
  const s = document.createElement('script');
  s.type = 'application/json'; s.id = 'mapa';
  s.textContent = JSON.stringify({ total: paginas, itens: mapa });
  document.body.appendChild(s);
  window.MAPA = { total: paginas, itens: mapa };
});
