---
name: brain-intervista
description: >-
  Primo passo del company brain. Intervista l'utente sull'azienda, sugli strumenti usati e sui processi, salva le risposte e crea il piano di installazione dei connettori e delle nuove skill. Usala quando l'utente vuole iniziare, configurare il brain, "fare il questionario" o "fare l'intervista". Non implementa nulla.
---

# brain-intervista

**Prima di tutto leggi `AGENTS.md`** e rispetta le sue regole, in particolare il tono di voce e il divieto di chiedere il contenuto di `.env`.

## Obiettivo

Raccogliere tutte le informazioni necessarie per costruire il company brain e trasformarle in un piano di implementazione. In questa fase **raccogli e scrivi soltanto**: non collegare strumenti, non scrivere script, non creare skill. Quello è il lavoro di `/brain-installa`.

## Prima di iniziare

1. Controlla se esiste `knowledge_base/contesto_installazione/questionario.md`.
   - Se esiste, leggilo e riparti dalla prima domanda senza risposta. Dillo all'utente: "Riprendiamo da dove eravamo rimasti: blocco X, domanda Y".
   - Se non esiste, crealo copiando la struttura di `domande.md` con il campo risposta vuoto.
2. Spiega all'utente in 3 righe cosa succederà: domande a blocchi, una alla volta, si può saltare, si possono allegare file, alla fine riceverà un piano.

## Durante l'intervista

- Fai le domande di `domande.md` **una alla volta**, nell'ordine dei blocchi. Puoi riformularle in modo naturale, ma non saltarne nessuna obbligatoria senza che l'utente lo chieda.
- Dopo ogni risposta, **scrivila subito** in `knowledge_base/contesto_installazione/questionario.md` sotto la domanda. Così nulla si perde se la sessione si interrompe.
- Se la risposta è vaga, fai una domanda di approfondimento (massimo due). Esempio: "Usi Slack per tutto il team o solo per alcuni reparti?".
- Se l'utente scrive "salta", segna `(saltata)` e vai avanti.
- Se l'utente allega un file o ne indica il percorso, copialo nella cartella giusta di `knowledge_base/` (vedi `knowledge_base/INDEX.md`) e annota il percorso nella risposta.
- Alla fine di ogni blocco fai un riepilogo di due righe e chiedi se è corretto.
- Ogni volta che emerge uno strumento (es. "usiamo Fatture in Cloud"), segnalo: servirà per `CONNETTORI.md`.
- Se l'utente scrive una chiave API in chat, non ripeterla, non salvarla e spiegagli che va messa in `.env`.

## Dopo l'ultima domanda

Scrivi questi file, poi mostra all'utente un riepilogo e chiedi conferma prima di chiudere.

### 1. Sintesi in `knowledge_base/contesto_installazione/`
- `profilo_azienda.md`: chi è l'utente, azienda, mission, vision, obiettivi, offerta, clienti.
- `strumenti.md`: tabella strumento | area | cosa ci si fa | chi lo usa.
- `processi_e_colli_di_bottiglia.md`: processi in cui si perde tempo, quanto tempo, se esiste una SOP, dove sta la conoscenza "nella testa".

### 2. Popola la knowledge base
Con quello che è emerso, crea o aggiorna:
- `knowledge_base/chi_siamo/azienda.md`
- `knowledge_base/team_e_reparti/team.md`
- `knowledge_base/pricing/offerta.md` (se ha dato prezzi o listini)
- `knowledge_base/brand/tono_di_voce.md` (se ha descritto il tono)

### 3. Aggiorna `CONNETTORI.md`
Aggiungi una riga per ogni strumento emerso, con area e stato `non ancora collegato`. Cancella la riga di esempio.

### 4. Configura la LLM wiki
Se l'utente ha indicato un vault Obsidian, sostituisci `{{PERCORSO_WIKI}}` in `AGENTS.md` con il percorso. Se non ce l'ha, lascia il segnaposto.

### 5. Crea `knowledge_base/contesto_installazione/piano_implementazione.md`
Il piano dice a `/brain-installa` cosa fare e in che ordine. Struttura:

```markdown
# Piano di implementazione
Creato il: AAAA-MM-GG
Livello tecnico dell'utente: base / medio / avanzato

## Passi
- [ ] 1. {Nome passo} · tipo: connettore / skill / automazione · priorità: alta
- [ ] 2. ...

## Dettaglio passi

### 1. {Nome passo}
Perché: quale problema emerso nell'intervista risolve.
{Scheda IDEA compilata, vedi IDEA.md}
Tipo connessione proposto: mcp / script / export / key+ref
Cosa dovrà fare l'utente: (es. creare una chiave API, dare un permesso)
```

Regole per il piano:
- ordina i passi per impatto: prima ciò che toglie più tempo perso, poi il resto;
- i connettori base (dove sta la conoscenza, dove si parla col team) vengono prima delle automazioni che li usano;
- per ogni processo senza SOP proponi anche un passo "scrivere la SOP" in `knowledge_base/procedure/`;
- proponi nuove skill solo dove c'è un processo ripetitivo chiaro;
- massimo 10 passi: se ne servono di più, il resto va in una sezione "Dopo".

## Chiusura

Mostra il piano in forma breve (lista dei passi) e di' all'utente che il prossimo passo è `/brain-installa`. Non iniziare l'installazione.
