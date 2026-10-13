# Gerador do catálogo em PDF

Monta o **Catálogo de Produtos Durax** (A4) com os mesmos dados e fotos do site e salva em
`assets/catalogo/catalogo-durax-2026.pdf`.

- `catalogo.html` / `catalogo.css` / `catalogo.js` — layout: capa, sumário, abertura de cada categoria,
  páginas de produto (foto, nome, versões com código e descrição), índice alfabético, índice por código e contracapa.
  A paginação é automática (mede o conteúdo de cada folha).
- `gerar.ps1` — abre o catálogo no Microsoft Edge (sem janela), lê a página de cada produto,
  grava essas páginas em `js/catalogo.js` (link "Ver no catálogo → Pág. N" do site) e exporta o PDF.

## Quando o site mudar (produtos, fotos, versões)

```powershell
powershell -ExecutionPolicy Bypass -File ferramentas\catalogo-pdf\gerar.ps1
```

Depois, publicar (commit + push) o PDF e o `js/catalogo.js` juntos — as páginas do site dependem deste PDF.

Para ver antes de gerar: abrir `catalogo.html` por um servidor local (ex.: `http://localhost:8765/ferramentas/catalogo-pdf/catalogo.html`).

Produtos marcados com `"novo": true` em `js/catalogo.js` recebem a etiqueta "Lançamento".
