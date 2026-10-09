# Durax Website

Site institucional da Durax (Grupo Siaga). HTML, CSS e JavaScript puros — sem build.

## Estrutura

```
index.html          Redireciona para produtos.html (até a Home ficar pronta)
produtos.html       Catálogo com busca e filtro por categoria
css/styles.css      Estilos e cores da marca (variáveis em :root)
js/layout.js        Cabeçalho, mega menu e rodapé compartilhados
js/catalogo.js      Dados do catálogo (window.DURAX_CATALOGO)
js/produtos.js      Lógica da página de produtos
assets/produtos/    Fotos dos produtos (.webp)
assets/site/        Ícones de categoria e textura do topo
```

## Pendências

- `assets/logo/` — logo oficial (hoje o cabeçalho usa o texto "DURAX")
- `assets/catalogo/catalogo-durax-2026.pdf` — PDF do catálogo (links "Ver no catálogo")
- Páginas ainda não criadas: Home, Categoria, Onde comprar, Blog, Sobre, Seja revendedor
- Links de redes sociais e suporte técnico (`href="#"`)
