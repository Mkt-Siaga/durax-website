# Durax Website

Site institucional e catálogo da Durax (Grupo Siaga). HTML, CSS e JavaScript puros — sem build, sem dependências.
Base: handoff do Claude Design "Site Durax v2" (8 páginas, temas escuro e claro).

## Páginas

| Arquivo | Página |
|---|---|
| `index.html` | Home |
| `produtos.html` | Catálogo completo (busca + filtro por categoria, `#cat=N`, `#q=termo`) |
| `categoria.html` | Painéis LED com filtros |
| `produto.html` | Página de produto (`#p=N`) |
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
js/catalogo.js        Dados do catálogo (window.DURAX_CATALOGO)
js/paineis.js         Dados dos painéis LED (window.DURAX_PAINEIS)
js/<pagina>.js        Lógica de cada página
assets/               logo, produtos, site, textures, brand, catalogo (PDF)
```

Regra: páginas usam só as variáveis de cor de `styles.css` (`--bg`, `--texto`, `--destaque`…), assim os dois temas funcionam sem CSS duplicado.

## Rodar localmente

Qualquer servidor estático na pasta (abrir via `file://` também funciona na maioria dos navegadores).

## Pendências

- **Formulários sem envio** (Seja revendedor, newsletter da Home): marcados com `// TODO: integrar envio`.
- **Dados placeholder:** revendas em `js/onde-comprar.js`; posts do blog em `js/blog.js`; códigos/EAN/medidas dos painéis aparecem como "a informar".
- **Fotos:** 279 de 298 itens têm foto (fotos oficiais Durax de `ITENS.zip` e, onde não havia, do acervo Siaga). Os 19 restantes usam o ícone da categoria — luvas (exceto a verde), fitas crepe/demarcação/empacotamento, lona preta, entre outros.
- Links ainda sem destino (`href="#"`): redes sociais, área do revendedor, suporte técnico (FISPQ, CA, manuais), downloads da página de produto, páginas legais.
- Catálogo PDF: edição 2026 (144 págs.) em `assets/catalogo/catalogo-durax-2026.pdf`. As páginas de cada item em `js/catalogo.js` vêm do índice alfabético (págs. 131–132); ao trocar o PDF, atualizar as páginas também.
