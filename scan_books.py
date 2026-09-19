#!/usr/bin/env python3
"""
Scan Books - Indexador da Biblioteca Digital Let's Be Readers
Extrai metadados, sinopses e capas de arquivos EPUB locais
e gera o catálogo books.json e books-data.js.
"""

import os
import sys
import re
import json
import html
import posixpath
import zipfile
import datetime
import hashlib
import urllib.parse
import xml.etree.ElementTree as ET
from pathlib import Path

DEFAULT_SOURCE = "/home/gehard-fernando/Downloads/Livros"
TARGET_DIR = "/home/gehard-fernando/biblioteca-drive"
COVERS_DIR = os.path.join(TARGET_DIR, "capas")
OUTPUT_JSON = os.path.join(TARGET_DIR, "books.json")
OUTPUT_JS = os.path.join(TARGET_DIR, "books-data.js")
SYMLINK_PATH = os.path.join(TARGET_DIR, "livros")

# Regras heurísticas para categorização automática por palavras-chave em títulos e autores
GENRE_PATTERNS = [
    ("Ficção Científica", [
        "asimov", "arthur c. clarke", "philip k. dick", "william gibson", "duna",
        "jules verne", "julio verne", "hg wells", "h.g. wells", "matrix", "neuromancer",
        "fundacao", "fundação", "galaxia", "galáxia", "interestelar", "alien", "apocalipse",
        "zumbis", "futuro", "cyberpunk", "distopia", "fahrenheit", "1984", "admiravel mundo"
    ]),
    ("Suspense & Mistério", [
        "agatha christie", "sherlock", "conan doyle", "stephen king", "dexter", "dan brown",
        "dennis lehane", "harlan coben", "assassinato", "misterio", "mistério", "crime",
        "morte", "investigador", "policial", "sangue", "hitchcock", "suspense", "enigma"
    ]),
    ("Fantasia & Aventura", [
        "tolkien", "senhor dos aneis", "hobbit", "george r. r. martin", "game of thrones",
        "cronicas de gelo", "flanagan", "rangers", "rick riordan", "percy jackson", "olimpianos",
        "harry potter", "dragao", "dragões", "feiticeiro", "mago", "batalha do apocalipse",
        "spohr", "cornwell", "cronicas saxonicas", "graal", "rei arthur", "aventura"
    ]),
    ("Clássicos da Literatura", [
        "machado de assis", "shakespeare", "dante", "homero", "dostoievski", "dostoiévski",
        "tolstoi", "tolstói", "franz kafka", "alencar", "aluisio azevedo", "garrett", "camoes",
        "camões", "lima barreto", "clarice lispector", "edgar allan poe", "oscar wilde",
        "dom casmurro", "memorias postumas", "quincas borba", "cortico", "cortiço", "iliada", "odisseia"
    ]),
    ("Desenvolvimento Pessoal & Negócios", [
        "steve jobs", "habitos", "hábitos", "augusto cury", "napoleon hill", "dale carnegie",
        "robert kiyosaki", "pai rico", "inteligencia emocional", "produtividade", "sucesso",
        "lideranca", "liderança", "riqueza", "mindset", "foco", "vendas", "negocios", "negócios",
        "gestao", "gestão", "dinheiro", "motivacao", "motivação", "comunicacao", "comunicação",
        "shinyashiki", "lair ribeiro", "maxwell"
    ]),
    ("Filosofia & História", [
        "seneca", "sêneca", "marco aurelio", "marco aurélio", "platao", "platão", "aristoteles",
        "aristóteles", "nietzsche", "maquiavel", "sun tzu", "arte da guerra", "laurentino gomes",
        "1808", "1822", "1889", "historia", "história", "filosofia", "socrate", "sócrates",
        "kant", "descartes", "etica", "ética", "politica", "política", "guerra", "imperio", "império"
    ]),
    ("Romance", [
        "nicholas sparks", "meg cabot", "john green", "jojo moyes", "paulo coelho",
        "colleen hoover", "amor", "paixao", "paixão", "casamento", "coracao", "coração",
        "namoro", "beijo", "querido john", "veronika decide morrer", "crepusculo", "crepúsculo"
    ])
]

def clean_html(raw_html):
    """Remove tags HTML e decodifica entidades."""
    if not raw_html:
        return ""
    clean_text = re.sub(r'<[^>]+>', ' ', raw_html)
    clean_text = html.unescape(clean_text)
    clean_text = re.sub(r'\s+', ' ', clean_text).strip()
    return clean_text

def parse_filename(filename):
    """Extrai título e autor do nome do arquivo como fallback."""
    base_name = os.path.splitext(filename)[0]
    base_name = re.sub(r'_[a-zA-Z0-9\._]+$', '', base_name)
    parts = base_name.split(' - ')
    if len(parts) >= 2:
        title = ' - '.join(parts[:-1]).strip()
        author = parts[-1].strip()
    else:
        title = base_name.replace('_', ' ').strip()
        author = "Autor Desconhecido"
    return title, author

def format_file_size(size_bytes):
    """Formata tamanho de arquivo em KB ou MB."""
    if size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.0f} KB"
    return f"{size_bytes / (1024 * 1024):.1f} MB"

def detect_genre(title, author, subjects):
    """Classifica o gênero com base em títulos, autores e tags de assunto."""
    combined = f"{title} {author} {' '.join(subjects)}".lower()
    for genre, keywords in GENRE_PATTERNS:
        for kw in keywords:
            if kw in combined:
                return genre
    return "Literatura Geral"

def extract_cover_path(z, opf_root, opf_path):
    """Encontra o caminho interno da capa dentro do EPUB de forma resiliente."""
    opf_dir = posixpath.dirname(opf_path)
    
    # 1. Meta tag com name="cover"
    cover_id = None
    for meta in opf_root.findall('.//{*}meta'):
        if meta.attrib.get('name') == 'cover':
            cover_id = meta.attrib.get('content')
            break
            
    manifest = {}
    cover_by_prop = None
    for item in opf_root.findall('.//{*}item'):
        item_id = item.attrib.get('id')
        href = item.attrib.get('href')
        media_type = item.attrib.get('media-type', '')
        props = item.attrib.get('properties', '')
        if item_id and href:
            manifest[item_id] = (urllib.parse.unquote(href), media_type)
        if 'cover-image' in props and href:
            cover_by_prop = urllib.parse.unquote(href)

    cover_href = None
    if cover_id and cover_id in manifest:
        cover_href = manifest[cover_id][0]
    elif cover_by_prop:
        cover_href = cover_by_prop
    else:
        for item_id, (href, m_type) in manifest.items():
            if m_type.startswith('image/') and any(k in item_id.lower() or k in href.lower() for k in ['cover', 'capa']):
                cover_href = href
                break
                
    if cover_href:
        full_cover = posixpath.normpath(posixpath.join(opf_dir, cover_href)) if opf_dir else cover_href
        if full_cover in z.namelist():
            return full_cover
        # Fallback de busca insensível a maiúsculas/minúsculas
        full_cover_lower = full_cover.lower()
        cover_href_lower = cover_href.lower()
        for name in z.namelist():
            nl = name.lower()
            if nl == full_cover_lower or nl.endswith(cover_href_lower):
                return name
    return None

def scan_books(source_dir=DEFAULT_SOURCE):
    print(f"[*] Iniciando indexação em: {source_dir}")
    os.makedirs(COVERS_DIR, exist_ok=True)
    
    # Garantir symlink para servir os arquivos para download
    if not os.path.exists(SYMLINK_PATH):
        try:
            os.symlink(source_dir, SYMLINK_PATH)
            print(f"[+] Symlink criado: {SYMLINK_PATH} -> {source_dir}")
        except Exception as e:
            print(f"[!] Aviso: Não foi possível criar symlink: {e}")

    files = sorted([f for f in os.listdir(source_dir) if f.lower().endswith(('.epub', '.pdf'))])
    print(f"[*] Total de arquivos encontrados: {len(files)}")

    books = []
    covers_extracted = 0
    valid_cover_files = set()

    for idx, filename in enumerate(files, start=1):
        filepath = os.path.join(source_dir, filename)
        file_size = os.path.getsize(filepath)
        mod_time = os.path.getmtime(filepath)
        date_added = datetime.datetime.fromtimestamp(mod_time).strftime("%d/%m/%Y")
        format_type = "PDF" if filename.lower().endswith('.pdf') else "EPUB"

        # Identificador estável determinístico derivado do nome do arquivo
        file_hash = hashlib.sha256(filename.encode('utf-8')).hexdigest()[:12]
        book_id = f"book-{file_hash}"

        fn_title, fn_author = parse_filename(filename)
        title = fn_title
        author = fn_author
        synopsis = ""
        subjects = []
        cover_filename = None

        if format_type == "EPUB":
            try:
                with zipfile.ZipFile(filepath, 'r') as z:
                    if 'META-INF/container.xml' in z.namelist():
                        container = z.read('META-INF/container.xml')
                        root = ET.fromstring(container)
                        ns = {'c': 'urn:oasis:names:tc:opendocument:xmlns:container'}
                        rootfile = root.find('.//c:rootfile', ns)
                        if rootfile is not None and 'full-path' in rootfile.attrib:
                            opf_path = rootfile.attrib['full-path']
                            opf_content = z.read(opf_path)
                            opf_root = ET.fromstring(opf_content)
                            
                            # Título
                            t_elem = opf_root.find('.//{*}title')
                            if t_elem is not None and t_elem.text and len(t_elem.text.strip()) > 1:
                                opf_t = t_elem.text.strip()
                                # Se o título do OPF não for um ID genérico
                                if not re.match(r'^(urn:|isbn|calibre|\d+$)', opf_t, re.I):
                                    title = opf_t
                            
                            # Autor
                            c_elem = opf_root.find('.//{*}creator')
                            if c_elem is not None and c_elem.text and len(c_elem.text.strip()) > 1:
                                opf_a = c_elem.text.strip()
                                if not re.match(r'^(desconhecido|unknown|n/a|\d+$)', opf_a, re.I):
                                    author = opf_a
                                    
                            # Descrição / Sinopse
                            d_elem = opf_root.find('.//{*}description')
                            if d_elem is not None and d_elem.text:
                                synopsis = clean_html(d_elem.text)
                                    
                            # Assuntos
                            for s in opf_root.findall('.//{*}subject'):
                                if s.text:
                                    subjects.append(s.text.strip())
                                    
                            # Extração resiliente da capa
                            cover_path = extract_cover_path(z, opf_root, opf_path)
                            if cover_path and cover_path in z.namelist():
                                ext = os.path.splitext(cover_path)[1].lower() or '.jpg'
                                if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
                                    ext = '.jpg'
                                dest_cover_name = f"cov_{file_hash}{ext}"
                                dest_cover_path = os.path.join(COVERS_DIR, dest_cover_name)
                                
                                # Sempre extrair a capa correta do EPUB para garantir 100% de correspondência
                                cover_bytes = z.read(cover_path)
                                with open(dest_cover_path, 'wb') as cov_f:
                                    cov_f.write(cover_bytes)
                                
                                cover_filename = f"capas/{dest_cover_name}"
                                valid_cover_files.add(dest_cover_name)
                                covers_extracted += 1
            except Exception:
                # Se falhar no parsing do zip, mantém os dados do arquivo
                pass

        category = detect_genre(title, author, subjects)
        
        # Se não houver sinopse, gera texto explicativo padrão
        if not synopsis or len(synopsis) < 15:
            synopsis = f"Obra '{title}', de autoria de {author}. Disponível em formato {format_type} na sua biblioteca pessoal para leitura e download direto."

        # Páginas estimadas baseadas no tamanho do arquivo (média aproximada)
        estimated_pages = max(60, min(1200, int(file_size / 4500)))

        book_data = {
            "id": book_id,
            "title": title,
            "author": author,
            "category": category,
            "format": format_type,
            "size": format_file_size(file_size),
            "sizeBytes": file_size,
            "pages": estimated_pages,
            "dateAdded": date_added,
            "cover": cover_filename if cover_filename else "",
            "synopsis": synopsis,
            "fileName": filename,
            "downloadUrl": f"livros/{filename}"
        }
        books.append(book_data)

    # Limpar capas antigas órfãs ou legadas (ex: book-*.jpeg) que causavam descompasso
    removed_count = 0
    if os.path.exists(COVERS_DIR):
        for old_file in os.listdir(COVERS_DIR):
            if old_file not in valid_cover_files:
                try:
                    os.remove(os.path.join(COVERS_DIR, old_file))
                    removed_count += 1
                except Exception:
                    pass
    if removed_count > 0:
        print(f"[+] Capas legadas/órfãs removidas da pasta capas/: {removed_count}")

    # Salvar books.json
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(books, f, ensure_ascii=False, indent=2)
    print(f"[+] Arquivo JSON gerado: {OUTPUT_JSON}")

    # Salvar books-data.js (garante funcionamento com file:// sem restrição de CORS)
    with open(OUTPUT_JS, "w", encoding="utf-8") as f:
        f.write("/**\n * Catálogo gerado automaticamente a partir dos livros locais\n */\n")
        f.write("window.REAL_BOOKS = ")
        json.dump(books, f, ensure_ascii=False, indent=2)
        f.write(";\n")
    print(f"[+] Arquivo JS gerado: {OUTPUT_JS}")

    return books

if __name__ == "__main__":
    scan_books()
