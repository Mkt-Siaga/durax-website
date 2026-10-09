// Página de produto (Painel LED): galeria, seletor de variações, especificações, abas e relacionados.
// Produto escolhido via #p=N (índice em js/paineis.js, window.DURAX_PAINEIS).
(function () {
  const PRODUTOS = window.DURAX_PAINEIS || [];
  const KEYS = [
    { k: 'formato', label: 'FORMATO', opts: ['Redondo', 'Quadrado'] },
    { k: 'instalacao', label: 'INSTALAÇÃO', opts: ['Embutir', 'Sobrepor'] },
    { k: 'potencia', label: 'POTÊNCIA', opts: [6, 12, 18, 24], fmt: v => v + 'W' },
    { k: 'temp', label: 'TEMPERATURA DE COR', opts: [3000, 4000, 6500], fmt: v => v + 'K' }
  ];
  const TEMP_TXT = {
    3000: 'Branco quente (3000K): aconchego e relaxamento, indicado para salas, quartos e áreas de descanso.',
    4000: 'Branco neutro (4000K): luz natural, indicada para cozinhas, banheiros, camarins e espaços de maquiagem.',
    6500: 'Branco frio (6500K): foco e máxima visibilidade, indicado para escritórios, home offices, lavanderias e áreas de serviço.'
  };
  const INST_TXT = {
    Embutir: 'Instalação de embutir, para rebaixamentos de gesso, com acabamento totalmente plano e discreto.',
    Sobrepor: 'Instalação de sobrepor, para lajes e superfícies diretas onde não há recuo, mantendo a linha slim.'
  };
  const THUMBS = ['foto do produto', 'foto em ambiente', 'embalagem', 'dimensões'];
  const TABS = ['DESCRIÇÃO', 'DIFERENCIAIS', 'INDICAÇÃO DE USO', 'DÚVIDAS'];
  const WHATSAPP = 'https://wa.me/5511914829870';
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const el = id => document.getElementById(id);
  const elFoto = el('foto-principal'), elSlot = el('slot-principal'), elMinis = el('miniaturas');
  const elVar = el('variacoes'), elSpecs = el('specs'), elAbas = el('abas'), elAba = el('aba-corpo'), elRel = el('relacionados');

  const estado = { idx: 7, thumb: 0, tab: 0 };

  function lerHash() {
    const m = location.hash.match(/p=(\d+)/);
    if (m && PRODUTOS[+m[1]]) { estado.idx = +m[1]; estado.thumb = 0; }
  }

  function ir(i) {
    estado.idx = i; estado.thumb = 0;
    try { history.replaceState(null, '', '#p=' + i); } catch (e) {}
    render();
  }

  // Escolhe a variação mais parecida com o produto atual que tenha o valor clicado
  function escolher(k, v) {
    const cur = PRODUTOS[estado.idx];
    const score = p => KEYS.reduce((s, x) => s + (p[x.k] === cur[x.k] ? 1 : 0), 0) + (p.cor === cur.cor ? .5 : 0) + (p.plast === cur.plast ? .3 : 0);
    const best = PRODUTOS.filter(p => p[k] === v).sort((a, b) => score(b) - score(a))[0];
    if (best) ir(best.i);
  }

  function renderGaleria() {
    const cur = PRODUTOS[estado.idx];
    const foto = estado.thumb === 0;
    elFoto.hidden = !foto;
    elFoto.src = cur.foto;
    elFoto.alt = cur.name;
    elSlot.hidden = foto;
    elSlot.textContent = THUMBS[estado.thumb];
    elMinis.innerHTML = THUMBS.map((label, i) =>
      '<button type="button" class="miniatura" data-thumb="' + i + '" aria-pressed="' + (i === estado.thumb) + '" aria-label="Ver ' + label + '">' +
      (i === 0 ? '<img src="' + cur.foto + '" alt="">' : '<span class="miniatura-slot">' + label + '</span>') + '</button>').join('');
  }

  function renderAba() {
    const cur = PRODUTOS[estado.idx];
    const corpos = [
      [{ a: 'Os Painéis Durax adaptam-se com precisão às necessidades do seu ambiente.' }, { a: INST_TXT[cur.instalacao] }, { a: TEMP_TXT[cur.temp] }],
      [{ a: 'Linha slim com acabamento plano.' }, { a: cur.bivolt ? 'Bivolt: funciona em 127V e 220V.' : 'Tensão: a informar.' }, { a: 'Mesma família em formatos redondo e quadrado, de embutir ou sobrepor, para padronizar o projeto.' }],
      [{ a: TEMP_TXT[3000] }, { a: TEMP_TXT[4000] }, { a: TEMP_TXT[6500] }],
      [{ q: 'Posso instalar em laje sem forro?', a: 'Sim, com a versão de sobrepor, que fica diretamente na superfície.' }, { q: 'Qual temperatura usar na cozinha?', a: 'Branco neutro (4000K) é o mais indicado.' }, { q: 'Onde encontro o manual de instalação?', a: 'Nos downloads desta página, acima.' }]
    ][estado.tab];
    elAbas.innerHTML = TABS.map((label, i) =>
      '<button type="button" role="tab" id="aba-' + i + '" data-tab="' + i + '" aria-selected="' + (i === estado.tab) + '" aria-controls="aba-corpo" tabindex="' + (i === estado.tab ? 0 : -1) + '">' + label + '</button>').join('');
    elAba.setAttribute('aria-labelledby', 'aba-' + estado.tab);
    elAba.innerHTML = corpos.map(b =>
      '<div class="aba-item">' + (b.q ? '<strong>' + esc(b.q) + '</strong>' : '') + '<span>' + esc(b.a) + '</span></div>').join('');
  }

  function render() {
    const cur = PRODUTOS[estado.idx];
    document.title = cur.name + ' — Durax';
    document.querySelectorAll('[data-nome]').forEach(n => { n.textContent = cur.name; });
    el('resumo').textContent = INST_TXT[cur.instalacao] + ' ' + TEMP_TXT[cur.temp];
    el('cta-revenda').href = WHATSAPP + '?text=' + encodeURIComponent('Olá! Quero comprar para revenda: ' + cur.name);

    renderGaleria();

    elVar.innerHTML = KEYS.map(g =>
      '<div class="variacao" role="group" aria-labelledby="var-' + g.k + '">' +
        '<span class="variacao-rotulo" id="var-' + g.k + '">' + g.label + '</span>' +
        '<div class="variacao-opcoes">' + g.opts.map(v => {
          const on = cur[g.k] === v;
          // Existe combinação exata mudando só esta característica?
          const exato = PRODUTOS.some(q => q[g.k] === v && KEYS.every(x => x.k === g.k || q[x.k] === cur[x.k]));
          return '<button type="button" data-k="' + g.k + '" data-v="' + esc(v) + '" aria-pressed="' + on + '"' +
            (on || exato ? '' : ' class="indisponivel" title="Combinação mais próxima"') + '>' + esc(g.fmt ? g.fmt(v) : v) + '</button>';
        }).join('') + '</div>' +
      '</div>').join('');

    const specs = [
      ['Formato', cur.formato], ['Instalação', cur.instalacao], ['Potência', cur.potencia + 'W'], ['Temperatura de cor', cur.temp + 'K'],
      ['Tensão', cur.bivolt ? 'Bivolt' : null], ['Cor', cur.cor], ['Corpo', cur.plast ? 'Plástico' : null],
      ['Fluxo luminoso', null], ['Dimensões', null], ['Recorte (embutir)', cur.instalacao === 'Embutir' ? null : 'Não se aplica'], ['Vida útil', null], ['Quantidade por caixa', null]
    ];
    elSpecs.innerHTML = specs.map(([k, v]) =>
      '<div class="spec"><dt>' + esc(k) + '</dt><dd' + (v ? '' : ' class="pendente"') + '>' + esc(v || 'a informar') + '</dd></div>').join('');

    renderAba();

    elRel.innerHTML = PRODUTOS.filter(q => q.i !== cur.i && q.formato === cur.formato).slice(0, 4).map(q =>
      '<a class="relacionado" href="produto.html#p=' + q.i + '" data-p="' + q.i + '">' +
        '<div class="relacionado-foto"><img src="' + q.foto + '" alt="" loading="lazy"></div>' +
        '<span class="relacionado-nome">' + esc(q.name) + '</span></a>').join('');
  }

  elVar.addEventListener('click', e => {
    const b = e.target.closest('button[data-k]'); if (!b) return;
    const g = KEYS.find(x => x.k === b.dataset.k);
    escolher(g.k, g.opts.find(o => String(o) === b.dataset.v));
    const mesmo = elVar.querySelector('button[data-k="' + g.k + '"][data-v="' + b.dataset.v + '"]');
    if (mesmo) mesmo.focus();
  });
  elMinis.addEventListener('click', e => {
    const b = e.target.closest('button[data-thumb]'); if (!b) return;
    estado.thumb = +b.dataset.thumb; renderGaleria();
    elMinis.querySelector('[data-thumb="' + estado.thumb + '"]').focus();
  });
  elAbas.addEventListener('click', e => {
    const b = e.target.closest('button[data-tab]'); if (!b) return;
    estado.tab = +b.dataset.tab; renderAba();
    el('aba-' + estado.tab).focus();
  });
  // Setas do teclado entre as abas
  elAbas.addEventListener('keydown', e => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
    estado.tab = (estado.tab + d + TABS.length) % TABS.length; renderAba();
    el('aba-' + estado.tab).focus();
  });
  elRel.addEventListener('click', e => {
    const a = e.target.closest('a[data-p]'); if (!a) return;
    e.preventDefault(); ir(+a.dataset.p); window.scrollTo(0, 0);
  });
  window.addEventListener('hashchange', () => { lerHash(); render(); });

  lerHash();
  render();
})();
