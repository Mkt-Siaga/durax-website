// Aplica o tema salvo antes da página desenhar (evita "piscar").
// Carregar no <head>, sem defer. A troca é feita pelo botão do cabeçalho (layout.js).
(function () {
  var t = null;
  try { t = localStorage.getItem('durax-tema'); } catch (e) {}
  if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
})();
