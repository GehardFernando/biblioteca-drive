# 📚 Let's Be Readers — Status do Projeto

> **Conceito:** Biblioteca digital pessoal moderna para catálogo, busca e download de livros (EPUB, PDF) armazenados no Google Drive.  
> **Localização do Projeto:** `/home/gehard-fernando/biblioteca-drive/`  
> **Última Atualização:** 18 de Setembro de 2026  

---

## 📌 Onde Paramos

Concluímos a **Fase 1: Design de Interface e Prototipagem Visual (HTML, CSS e JavaScript)**.

O protótipo visual está 100% funcional no navegador com dados de exemplo (mockados), permitindo testar toda a usabilidade antes de integrar com a API do Google Drive.

---

## 🎨 Design e Identidade Visual (Estilo A)

* **Estilo Escolhido:** **Dark Minimalista (Moderno & Tech)**.
* **Paleta de Cores:** Fundo escuro profundo (tons grafite/obsidiana `#0a0e17` e `#111726`), acentos em índigo/violeta (`#6366f1`) e ciano elétrico (`#06b6d4`).
* **Efeitos Visuais:** 
  * Efeito de vidro (*glassmorphism*) com *backdrop blur* na navbar e no modal.
  * Luzes ambientes sutis no fundo (*ambient glow*).
  * Capas de livros com sombras realistas e elevação ao passar o mouse (*hover 3D*).
  * Badges distintos para formatos: **EPUB** (verde-esmeralda) e **PDF** (coral/vermelho).

---

## 📂 Arquivos do Projeto

| Arquivo | Descrição |
| :--- | :--- |
| [`index.html`](./index.html) | Estrutura semântica completa: navbar, hero, barra de filtros, grid de livros, paginação fluida e modal de detalhes. |
| [`style.css`](./style.css) | Folha de estilo com variáveis CSS, layout responsivo (desktop e mobile touch), botões e animações. |
| [`app.js`](./app.js) | Lógica de interação: busca instantânea em 579 livros, categorias dinâmicas, paginação de 36 em 36 e download real. |
| [`scan_books.py`](./scan_books.py) | Script de indexação que lê os arquivos EPUB, extrai as capas reais, sinopses e metadados. |
| [`books.json`](./books.json) | Base de dados estruturada contendo todos os 579 livros indexados. |
| [`books-data.js`](./books-data.js) | Carregamento assíncrono dos livros sem restrições de CORS para execução local direta. |
| [`capas/`](./capas/) | Diretório com mais de 560 capas reais extraídas dos arquivos EPUB. |
| [`livros`](./livros) | Symlink apontando para os arquivos de livros reais para permitir download direto pelo navegador. |
| [`PROJETO_STATUS.md`](./PROJETO_STATUS.md) | Este documento de documentação e planejamento do projeto. |

---

## 🚀 Funcionalidades Já Implementadas (Front-end)

1. **Barra de Navegação Superior:**
   * Marca atualizada: **Let's Be Readers** (*Nuvem Pessoal*).
   * **Barra de busca inteligente:** filtra instantaneamente por título, autor ou gênero.
   * Atalho de teclado: ao pressionar `/`, o campo de busca ganha foco imediatamente.
   * Contador dinâmico de livros com indicador de status em tempo real.

2. **Filtros e Controles de Exibição:**
   * **Pills de Filtro Rápido:** `Todos`, `EPUB`, `PDF`, `Tecnologia`, `Ficção Científica`, `Filosofia` e `Produtividade`.
   * **Ordenação:** `Mais recentes`, `Título (A-Z)`, `Título (Z-A)`, `Autor (A-Z)` e `Maior tamanho`.
   * **Alternador de Visualização:**
     * **Modo Grade:** estante com foco nas capas grandes e estilo cartão.
     * **Modo Lista:** listagem horizontal compacta e rápida para escanear muitos títulos.

3. **Cards de Livros:**
   * Exibição de capa, categoria, título (com reticências automáticas em títulos longos), autor e tamanho.
   * Botão de **Download Rápido** em cada card.
   * Clique no card para abrir o modal de detalhes completos.

4. **Modal de Detalhes:**
   * Capa ampliada em alta resolução.
   * Sinopse completa da obra.
   * Grid com metadados: formato, data de adição no Drive e páginas estimadas.
   * Botões de ação: **"Baixar Livro"** e **"Abrir no Drive"**.

5. **Feedbacks Visuais e Estados:**
   * Notificação flutuante (*Toast*) confirmando o início do download.
   * Tela de **Estado Vazio (Empty State)** caso nenhuma busca ou filtro encontre resultados, com botão para "Limpar filtros".

6. **Experiência Mobile Completa (Smartphones e Tablets):**
   * **Header Adaptativo (Grid de 2 linhas):** Marca e indicador de status no topo lado a lado; campo de busca ocupando 100% da largura logo abaixo.
   * **Carrossel de Categorias Touch:** Filtros em barra deslizável horizontalmente (sem quebra de linha excessiva), estilo apps nativos (YouTube/Spotify).
   * **Grid de 2 Colunas no Smartphone:** Livros dispostos em 2 colunas equilibradas com capas e tipografia escaladas perfeitamente para telas de celulares.
   * **Modo Lista Mobile:** Formatação compacta e fluida que não espreme os títulos.
   * **Modal e Toasts Otimizados:** Modal com rolagem suave, botões com área de toque recomendada (min 44px) e toast centralizado na parte inferior da tela.
   * **Meta Tags PWA/Mobile:** Suporte a `theme-color` `#0a0e17` para barra de status nativa no Android/iOS.

---

## 🧭 Próximos Passos (Para onde vamos agora)

Quando você quiser dar continuidade, as próximas etapas planejadas são:

1. **Ajustes Visuais (se necessário):**
   * Avaliar se deseja adicionar mais seções (ex: "Continuar lendo", leitor online de EPUB/PDF no navegador, ou suporte a modo claro).
2. **Definição da Integração com o Google Drive:**
   * **Opção A (Jamstack / Estático):** Criar um script (em Python ou Node.js) que você roda para escanear sua pasta do Google Drive, extrair os nomes/capas/links e gerar o `books.json` que alimenta o site.
   * **Opção B (API Dinâmica em Tempo Real):** Configurar uma *Service Account* no Google Cloud para conectar a pasta do Drive diretamente a um backend ou função serverless.
3. **Conexão dos Livros Reais:**
   * Substituir a lista de livros de teste (`mockBooks` no `app.js`) pelos seus arquivos reais do Google Drive.
4. **Hospedagem / Publicação Online:**
   * Publicar gratuitamente na Vercel, Cloudflare Pages ou GitHub Pages para você acessar de qualquer dispositivo (celular, tablet, computador).

---

## 🖥️ Como rodar e visualizar localmente

Abra no terminal:
```bash
cd ~/biblioteca-drive
python3 -m http.server 3000
```
E acesse no seu navegador: `http://localhost:3000` ou abra direto o arquivo `file:///home/gehard-fernando/biblioteca-drive/index.html`.
