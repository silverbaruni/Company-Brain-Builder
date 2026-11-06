---
name: brain-stato
description: >-
  Check-up del company brain. Controlla connettori, knowledge base, avanzamento del piano, memoria e configurazione, poi propone cosa sistemare. Usala quando l'utente chiede "come sta il brain?", "cosa manca?", "fai un controllo" o dopo molto tempo dall'ultima sessione.
---

# brain-stato

**Prima di tutto leggi `AGENTS.md`.**

Questa skill è di **sola lettura**: non modifica nulla. Alla fine propone azioni e le esegue solo se l'utente lo chiede.

## Controlli

1. **Connettori** (`CONNETTORI.md`)
   - Conta le connessioni per stato: attivo, da verificare, non ancora collegato, disattivato.
   - Per ogni connessione `attivo` di tipo `script`, verifica che il file indicato esista.
   - Chiedi se vuole un test di sola lettura delle connessioni attive. Fallo solo se dice sì.
2. **Knowledge base** (`knowledge_base/`)
   - Cartelle vuote o con solo il README.
   - File non modificati da più di 6 mesi.
   - File presenti ma non descritti in `INDEX.md`.
3. **Piano** (`knowledge_base/contesto_installazione/piano_implementazione.md`)
   - Passi fatti su passi totali, passi bloccati.
4. **Progetti** (`progetti/`)
   - Progetti aperti e da quanto tempo non vengono toccati.
5. **Memoria e archivio**
   - Data dell'ultimo file in `memoria/`.
   - Decisioni con data di revisione già passata.
6. **Configurazione**
   - Segnaposto non compilati (cerca `{{` nei file principali, es. `{{PERCORSO_WIKI}}` in `AGENTS.md`).
   - Skill presenti nella cartella delle skill (vedi `AGENTS.md` sezione 3: `.claude/skills/` o `.agents/skills/` in Codex) ma non elencate nella sezione 2 di `AGENTS.md`, e viceversa.
   - Allineamento tra harness: esegui l'anteprima di `/brain-sincronizza` (senza `--applica` e senza `--attiva`). Se si usa solo Claude Code, segna l'area come a posto. Se ci sono elementi da copiare, conflitti o avvisi, proponi `/brain-sincronizza`.

## Report

Presenta un report breve con un semaforo per area:

```
Connettori        🟢 / 🟡 / 🔴  breve nota
Knowledge base    ...
Piano             ...
Progetti          ...
Memoria/archivio  ...
Configurazione    ...
```

Poi elenca **massimo 5 azioni consigliate**, in ordine di importanza, ciascuna con la skill da usare (es. "Collegare Google Drive: `/brain-installa`").
