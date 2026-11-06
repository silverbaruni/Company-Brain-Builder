# Sessioni

Claude Code salva le conversazioni complete in una cartella globale, fuori da questo progetto. Questo file indica la cartella **di questo progetto** e tiene un elenco breve delle sessioni.

**Cartella delle sessioni:** `{{PERCORSO_SESSIONI}}`

Dove si trova: `~/.claude/projects/{percorso-di-questa-cartella}/`, dove `~` è la cartella del tuo utente. Il nome della sottocartella è il percorso completo di questo progetto, con `\`, `/`, `:` e spazi sostituiti da `-` (es. `~/.claude/projects/c--Users-mario-Documenti-Company-Brain/`).

<!-- Lo compila /brain-domani la prima volta, seguendo questa regola:
1. Prendi il percorso completo di questa cartella builder sul computer del cliente
   (es. C:\Users\mario\Documenti\Company Brain\builder).
2. Sostituisci ogni "\", "/", ":" e spazio con "-"
   (es. C--Users-mario-Documenti-Company-Brain-builder).
3. Cerca quel nome dentro ~/.claude/projects/ senza badare a maiuscole e minuscole
   (la lettera del disco può essere C-- oppure c--).
4. Scrivi qui il percorso completo solo se la cartella esiste davvero
   (es. ~/.claude/projects/c--Users-mario-Documenti-Company-Brain-builder/).
Non indicare mai ~/.claude/projects/ da solo: contiene le sessioni di tutti i progetti. -->

Ogni file `.jsonl` in quella cartella è una sessione completa. Il riassunto di ogni giornata sta invece in `memoria/AAAA-MM-GG.md`.

## Elenco

<!-- Una riga per sessione, la più recente in cima:
- AAAA-MM-GG: riassunto in una frase (dettagli in memoria/AAAA-MM-GG.md) -->
