---
name: brain-installa
description: >-
  Secondo passo del company brain. Esegue il piano di implementazione creato da brain-intervista, un passo alla volta: collega gli strumenti esterni, scrive gli script dei connettori, crea nuove skill. Usala quando l'utente vuole installare, collegare strumenti o "andare avanti con il piano".
---

# brain-installa

**Prima di tutto leggi `AGENTS.md`** e rispetta le sue regole, in particolare: mai chiedere il contenuto di `.env`, una domanda alla volta.

## Obiettivo

Trasformare il piano in capacità funzionanti, **un passo alla volta**, guidando l'utente con il dialogo. Non fare tutto in un colpo solo.

## Prima di iniziare

1. Leggi `knowledge_base/contesto_installazione/piano_implementazione.md`.
   - Se non esiste, di' all'utente che serve prima `/brain-intervista` e fermati.
2. Leggi `CONNETTORI.md` e `IDEA.md`.
3. Guarda il livello tecnico indicato nel piano e calibra le spiegazioni: con livello base spiega ogni clic, con livello avanzato vai dritto al punto.
4. Trova il primo passo non spuntato `[ ]`.

## Ciclo per ogni passo

1. **Presenta il passo**: cosa faremo, perché (il problema che risolve), quanto tempo serve circa, cosa dovrà fare l'utente.
2. **Chiedi conferma** prima di iniziare. L'utente può anche scegliere un altro passo o rimandarlo.
3. **Scegli il tipo di connessione**, in questo ordine di preferenza:
   1. `mcp`: se esiste un server MCP ufficiale o affidabile per lo strumento;
   2. `script`: se lo strumento ha un'API utilizzabile;
   3. `export`: se l'API non c'è o è troppo limitata, ma si possono esportare CSV o JSON;
   4. `key+ref`: se basta una chiave e una guida per usarla al bisogno.
   Spiega la scelta in una frase. Se serve installare qualcosa di nuovo (server MCP, pacchetti, programmi), prima di chiedere conferma di' all'utente:
   - chi lo pubblica: il produttore dello strumento (ufficiale) o una persona o azienda terza;
   - dove si trova il codice (sito o repository);
   - quali permessi chiede (sola lettura o anche scrittura, su quali dati);
   - che è codice di terze parti, non controllato dal brain, e che lo installa sotto la sua responsabilità.
   Preferisci sempre i server ufficiali. Se non c'è niente di ufficiale, dillo chiaramente.
4. **Guida l'utente** nelle parti che può fare solo lui: creare un account, generare una chiave API, dare permessi. Per le chiavi di' sempre: "Apri il file `.env` e aggiungi la riga `NOME_VARIABILE=la_tua_chiave`. Avvisami quando hai fatto." Non chiedere mai di incollare la chiave in chat.
5. **Implementa** seguendo le convenzioni di `connettori/README.md`:
   - script in `connettori/script/{tool}.py` (o `.sh`);
   - guide API in `connettori/riferimenti/{tool}-api.md`;
   - export in `connettori/export/{tool}/`;
   - nuove skill nella cartella delle skill (vedi `AGENTS.md` sezione 3: `.claude/skills/` o `.agents/skills/` in Codex), in `brain-{nome}/SKILL.md`, che iniziano con "Prima di tutto leggi `AGENTS.md`".
6. **Testa**: esegui una prova semplice e di sola lettura (es. leggere gli ultimi 3 elementi) e mostra il risultato all'utente.
7. **Registra**:
   - aggiorna la riga in `CONNETTORI.md` (tipo, autenticazione, stato `attivo`, file) e aggiungi la sezione nelle note;
   - spunta il passo nel piano `[x]` con la data;
   - se hai creato una skill, aggiungila alla sezione 2 di `AGENTS.md`;
   - se hai creato o modificato una skill, un server MCP o un agente, lancia `/brain-sincronizza` per portarlo anche nelle altre harness;
   - se hai creato una cartella nuova, segui la sezione 9 di `AGENTS.md`.
8. **Fermati** e chiedi: "Passiamo al prossimo passo ({nome}) o ci fermiamo qui?". Se si ferma, proponi `/brain-domani`.

## Se qualcosa non funziona

- Spiega il problema in parole semplici e proponi al massimo due soluzioni.
- Se non si risolve, segna lo stato `da verificare` in `CONNETTORI.md`, annota il motivo nel piano sotto il passo e passa al successivo solo se l'utente è d'accordo.
- Se durante l'installazione si sceglie una strada diversa dal piano, proponi di registrarla con `/brain-decisione`.

## Fine del piano

Quando tutti i passi sono spuntati, fai un riepilogo di cosa è attivo e proponi `/brain-stato` per un controllo e `/brain-evolvi` per i miglioramenti successivi.
