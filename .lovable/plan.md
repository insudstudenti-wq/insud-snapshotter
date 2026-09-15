# LUMINA: articoli di nuovo visibili con il database integrato

## Perché ora non si vedono

La pagina LUMINA chiede gli articoli a un database esterno che non risponde più: tutte le richieste falliscono, quindi la lista resta vuota. I 5 articoli scritti finora sono comunque ancora salvati dentro al sito, quindi non è andato perso nulla.

## Cosa faccio

1. Attivo il database integrato di Lovable (nessun account esterno, nessuna configurazione da parte tua).
2. Ricreo la struttura per articoli, autori, categorie/serie e tag.
3. Sposto dentro i 5 articoli esistenti con autore, serie, data e testo completo (compresi i link ai partiti nell'articolo sul referendum).
4. Collego la pagina LUMINA e le pagine di lettura al nuovo database.
5. Mantengo la pagina di pubblicazione e gestione articoli, così puoi aggiungerne di nuovi da solo.
6. Controllo in anteprima che la lista e ogni singolo articolo si aprano correttamente.

Gli articoli restano leggibili da tutti senza login; scrivere e modificare resta un'operazione riservata.

## Dettagli tecnici

- `supabase--enable`, poi migrazione: tabelle `authors`, `categories`, `tags`, `articles` (con `content_blocks jsonb`, `links jsonb`, `slug` unico), `article_tags`; GRANT `SELECT` ad `anon`/`authenticated`, `ALL` a `service_role`; RLS attiva con policy di lettura pubblica.
- Seed dei 5 articoli da `src/data/articles.ts` via `run_sql`.
- `src/lib/supabase.ts`: passaggio al client generato di Lovable Cloud (`src/integrations/supabase/client.ts`), rimozione delle variabili `VITE_SUPABASE_*` lette da `.env.local`.
- `src/lib/articleApi.ts`: adeguamento query/tipi al nuovo schema, incluso `links`.
- `LuminaDynamic.tsx` / `ArticleDynamicPage.tsx`: fallback e stati di caricamento/errore verificati.
