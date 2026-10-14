# Durax Website

Site institucional e catálogo da Durax (Grupo Siaga). HTML, CSS e JavaScript puros — sem build, sem dependências.
Base: handoff do Claude Design "Site Durax v2" (8 páginas, temas escuro e claro).

## Páginas

| Arquivo | Página |
|---|---|
| `index.html` | Home |
| `produtos.html` | Catálogo completo (busca + filtro por categoria, `#cat=N`, `#q=termo`) |
| `categoria.html` | Painéis LED com filtros (montada das versões reais do catálogo) |
| `produto.html` | Página de qualquer produto (`#p=<slug do nome>`): foto, botões e tabela de variações com filtro. Produtos com 2+ versões mostram "Ver variações" nos cards |
| `onde-comprar.html` | Busca de revendas (`#cep=`) |
| `seja-revendedor.html` | Benefícios + formulário de cadastro |
| `blog.html` | Blog Duráximo com filtro por tag |
| `sobre.html` | Sobre a marca |

## Estrutura

```
css/styles.css        Tokens de tema (escuro padrão, [data-theme="light"] claro) e componentes compartilhados
css/pages/*.css       Estilos de cada página
js/tema.js            Aplica o tema salvo antes de desenhar (carregar no <head>)
js/layout.js          Cabeçalho, mega menu, botão de tema, WhatsApp flutuante e rodapé
js/catalogo.js        Dados do catálogo (window.DURAX_CATALOGO): itens, página do PDF, foto e
                      `versoes` = [código SIAGA, descrição] (664 produtos vendidos como Durax,
                      da lista de preços; NUNCA incluir preço, custo ou cliente — repositório público)
js/paineis.js         Dados dos painéis LED (window.DURAX_PAINEIS)
js/<pagina>.js        Lógica de cada página
assets/               logo, produtos, site, textures, brand, catalogo (PDF)
assets/icones/        ícones (16–512, apple-touch) e og-image.jpg (prévia de link 1200×630)
favicon.ico           favicon 16/32/48 · site.webmanifest: ícones do app
```

Regra: páginas usam só as variáveis de cor de `styles.css` (`--bg`, `--texto`, `--destaque`…), assim os dois temas funcionam sem CSS duplicado.

## Rodar localmente

Qualquer servidor estático na pasta (abrir via `file://` também funciona na maioria dos navegadores).

## Pendências

- **Formulários sem envio** (Seja revendedor, newsletter da Home): marcados com `// TODO: integrar envio`.
- **Dados placeholder:** revendas em `js/onde-comprar.js`; posts do blog em `js/blog.js`; códigos/EAN/medidas dos painéis aparecem como "a informar".
- **Fotos:** 279 de 298 itens têm foto (fotos oficiais Durax de `ITENS.zip` e, onde não havia, do acervo Siaga). Os 19 restantes usam o ícone da categoria — luvas (exceto a verde), fitas crepe/demarcação/empacotamento, lona preta, entre outros.
- Links ainda sem destino (`href="#"`): redes sociais, área do revendedor, suporte técnico (FISPQ, CA, manuais), downloads da página de produto, páginas legais.
- Catálogo PDF (`assets/catalogo/catalogo-durax-2026.pdf`) é **gerado a partir do site** por `ferramentas/catalogo-pdf/gerar.ps1`, que também atualiza a página de cada item em `js/catalogo.js`. Sempre regerar depois de mudar produtos, fotos ou versões (ver `ferramentas/catalogo-pdf/README.md`). A versão anterior, diagramada (144 págs.), está no histórico do git.
