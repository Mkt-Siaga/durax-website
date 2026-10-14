// Google Analytics 4 com Modo de Consentimento (LGPD) + eventos dos cliques principais.
// Para trocar de propriedade, altere só o ID abaixo.
(function () {
  const GA_ID = 'G-PLTQV7KCDT';
  const CHAVE = 'durax-cookies'; // 'aceito' | 'recusado'

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  let escolha = null;
  try { escolha = localStorage.getItem(CHAVE); } catch (e) {}

  // Sem consentimento: nada de cookies; o Google recebe só sinais anônimos (modelagem)
  gtag('consent', 'default', {
    analytics_storage: escolha === 'aceito' ? 'granted' : 'denied',
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    wait_for_update: 500
  });
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });

  const s = document.createElement('script');
  s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  function decidir(valor) {
    try { localStorage.setItem(CHAVE, valor); } catch (e) {}
    gtag('consent', 'update', { analytics_storage: valor === 'aceito' ? 'granted' : 'denied' });
    const b = document.getElementById('aviso-cookies'); if (b) b.remove();
  }

  function mostrarAviso() {
    if (document.getElementById('aviso-cookies')) return;
    const b = document.createElement('div');
    b.id = 'aviso-cookies'; b.className = 'aviso-cookies'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', 'Aviso de cookies');
    b.innerHTML = '<p>Usamos cookies para entender como o site é usado e melhorar sua experiência. Você pode aceitar ou recusar.</p>' +
      '<div class="aviso-cookies-acoes"><button type="button" class="btn-outline" data-c="recusado">Recusar</button>' +
      '<button type="button" class="btn" data-c="aceito">Aceitar</button></div>';
    b.addEventListener('click', e => { const t = e.target.closest('button[data-c]'); if (t) decidir(t.dataset.c); });
    document.body.appendChild(b);
  }

  // Eventos: cliques principais e busca
  const ev = (nome, params) => gtag('event', nome, params || {});
  document.addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a) return;
    if (a.matches('[data-cookies]')) { e.preventDefault(); mostrarAviso(); return; }
    const href = a.getAttribute('href') || '';
    const texto = (a.textContent || '').trim().slice(0, 80);
    if (/wa\.me\//.test(href)) ev(/revenda/i.test(href + texto) ? 'comprar_revenda' : 'contato_whatsapp', { link_text: texto, page_path: location.pathname });
    else if (/catalogo-durax-2026\.pdf/.test(href)) ev(/#page=/.test(href) ? 'ver_no_catalogo' : 'baixar_catalogo', { link_url: href, link_text: texto });
    else if (/produto\.html#p=/.test(href)) ev('ver_variacoes', { produto: decodeURIComponent(href.split('#p=')[1] || '') });
    else if (/^tel:/.test(href)) ev('ligar_distribuidor', { telefone: href.replace('tel:', '') });
    else if (/^https?:/.test(href) && href.indexOf(location.host) < 0) ev('link_externo', { link_url: href });
  }, true);

  let tBusca;
  document.addEventListener('input', e => {
    const i = e.target;
    if (!i.matches || !i.matches('#busca, #pd-filtro, .busca-topo input, #oc-cep')) return;
    clearTimeout(tBusca);
    tBusca = setTimeout(() => {
      const termo = (i.value || '').trim(); if (termo.length < 2) return;
      ev(i.id === 'oc-cep' ? 'buscar_revenda' : 'search', { search_term: termo });
    }, 1200);
  }, true);

  if (!escolha) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mostrarAviso); else mostrarAviso();
  }
})();
