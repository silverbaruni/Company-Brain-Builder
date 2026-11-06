---
name: brain-sincronizza
description: >-
  Allinea il brain tra Claude Code, Codex e OpenCode: copia skill, server MCP e agenti da un'harness alle altre, capendo da sola dove sono state fatte le modifiche. Usala quando l'utente vuole passare a un'altra harness, quando ha creato o modificato una skill, un connettore MCP o un agente, o quando scrive "sincronizza", "voglio usare Codex", "voglio usare OpenCode", "torno a Claude".
---

# brain-sincronizza

**Prima di tutto leggi `AGENTS.md`.**

Il brain si può usare con tre harness: Claude Code, Codex e OpenCode. Ognuna legge i file in posti e formati diversi. Questa skill li tiene allineati, in qualsiasi direzione.

**Claude Code è la base ed è sempre attivo.** I file di Codex e OpenCode non esistono finché l'utente non chiede di usarli. Lo script sincronizza solo le harness **attive**:
- Codex è attivo se esiste `.agents/skills/` o `.codex/`;
- OpenCode è attivo se esiste `opencode.json` o `.opencode/`;
- un'harness non ancora attiva si attiva con `--attiva codex`, `--attiva opencode` o `--attiva codex,opencode`.

Se è attivo solo Claude Code, lo script non crea e non modifica nessun file.

## Cosa viene allineato

| Cosa | Claude Code | Codex | OpenCode |
|---|---|---|---|
| Istruzioni | `CLAUDE.md` (solo `@AGENTS.md`) | `AGENTS.md` | `AGENTS.md` |
| Skill | `.claude/skills/` | `.agents/skills/` | legge entrambe |
| Server MCP | `.mcp.json` | `.codex/config.toml` | `opencode.json` |
| Agenti | `.claude/agents/*.md` | `.codex/agents/*.toml` | `.opencode/agents/*.md` |

Le istruzioni non si copiano: stanno solo in `AGENTS.md`. Lo script controlla soltanto che `CLAUDE.md` contenga il rimando e nient'altro.

## Procedura

1. **Controlla che Node sia installato**: esegui `node --version`. Se il comando non esiste, segui `regole-manuali.md` invece dei passi seguenti.
2. **Anteprima**: dalla cartella del brain esegui
   ```
   node .claude/skills/brain-sincronizza/script/sincronizza.mjs
   ```
   Se l'utente ha chiesto di passare a Codex o OpenCode e quell'harness non è ancora attiva, aggiungi `--attiva codex` (o `opencode`). **Non usare mai `--attiva` se l'utente non l'ha chiesto**: creerebbe file che non gli servono.
   Se la cartella `.claude/skills/brain-sincronizza` non c'è, usa lo stesso percorso dentro `.agents/skills/`. L'anteprima non modifica nulla.
   Se il resoconto dice che si usa solo Claude Code, dillo all'utente in una frase e fermati.
3. **Spiega il risultato** all'utente in parole semplici: cosa verrà copiato e da dove. Se l'anteprima dice che è tutto allineato e non ci sono avvisi, dillo e fermati.
4. **Conflitti** (stesso elemento modificato in modo diverso in due harness): apri i file indicati, mostra all'utente la differenza in poche righe e chiedi quale versione tenere. Una domanda per conflitto.
5. **Eliminazioni** (elemento cancellato in un'harness ma ancora presente nelle altre): chiedi se va cancellato ovunque o ripristinato. Per ripristinarlo si sceglie l'harness da cui ricopiarlo.
6. **Esegui** con le scelte dell'utente:
   ```
   node .claude/skills/brain-sincronizza/script/sincronizza.mjs --applica --risolvi mcp:notion=codex --risolvi skill:prova=elimina
   ```
   Se nell'anteprima hai usato `--attiva`, ripetilo anche qui.
   La chiave da usare dopo `--risolvi` è quella tra parentesi quadre nel resoconto. Valori possibili: `claude`, `codex`, `opencode`, `elimina`.
7. **Avvisi**: per ognuno spiega cosa significa e cosa deve fare l'utente. I casi più comuni:
   - `CLAUDE.md` contiene testo in più: proponi di spostarlo in `AGENTS.md` (chiedi conferma) e di lasciare in `CLAUDE.md` solo `@AGENTS.md`;
   - skill in `.opencode/skills/`: proponi di spostarla in `.agents/skills/` e rilancia la skill;
   - agente creato in un'altra harness: modello e permessi vanno impostati a mano, perché ogni harness usa nomi diversi.
8. **Chiudi** dicendo come si richiamano le skill nell'harness che l'utente vuole usare:
   - Claude Code: `/brain-riprendi`;
   - Codex: `$brain-riprendi`. La prima volta Codex chiede se fidarsi della cartella: va risposto sì, altrimenti non legge `.codex/config.toml`;
   - OpenCode: basta chiedere, per esempio "usa la skill brain-riprendi".
   Per i server MCP con login (es. Notion) l'utente deve fare il login una volta in ogni harness.

## Regole

- Non modificare mai a mano `.brain-sync.json`: è la memoria della sincronizzazione.
- Non usare `--risolvi` senza aver chiesto all'utente.
- Non leggere né copiare `.env`. Le chiavi nei server MCP vanno scritte come variabili (`${NOME}`), mai come valore.
- Se lo script dà un errore di lettura, mostra il file e la riga indicati e aiuta l'utente a correggerli. Poi rilancia l'anteprima.
