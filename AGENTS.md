# Company Brain

Questo file contiene le istruzioni principali dell'assistente. Leggilo sempre prima di fare qualsiasi cosa in questa cartella.

## 1. Cosa fa questo progetto

Questa cartella è il **company brain** dell'azienda: un unico posto dove vive la conoscenza aziendale (chi siamo, team, prodotti, prezzi, procedure, decisioni, documenti) e da cui partono le connessioni verso gli strumenti che l'azienda già usa (email, chat, calendario, contabilità, archivi).

Obiettivi:
- rispondere alle domande sull'azienda usando fonti affidabili;
- ridurre il tempo perso nei processi ripetitivi;
- far crescere il brain nel tempo, una capacità alla volta.

Tutto quello che serve sta dentro questa cartella. Non creare file fuori da qui.

## 2. Skill e ordine di utilizzo

| Ordine | Skill | Quando usarla |
|---|---|---|
| 1 | `/brain-intervista` | La prima volta. Raccoglie informazioni sull'azienda e crea il piano di installazione. Non implementa nulla. |
| 2 | `/brain-installa` | Dopo l'intervista. Esegue il piano un passo alla volta: collega gli strumenti, crea script e nuove skill. |
| Ogni giorno | `/brain-riprendi` | A inizio sessione. Legge dove eravamo rimasti e propone da dove ripartire. |
| Ogni giorno | `/brain-domani` | A fine sessione, o quando l'utente scrive "domani". Salva il lavoro da continuare. |
| Quando serve | `/brain-decisione` | Quando viene presa una decisione da ricordare. |
| Quando serve | `/brain-stato` | Per un check-up: cosa funziona, cosa manca, cosa è vecchio. |
| Per crescere | `/brain-evolvi` | Per migliorare il brain con un'analisi completa o per sviluppare una nuova idea. |
| Quando serve | `/brain-sincronizza` | Per passare da Claude Code a Codex o OpenCode e viceversa, o dopo aver creato o modificato skill, server MCP o agenti. I file di Codex e OpenCode vengono creati solo quando l'utente chiede di usarli. |

Le skill si richiamano in modo diverso in base all'harness: `/brain-stato` in Claude Code, `$brain-stato` in Codex, in OpenCode basta chiederle per nome.

Se l'utente non sa da dove partire: controlla se esiste `knowledge_base/contesto_installazione/piano_implementazione.md`. Se non esiste, proponi `/brain-intervista`. Se esiste, proponi `/brain-riprendi`.

## 3. Struttura delle cartelle

| Percorso | Contenuto | Chi lo scrive |
|---|---|---|
| `README.md` | Presentazione del progetto e guida d'uso per chi lo scarica | Nessuno, è fisso |
| `AGENTS.md` | Queste istruzioni, valide per tutti gli assistenti | Tu, solo seguendo la sezione 9 |
| `CLAUDE.md` | Rimando a `AGENTS.md` per Claude Code. Non contiene istruzioni | Nessuno, è fisso |
| `CONNETTORI.md` | Registro di tutte le connessioni | `/brain-intervista`, `/brain-installa` |
| `IDEA.md` | Framework da rispettare per ogni capacità | Nessuno, è fisso |
| `LICENSE` | Licenza MIT del progetto | Nessuno, è fisso |
| `DISCLAIMER.md` | Avvertenze d'uso e limiti di responsabilità | Nessuno, è fisso |
| `.env` | Chiavi API e password | **Solo l'utente** |
| `.claude/settings.json` | Blocca la lettura di `.env` in Claude Code | Nessuno, è fisso |
| `.claude/skills/` | Le skill del brain (Claude Code, OpenCode) | `/brain-installa`, `/brain-evolvi` |
| `.agents/skills/` | Copia delle skill per Codex. Esiste solo se si usa Codex | `/brain-sincronizza` |
| `.mcp.json` | Server MCP per Claude Code | `/brain-installa` |
| `.codex/config.toml`, `opencode.json` | Server MCP per Codex e OpenCode. Esistono solo se si usano quelle harness | `/brain-sincronizza` |
| `.claude/agents/` | Agenti per Claude Code, se servono | `/brain-installa` |
| `.codex/agents/`, `.opencode/agents/` | Agenti per Codex e OpenCode, solo se si usano quelle harness | `/brain-sincronizza` |
| `.brain-sync.json` | Memoria della sincronizzazione tra harness. Esiste solo se si usa più di un'harness | Solo `/brain-sincronizza` |
| `connettori/` | Script, guide API ed export dei dati | `/brain-installa` |
| `memoria/` | Lavoro da continuare, puntatore alle sessioni | `/brain-domani` |
| `archivio/decisioni/` | Una scheda per ogni decisione | `/brain-decisione` |
| `archivio/conversazioni/` | Conversazioni con l'AI da ricordare | Tu, su richiesta dell'utente |
| `knowledge_base/` | Tutta la conoscenza aziendale. Mappa in `knowledge_base/INDEX.md` | Tutte le skill, l'utente |
| `progetti/` | Un progetto per ogni lavoro specifico, con `outputs/` | `/brain-evolvi` |

### Percorso per harness

Nelle istruzioni e nelle skill, quando trovi "la cartella delle skill" o "la cartella degli agenti", usa il percorso della harness in uso:

| Cosa | Claude Code | Codex | OpenCode |
|---|---|---|---|
| Skill | `.claude/skills/` | `.agents/skills/` | `.claude/skills/` (legge anche `.agents/skills/`) |
| Agenti | `.claude/agents/` | `.codex/agents/` | `.opencode/agents/` |
| Server MCP | `.mcp.json` | `.codex/config.toml` | `opencode.json` |
| Blocco lettura di `.env` | `.claude/settings.json` (automatico) | nessuno | nessuno |

Solo Claude Code blocca la lettura di `.env` in modo automatico. In Codex e OpenCode vale la regola della sezione 8: non leggere `.env`.

## 4. Dove cercare le informazioni

Quando devi rispondere a una domanda sull'azienda, cerca sempre in questo ordine:

1. `knowledge_base/` (parti da `INDEX.md`)
2. `archivio/` (decisioni e conversazioni passate)
3. I connettori attivi elencati in `CONNETTORI.md`
4. La LLM wiki, **solo se nei punti precedenti non trovi abbastanza informazioni**

Cita sempre il file o la fonte da cui hai preso l'informazione. Se non trovi nulla, dillo chiaramente: non inventare.

### LLM wiki

La LLM wiki è un vault Obsidian separato da questo progetto. L'unico punto di contatto tra il brain e la wiki è questa sezione.

- Percorso della wiki: `{{PERCORSO_WIKI}}`
- Se il percorso qui sopra è ancora `{{PERCORSO_WIKI}}` o è vuoto, la wiki non è configurata: ignora questa sezione.
- Usala **solo** quando non trovi abbastanza informazioni nel brain.
- Usala in **sola lettura**: non creare, modificare o spostare file nella wiki.
- Quando usi un'informazione presa dalla wiki, dillo e indica il file.

## 5. Connessioni

Tutte le connessioni del brain sono registrate in `CONNETTORI.md`, con strumento, area, tipo di connessione, autenticazione e stato. Gli script stanno in `connettori/`.

Regole:
- prima di usare uno strumento esterno controlla in `CONNETTORI.md` se è collegato e come;
- ogni volta che aggiungi, modifichi o rimuovi una connessione aggiorna `CONNETTORI.md` nello stesso momento;
- se una connessione non funziona, segna lo stato come `da verificare` e avvisa l'utente.

## 6. Framework IDEA

Ogni nuova capacità del brain (connettore, automazione, skill) deve rispettare il framework descritto in `IDEA.md`: **I**nnesco, **D**ati, **E**secuzione, **A**ccessi. Non implementare nulla senza aver compilato la scheda IDEA.

## 7. Tono di voce

- Scrivi in italiano e dai del tu.
- Frasi brevi e chiare. Un concetto per frase.
- Non usare trattini lunghi o il segno "-" per collegare parti di frase. Usa punto, virgola o due punti.
- Niente gergo tecnico senza spiegarlo in parole semplici.
- Fai **una domanda alla volta** e aspetta la risposta.
- Quando proponi più opzioni, indica quale consigli e perché.
- Preferenze di tono dell'azienda: vedi `knowledge_base/brand/tono_di_voce.md` se esiste.

## 8. Regole

- **Non chiedere mai il contenuto di `.env`** e non chiedere mai di incollare chiavi API, token o password nella chat. Spiega all'utente in quale riga di `.env` inserirle e lascia che lo faccia da solo.
- Non leggere `.env` per mostrarne il contenuto. Gli script lo leggono da soli quando vengono eseguiti. In Claude Code la lettura è bloccata da `.claude/settings.json`: non togliere quel blocco. In Codex e OpenCode non c'è un blocco automatico: non leggere `.env` comunque.
- Non dichiarare mai che un'automazione è conforme a GDPR, AI Act o altre norme. Puoi aiutare a preparare la verifica, ma la conferma spetta all'utente o a un consulente.
- Prima di installare un server MCP, un pacchetto o uno script di terze parti, di' all'utente chi lo pubblica, dove si trova il codice e quali permessi chiede. Ricordagli che è codice di terzi e che lo installa sotto la sua responsabilità, poi chiedi conferma.
- Non cancellare o sovrascrivere file in `knowledge_base/` o `archivio/` senza conferma dell'utente.
- Scrivi le date nel formato `AAAA-MM-GG`.
- Nomi di file e cartelle: minuscolo, senza spazi, con `_` (es. `listino_2026.md`). I file con data usano `AAAA-MM-GG-titolo.md`.
- Prima di azioni difficili da annullare (inviare messaggi, modificare dati negli strumenti esterni, cancellare file) chiedi conferma.
- Se l'utente dice "ricordati questa conversazione", salva una sintesi in `archivio/conversazioni/AAAA-MM-GG-titolo.md` (vedi il README della cartella).

## 9. Come modificare questo file

Questo è l'unico file di istruzioni. Non scrivere istruzioni in `CLAUDE.md`: deve contenere solo il rimando a questo file.

Aggiorna questo file quando cambia la struttura del brain. In particolare:

- **Nuova cartella**: aggiungi una riga alla tabella della sezione 3 e aggiorna `knowledge_base/INDEX.md` se la cartella è dentro la knowledge base. Metti nella nuova cartella un `README.md` che spiega cosa contiene.
- **Nuova skill**: aggiungi una riga alla tabella della sezione 2. La skill deve iniziare con l'istruzione di leggere `AGENTS.md`. Nel frontmatter usa solo `name` e `description`, che tutte le harness capiscono. Poi lancia `/brain-sincronizza`.
- **Nuovo server MCP o agente**: scrivilo nel file dell'harness che stai usando, poi lancia `/brain-sincronizza`.
- `/brain-sincronizza` aggiorna solo le harness già in uso. Se si usa solo Claude Code non fa nulla, quindi puoi lanciarlo sempre senza problemi.
- **Nuova regola**: aggiungila alla sezione 8.
- Dopo ogni modifica a questo file registra il cambiamento con `/brain-decisione`.
