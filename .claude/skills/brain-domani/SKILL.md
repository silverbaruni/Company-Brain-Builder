---
name: brain-domani
description: >-
  Salva il lavoro da continuare alla prossima sessione. Usala quando l'utente scrive "domani", "ci vediamo domani", "chiudiamo qui", "salva dove siamo arrivati" o vuole chiudere la sessione.
---

# brain-domani

**Prima di tutto leggi `AGENTS.md`.**

## Cosa fare

1. Ripercorri la sessione e individua:
   - cosa è stato fatto;
   - cosa è rimasto a metà;
   - il prossimo passo concreto;
   - i file creati o modificati;
   - domande aperte o cose che l'utente deve fare prima della prossima volta (es. "creare la chiave API di HubSpot").
2. Scrivi `memoria/AAAA-MM-GG.md` con la data di oggi. Se esiste già, aggiungi una nuova sezione con l'ora invece di sovrascrivere.

```markdown
# AAAA-MM-GG

## Fatto oggi
-
## In sospeso
-
## Prossimo passo
Una frase chiara: da dove ripartire.
## Da fare per l'utente prima della prossima sessione
-
## File toccati
-
```

3. Aggiorna `memoria/sessioni.md`:
   - se la cartella delle sessioni è ancora `{{PERCORSO_SESSIONI}}` o punta a `~/.claude/projects/` senza sottocartella, calcolala con la regola scritta nel commento di `memoria/sessioni.md`: percorso completo di questa cartella, con `\`, `/`, `:` e spazi sostituiti da `-`, cercato in `~/.claude/projects/` senza badare a maiuscole e minuscole. Scrivila solo se la cartella esiste; se non la trovi, lascia il segnaposto e avvisa l'utente;
   - aggiungi in cima all'elenco una riga con la data e il riassunto in una frase della sessione.
4. Se durante la sessione è stata presa una decisione importante non ancora archiviata, proponi `/brain-decisione`.
5. Saluta l'utente con il prossimo passo in una frase e ricordagli di usare `/brain-riprendi` la prossima volta.
