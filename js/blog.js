// Blog do Duráximo: filtro por tag. Para editar posts, altere o array POSTS abaixo.
// O primeiro post da lista filtrada aparece em destaque; os demais vão para a grade.
// Todos os cards levam ao Instagram @duraximo (POSTS são placeholders temáticos:
// troque img/title/text pelas imagens e legendas reais e, se quiser, adicione `link` com a URL do post).
(function () {
  const POSTS = [
    { img: 'assets/site/card1.png', tag: '#DicaDoDuráximo', title: 'Dimensionamento elétrico: cabo e disjuntor certos', text: 'Tabela prática para escolher a bitola do cabo e o disjuntor de acordo com a carga de cada circuito.' },
    { img: 'assets/site/card1.png', tag: '#DicaDoDuráximo', title: 'Cores da fiação segundo a NBR', text: 'Fase, neutro e terra: qual cor usar em cada condutor para deixar a instalação segura e fácil de manter.' },
    { img: 'assets/site/post3.png', tag: '#DicaDoDuráximo', title: 'Tipos de parafusos e chaves', text: 'Fenda, Phillips, Torx e sextavado: como identificar cada cabeça e qual chave usar no aperto.' },
    { img: 'assets/site/card3.png', tag: '#DicaDoDuráximo', title: 'Como usar um multímetro', text: 'Passo a passo para medir tensão, corrente e continuidade sem risco.' },
    { img: 'assets/site/post1.png', tag: '#DicaDoDuráximo', title: 'Tipos de broca e seus furos', text: 'Concreto, alvenaria, madeira ou metal: cada material pede uma broca diferente.' },
    { img: 'assets/site/post2.png', tag: '#DicaDoDuráximo', title: 'Quando usar cada bloco ou tijolo', text: 'Bloco de concreto, cerâmico ou tijolo maciço: onde cada um rende mais na obra.' },
    { img: 'assets/site/blog1.png', tag: 'Quiz', title: 'Qual a principal função de uma arruela?', text: 'Teste seus conhecimentos e responda nos comentários do post.' },
    { img: 'assets/site/card3.png', tag: 'Quiz', title: 'O que levou a broca do Duráximo a quebrar?', text: 'Veja as alternativas e descubra o erro mais comum na hora de furar.' },
    { img: 'assets/site/duraximo.webp', tag: 'Quiz', title: 'Qual a ferramenta mais utilizada em seus projetos?', text: 'Conte para o Duráximo qual ferramenta não sai da sua caixa.' },
    { img: 'assets/site/card1.png', tag: 'Produtos', title: 'Fita isolante autofusão', text: 'Vedação e resistência para emendas elétricas. Com Durax, a obra rende!' },
    { img: 'assets/site/hero.png', tag: 'Produtos', title: 'Eletrodos Durax', text: 'Feitos para durar, prontos para soldar.' },
    { img: 'assets/site/card3.png', tag: 'Produtos', title: 'Discos de corte, trena emborrachada e mais', text: 'Ferramentas que o Duráximo usa no dia a dia da construção.' },
    { img: 'assets/site/post3.png', tag: 'Campanhas', title: 'Seleção de Ofertas Duráximo', text: 'Na campanha da Copa, o Duráximo escalou os produtos Durax titulares da obra.' }
  ];
  const TAGS = ['Todos', '#DicaDoDuráximo', 'Quiz', 'Produtos', 'Campanhas'];
  const INSTAGRAM = 'https://www.instagram.com/duraximo/';

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const elTags = document.getElementById('blog-tags');
  const elDestaque = document.getElementById('blog-destaque');
  const elGrade = document.getElementById('blog-grade');
  let tagAtiva = 'Todos';

  const mascote = p => /duraximo\./.test(p.img) ? ' class="mascote"' : '';

  function destaque(p) {
    return '<a class="post-destaque" href="' + esc(p.link || INSTAGRAM) + '" target="_blank" rel="noopener">' +
      '<img src="' + esc(p.img) + '" alt=""' + mascote(p) + '>' +
      '<div class="post-destaque-info">' +
        '<span class="post-tag">' + esc(p.tag) + '</span>' +
        '<span class="post-destaque-titulo">' + esc(p.title) + '</span>' +
        '<span class="post-texto">' + esc(p.text) + '</span>' +
        '<span class="post-ver">VER NO INSTAGRAM →</span>' +
      '</div></a>';
  }

  function card(p) {
    return '<a class="post-card" href="' + esc(p.link || INSTAGRAM) + '" target="_blank" rel="noopener">' +
      '<img src="' + esc(p.img) + '" alt="" loading="lazy"' + mascote(p) + '>' +
      '<div class="post-card-info">' +
        '<span class="post-tag">' + esc(p.tag) + '</span>' +
        '<span class="post-card-titulo">' + esc(p.title) + '</span>' +
        '<span class="post-texto">' + esc(p.text) + '</span>' +
      '</div></a>';
  }

  // Botões criados uma vez (mantém o foco do teclado ao trocar de tag)
  elTags.innerHTML = TAGS.map(t =>
    '<button type="button" data-tag="' + esc(t) + '" aria-pressed="false">' + esc(t) + '</button>'
  ).join('');

  function render() {
    elTags.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.getAttribute('data-tag') === tagAtiva)));
    const lista = POSTS.filter(p => tagAtiva === 'Todos' || p.tag === tagAtiva);
    elDestaque.innerHTML = lista.length ? destaque(lista[0]) : '';
    elGrade.innerHTML = lista.slice(1).map(card).join('');
  }

  elTags.addEventListener('click', e => {
    const b = e.target.closest('button[data-tag]');
    if (!b) return;
    tagAtiva = b.getAttribute('data-tag');
    render();
  });

  render();
})();
