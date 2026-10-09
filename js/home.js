// Home: busca por CEP (leva para Onde comprar) e cadastro da newsletter.
(function () {
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
