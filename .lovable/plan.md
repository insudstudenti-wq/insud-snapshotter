

# Articoli completi nella sezione LUMINA

Attualmente le card degli articoli mostrano solo il titolo e un "Clicca per leggere l'articolo" che non porta da nessuna parte. L'obiettivo e' rendere ogni articolo leggibile con il suo contenuto completo.

---

## Approccio

Dato che il sito non ha un backend/database, i contenuti degli articoli saranno definiti direttamente nel codice come dati statici. Cliccando su una card si aprira' una pagina dedicata all'articolo con il testo completo.

---

## Cosa verra' fatto

### 1. Creare i contenuti degli articoli
Aggiungere a ciascun articolo nell'array `articles` i campi: `slug`, `date`, `readTime`, `content` (testo completo in paragrafi) e `summary`.

I 3 articoli sono:
- **A20 Messina-Palermo** - Analisi dell'incompiuta autostradale siciliana
- **SITAEL Puglia** - Storia dell'azienda aerospaziale pugliese
- **Eduardo Montefusco** - Profilo dell'imprenditore del fitness

I contenuti saranno scritti in modo realistico e coerente con il tono editoriale di LUMINA.

### 2. Creare la pagina ArticlePage
Un nuovo componente `src/pages/ArticlePage.tsx` che:
- Riceve lo slug dall'URL (es. `/lumina/a20-messina-palermo`)
- Mostra l'articolo con: titolo, serie (badge), data, tempo di lettura, contenuto formattato
- Include un pulsante "Torna a LUMINA" per tornare indietro
- Usa lo stesso layout (Navbar + Footer) e stile del sito

### 3. Aggiornare il routing
Aggiungere in `App.tsx` la route `/lumina/:slug` che punta ad `ArticlePage`.

### 4. Collegare le card agli articoli
In `Lumina.tsx`, trasformare le card degli articoli in link che puntano a `/lumina/{slug}`.

---

## Dettagli tecnici

**File nuovi:**
- `src/pages/ArticlePage.tsx` - Pagina di lettura articolo

**File modificati:**
- `src/pages/Lumina.tsx` - Aggiungere slug/contenuti agli articoli + link nelle card
- `src/App.tsx` - Aggiungere route `/lumina/:slug`

**Nessuna nuova dipendenza necessaria.**

