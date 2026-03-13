

# Correzione tempo di lettura degli articoli

## Problema
I tempi di lettura sono valori statici hardcoded (8, 7, 6 min) che non riflettono la lunghezza reale dei testi. Ogni articolo ha circa 700-800 parole, che corrispondono a circa 3-4 minuti di lettura, non 6-8.

## Soluzione
Invece di correggere manualmente i valori, calcoleremo il tempo di lettura dinamicamente in base al numero di parole effettivo, usando una velocita di lettura media di ~220 parole/minuto (standard per testi in italiano).

## Modifiche

**`src/data/articles.ts`**:
- Rimuovere il campo `readTime` dall'interfaccia `Article` e dai dati statici
- Aggiungere una funzione helper `getReadTime(article)` che conta le parole nel contenuto e calcola il tempo (minimo 1 min)
- Esportare la funzione

**`src/pages/ArticlePage.tsx`** e **`src/pages/Lumina.tsx`** (se usano `readTime`):
- Usare `getReadTime(article)` al posto di `article.readTime`

Questo garantisce che il tempo sia sempre corretto, anche quando si aggiungono nuovi articoli in futuro.

