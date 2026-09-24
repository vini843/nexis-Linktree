# Nexis System | Links

Árvore de links oficial da Nexis System, feita para celular: vinheta de abertura, menus Quem somos? e O que fazemos?, Nexis Link, Ecossistema e FAQ.

## Estrutura

```
index.html              → página (conteúdo e textos)
assets/css/style.css    → todo o visual e as animações em CSS
assets/js/main.js       → vinheta, painéis, timeline, ecossistema e fundo animado
assets/img/favicon.svg  → ícone da aba do navegador
assets/img/og-image.png → imagem de prévia ao compartilhar o link (1200×630)
```

É um site estático, sem build e sem dependências. As fontes (Sora e JetBrains Mono) vêm do Google Fonts.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `nexis-links`) e envie todos os arquivos desta pasta para a raiz dele.
2. No repositório, vá em **Settings → Pages**.
3. Em **Source**, escolha **Deploy from a branch**, selecione a branch `main` e a pasta `/ (root)` e salve.
4. Em alguns minutos o site fica no ar em `https://SEU-USUARIO.github.io/nexis-links/`.

## Colocar um domínio próprio

1. Em **Settings → Pages → Custom domain**, digite o domínio (ex.: `links.nexissystem.com.br`) e salve. O GitHub cria um arquivo `CNAME` no repositório.
2. No painel de DNS do domínio (Registro.br ou onde estiver hospedado):
   - **Subdomínio** (ex.: `links.nexissystem.com.br`): crie um registro **CNAME** apontando `links` para `SEU-USUARIO.github.io`.
   - **Domínio raiz** (ex.: `nexislink.com.br`): crie 4 registros **A** apontando para `185.199.108.153`, `185.199.109.153`, `185.199.110.153` e `185.199.111.153`.
3. Depois que o DNS propagar, marque **Enforce HTTPS** em Settings → Pages.

Também funciona em Vercel ou Netlify: é só importar o repositório, sem configurar nada de build.

## Depois de definir o domínio

Em `index.html`, troque o caminho da imagem de prévia pelo endereço completo, para ela aparecer no WhatsApp e no Instagram:

```html
<meta property="og:image" content="https://SEU-DOMINIO/assets/img/og-image.png">
```

## Onde editar

- **Número do WhatsApp e mensagens:** procure por `wa.me/5549999555529` no `index.html`.
- **Textos:** todos estão no `index.html`.
- **Cores:** variáveis no início do `assets/css/style.css` (`--or` é o laranja principal).
- **Duração da vinheta:** `DURATION = 3000` (em milissegundos) no `assets/js/main.js`.
