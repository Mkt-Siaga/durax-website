// Página: Seja revendedor — formulário de cadastro (sem backend).
(function () {
  var form = document.getElementById('sr-form');
  var enviado = document.getElementById('sr-enviado');
  if (!form || !enviado) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    // TODO: integrar envio (CRM / e-mail / API). Os dados ficam em new FormData(form).
    form.hidden = true;
    enviado.hidden = false;
    enviado.focus();
  });
})();
