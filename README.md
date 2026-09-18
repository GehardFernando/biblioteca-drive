# 📚 Let's Be Readers

> **Biblioteca digital pessoal moderna, responsiva e minimalista para catálogo, busca e download de livros (EPUB e PDF).**

---

## ✨ Funcionalidades

* 🌙 **Design Dark Minimalista:** Interface moderna com tons de obsidiana, efeitos de vidro (*glassmorphism*) e acentos em índigo e ciano.
* 📱 **Experiência Mobile-First:**
  * Header adaptativo de 2 linhas com barra de busca 100% expansível.
  * Carrossel de categorias deslizável por toque (*touch swipe*).
  * Estante organizada em 2 colunas equilibradas em smartphones.
  * Botões de toque ergonômicos (mínimo 44px).
* ⚡ **Busca & Filtros Instantâneos:**
  * Pressione `/` no teclado para focar a barra de pesquisa imediatamente.
  * Filtro rápido por formato (`EPUB`, `PDF`) e múltiplos gêneros literários.
  * Ordenação por mais recentes, título (A-Z / Z-A), autor e tamanho.
* 🖼️ **Extração Automática de Capas & Metadados:**
  * Script integrado em Python (`scan_books.py`) que escania a pasta de livros, lê os pacotes EPUB e extrai títulos, autores, sinopses e capas originais.
  * Sistema de fallback visual caso o livro não possua capa incorporada.
* 📖 **Modal Completo de Detalhes:**
  * Capa em alta resolução, sinopse, metadados e botões para download do arquivo real.
* 🚀 **Paginação Fluida:**
  * Suporta centenas de títulos com carregamento incremental em lotes de 36 livros, garantindo 60 FPS e carregamento instantâneo.

---

## 🛠️ Tecnologias Utilizadas

* **Front-end:** HTML5 semântico, CSS3 Moderno (Variáveis CSS, CSS Grid, Flexbox, Glassmorphism) e JavaScript Puro (Vanilla ES6+).
* **Processamento / Indexador:** Python 3 (módulos nativos `zipfile`, `xml.etree.ElementTree`, `json`).
* **Hospedagem & Conexão:** Compatível com GitHub Pages, Vercel, Cloudflare Pages ou servidor local.

---

## 🚀 Como Rodar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU-USUARIO/lets-be-readers.git
   cd lets-be-readers
   ```

2. **(Opcional) Indexar seus livros locais:**
   Coloque seus arquivos `.epub` em uma pasta e rode o indexador:
   ```bash
   python3 scan_books.py
   ```

3. **Inicie o servidor local:**
   ```bash
   python3 -m http.server 3000
   ```
   Acesse no seu navegador: `http://localhost:3000`

---

## 📄 Licença

Distribuído sob a licença MIT. Consulte `LICENSE` para mais informações.
