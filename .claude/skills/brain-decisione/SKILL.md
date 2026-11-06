---
name: brain-decisione
description: >-
  Archivia una decisione da ricordare con data, motivazione e alternative scartate. Usala quando l'utente dice "abbiamo deciso", "segna questa decisione", "ricordati che abbiamo scelto", o quando viene presa una scelta importante sul brain o sull'azienda.
---

# brain-decisione

**Prima di tutto leggi `AGENTS.md`.**

## Cosa fare

1. Se la decisione è già chiara dalla conversazione, scrivi una bozza e falla confermare. Altrimenti chiedi, una domanda alla volta:
   - Cosa è stato deciso?
   - Perché? Qual era il problema o il contesto?
   - Quali alternative sono state valutate e perché sono state scartate?
   - Chi ha deciso?
   - C'è una data in cui rivedere questa decisione?
2. Crea `archivio/decisioni/AAAA-MM-GG-{titolo-breve}.md`:

```markdown
# {Titolo della decisione}
Data: AAAA-MM-GG
Deciso da:
Area: (es. connettori, prezzi, team, processi)

## Decisione
Una o due frasi.

## Contesto
Il problema o la situazione che ha portato alla decisione.

## Perché
I motivi della scelta.

## Alternative scartate
- **{Alternativa}**: perché è stata scartata.

## Da rivedere il
AAAA-MM-GG oppure "non serve"

## Collegamenti
File, progetti o connettori coinvolti.
```

3. Se la decisione sostituisce una decisione precedente, aggiungi in quella vecchia la riga `Superata da: {nome file nuovo}`.
4. Se la decisione cambia qualcosa nel brain (un connettore, una regola, una procedura), chiedi se aggiornare subito il file interessato.
