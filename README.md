# Mercado Viral

Página de vendas do Mercado Viral: +150 materiais prontos para supermercados e mercadinhos.

## Como publicar

É um site estático. Não precisa build.

### Vercel
1. Importe este repositório em vercel.com/new
2. Framework Preset: **Other**
3. Build Command: deixe vazio
4. Output Directory: deixe vazio (raiz)
5. Deploy

### Qualquer outra hospedagem
Suba `index.html` e a pasta `media/` na raiz do domínio.

## Estrutura
- `index.html` — a página inteira (HTML, CSS e JS num arquivo só)
- `media/mockup.webp` — mockup do topo e do pop-up
- `media/m01..m12.webp` — artes da esteira
- `media/v01..v03.mp4` — vídeos dos objetos falantes (`.webp` = capa de cada um)

## Acesso só por celular

`index.html` tem, no topo, um script que detecta o aparelho pelo user agent. Celular e tablet
veem a página; computador e notebook são redirecionados para `https://www.google.com/404`,
sem levar os parâmetros de UTM. Não há limite de largura de tela: o bloqueio é por aparelho.

Para liberar o computador, apague esse `<script>` do começo do `index.html`.
Para mandar o computador para uma tela de erro própria em vez do Google, troque
`URL_ERRO_404` por `/pagina-nao-encontrada`.

- `404.html` — tela de erro usada pela hospedagem em endereços que não existem
- `pagina-nao-encontrada.html` — tela de erro própria, hoje não usada pelo script

## Checkouts
- Completo R$ 19,90 — `offer=0JH88N1`
- Turbo R$ 17,90 (pop-up) — `offer=RHVI2GY`
- Essencial R$ 10 — `offer=TX40A54`

## Rastreamento
Pixel Utmify (`6ae7fb5dc24fe16ab1ba648e`), script de UTMs e Meta Pixel (`1673948757736761`) ficam no fim do `index.html`.
