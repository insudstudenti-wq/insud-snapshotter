

# Piano: Replica fedele del sito originale INSUD

Ho confrontato il clone attuale con il sito originale (insud-studenti.base44.app) e ho trovato diverse differenze. Ecco cosa va sistemato:

---

## 1. Pagina AperInsud - Sezioni mancanti e contenuti diversi

**Problemi trovati:**
- Le 3 card hanno titoli e descrizioni diversi dall'originale
- Manca la sezione "Come Funziona" con 3 step numerati (Iscriviti, Partecipa, Connettiti)
- Manca la sezione "Seguici su Instagram" con link a @aperinsud

**Cosa faro:**
- Aggiornare le card: "Cibo Autentico" (non "Cibo Tipico"), "Networking", "Cultura Meridionale" con i testi originali
- Aggiungere la sezione "Come Funziona" con i 3 passaggi numerati 01/02/03
- Aggiungere la sezione Instagram CTA con link a https://www.instagram.com/aperinsud/

---

## 2. Pagina LUMINA - Quasi completamente da rifare

**Problemi trovati:**
- Il sottotitolo dell'hero e' diverso dall'originale
- Il testo di descrizione e' piu' breve e diverso dall'originale
- Mancano le 3 card (Storie di Successo, Approfondimenti, Serie Tematiche)
- Manca la sezione "I Nostri Articoli" con le card degli articoli (3 articoli con titoli reali)
- Manca la sezione "Le Nostre Serie" con le 3 serie editoriali e i loro tag
- Manca la CTA "Entra nella Redazione"

**Cosa faro:**
- Riscrivere la pagina LUMINA con tutte le sezioni del sito originale
- Aggiungere le card degli articoli con i titoli reali (Autostrada A20, SITAEL, Eduardo Montefusco)
- Aggiungere la sezione Serie con tag colorati
- Aggiungere la CTA finale per unirsi alla redazione

---

## 3. Home page - Correzioni minori

**Problemi trovati:**
- La descrizione della Conferenza e' leggermente diversa (manca la frase "Un evento per esplorare come il capitale puo' accelerare lo sviluppo del Sud Italia")

**Cosa faro:**
- Aggiornare la descrizione della conferenza nel ProjectsSection

---

## Dettagli tecnici

**File da modificare:**
- `src/pages/AperInsud.tsx` - Aggiornare card + aggiungere sezioni "Come Funziona" e "Instagram CTA"
- `src/pages/Lumina.tsx` - Riscrittura quasi completa con tutte le sezioni mancanti
- `src/components/ProjectsSection.tsx` - Aggiornare descrizione conferenza

**Nessuna nuova dipendenza necessaria** - tutto si realizza con i componenti gia' disponibili (framer-motion, lucide-react, tailwind).

