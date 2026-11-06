# Company Brain Builder

Costruisci il **company brain** della tua azienda: un'unica cartella dove vive tutta la conoscenza aziendale (chi siete, team, prodotti, prezzi, procedure, decisioni) e da cui l'assistente AI si collega agli strumenti che usi già (email, chat, calendario, contabilità, archivi).

Non serve saper programmare. Apri la cartella con il tuo assistente AI, lanci un comando e lui ti guida con delle domande, una alla volta.

## Cosa ottieni

- **Un assistente che conosce la tua azienda.** Risponde alle domande usando i tuoi documenti e cita sempre da dove ha preso l'informazione.
- **Meno tempo perso.** Individua i processi ripetitivi e ti aiuta ad automatizzarli, uno alla volta.
- **Memoria tra una sessione e l'altra.** Sa dove eravate rimasti e cosa c'è da fare.
- **Un archivio delle decisioni.** Ogni scelta importante viene salvata con data, motivo e alternative scartate.
- **Un brain che cresce.** Ogni nuova capacità nasce da un metodo preciso (il framework IDEA) e da una valutazione dei rischi.

## Cosa ti serve

| Cosa | Obbligatorio | Note |
|---|---|---|
| [Claude Code](https://claude.com/claude-code) | Sì (oppure Codex o OpenCode) | Funziona da terminale, nell'app desktop o nell'estensione per VS Code. Serve un abbonamento Claude o una chiave API. |
| [Node.js](https://nodejs.org) (versione LTS) | No | Serve solo per sincronizzare il brain tra Claude Code, Codex e OpenCode. Senza Node la sincronizzazione si fa a mano, con le istruzioni incluse. |
| Un editor di codice | Consigliato | Per esempio VS Code, che serve anche per usare l'estensione di Claude Code. |

## Installazione

1. **Scarica il progetto** ed estrai la cartella dove preferisci (per esempio in Documenti). Puoi rinominarla come vuoi.
2. **Apri la cartella con l'assistente.**
   - Da terminale: entra nella cartella e scrivi `claude`.
   - Da VS Code: apri la cartella con *File › Apri cartella* e avvia Claude Code dalla barra laterale.
3. La prima volta Claude Code ti chiede se ti fidi della cartella: rispondi di sì.
4. Scrivi `/brain-intervista` e segui le domande.

Fatto. Da qui in poi è l'assistente a guidarti.

## Come si usa

Il lavoro si divide in due fasi: prima l'assistente ti conosce, poi costruisce.

### 1. L'intervista: `/brain-intervista`

L'assistente ti fa circa 24 domande divise in 6 blocchi: tu e l'azienda, offerta e clienti, team, strumenti, processi, chiusura. Una domanda alla volta.

- Puoi saltare le domande non obbligatorie scrivendo "salta".
- Puoi allegare file (listini, presentazioni, procedure): vengono copiati nella knowledge base.
- Ogni risposta viene salvata subito. Se chiudi a metà, la volta dopo riparte da dove eri rimasto.

Alla fine ottieni:
- la knowledge base compilata con le informazioni sull'azienda;
- l'elenco degli strumenti che usi, in `CONNETTORI.md`;
- un **piano di implementazione**: massimo 10 passi ordinati per impatto.

In questa fase non viene installato nulla.

### 2. L'installazione: `/brain-installa`

L'assistente esegue il piano **un passo alla volta**. Per ogni passo:

1. ti spiega cosa farà, perché e quanto tempo serve;
2. ti chiede conferma;
3. sceglie il modo migliore per collegare lo strumento e ti spiega il perché;
4. ti guida nelle parti che puoi fare solo tu (creare un account, generare una chiave API);
5. fa una prova di sola lettura e ti mostra il risultato;
6. aggiorna il registro dei connettori e spunta il passo nel piano.

Poi si ferma e ti chiede se proseguire.

### 3. Ogni giorno: `/brain-riprendi` e `/brain-domani`

- A inizio sessione scrivi `/brain-riprendi`: l'assistente legge dove eravate rimasti e ti propone da dove ripartire.
- A fine sessione scrivi `/brain-domani` (o semplicemente "domani"): salva cosa è stato fatto, cosa resta e il prossimo passo.

### 4. Quando serve

- `/brain-decisione`: salva una decisione da ricordare.
- `/brain-stato`: fa un check-up e ti dice cosa funziona, cosa manca e cosa è vecchio.
- `/brain-evolvi`: analizza tutto il brain e propone miglioramenti, oppure ti aiuta a trasformare una nuova idea in un progetto concreto, con i diagrammi del processo com'è oggi e come sarà.
- `/brain-sincronizza`: serve se vuoi usare anche Codex o OpenCode (vedi sotto).

### Tutte le skill

| Skill | Quando usarla |
|---|---|
| `/brain-intervista` | La prima volta. Raccoglie le informazioni e crea il piano. |
| `/brain-installa` | Dopo l'intervista. Esegue il piano un passo alla volta. |
| `/brain-riprendi` | A inizio sessione. |
| `/brain-domani` | A fine sessione. |
| `/brain-decisione` | Quando prendi una decisione da ricordare. |
| `/brain-stato` | Per un check-up. |
| `/brain-evolvi` | Per migliorare il brain o sviluppare una nuova idea. |
| `/brain-sincronizza` | Per passare tra Claude Code, Codex e OpenCode. |

Non sai da dove partire? Scrivi semplicemente "da dove comincio?". L'assistente controlla a che punto sei e ti propone la skill giusta.

## Fare domande al brain

Dopo l'intervista puoi chiedere qualsiasi cosa sulla tua azienda, in linguaggio normale. Per esempio:

- "Qual è il prezzo del pacchetto base?"
- "Chi si occupa della fatturazione?"
- "Come si fa l'onboarding di un nuovo cliente?"
- "Perché avevamo scelto questo gestionale?"

L'assistente cerca in quest'ordine:
1. la knowledge base;
2. l'archivio di decisioni e conversazioni;
3. gli strumenti collegati;
4. la tua LLM wiki, se l'hai configurata.

Ti dice sempre da quale file ha preso la risposta. Se non trova nulla, te lo dice invece di inventare.

## Struttura della cartella

```
.
├── AGENTS.md              Istruzioni principali dell'assistente
├── CLAUDE.md              Rimando ad AGENTS.md per Claude Code
├── CONNETTORI.md          Registro di tutti gli strumenti collegati
├── IDEA.md                Il framework da rispettare per ogni nuova capacità
├── DISCLAIMER.md          Avvertenze d'uso
├── LICENSE                Licenza MIT
├── .env                   Le tue chiavi API (lo compili solo tu)
├── .mcp.json              Server MCP collegati a Claude Code
├── .claude/
│   ├── settings.json      Blocca la lettura di .env (solo Claude Code)
│   └── skills/            Le skill del brain (.agents/skills/ in Codex)
├── knowledge_base/        Tutta la conoscenza aziendale (mappa in INDEX.md)
│   ├── contesto_installazione/   Intervista e piano
│   ├── chi_siamo/
│   ├── team_e_reparti/
│   ├── pricing/
│   ├── procedure/
│   ├── brand/
│   └── documenti/
├── connettori/            Script, guide API ed export dei dati
├── memoria/               Il lavoro da continuare tra una sessione e l'altra
├── archivio/
│   ├── decisioni/         Una scheda per ogni decisione
│   └── conversazioni/     Conversazioni da ricordare
└── progetti/              Un progetto per ogni nuova idea, con i suoi output
```

Ogni cartella ha un `README.md` che spiega cosa contiene.

Puoi aggiungere file anche a mano. Per esempio, metti il listino in `knowledge_base/pricing/` e chiedi all'assistente di aggiornare l'indice.

## Come si collegano gli strumenti

Il registro di tutti i collegamenti è `CONNETTORI.md`. L'assistente sceglie il tipo di collegamento in quest'ordine di preferenza:

| Tipo | Cos'è, in parole semplici |
|---|---|
| `mcp` | Un "ponte" ufficiale tra l'assistente e lo strumento (per esempio Notion o Gmail). È il modo più semplice. |
| `script` | Un piccolo programma che legge i dati dallo strumento tramite la sua API. |
| `export` | Si scaricano i dati in un file (CSV o JSON) e l'assistente li legge da lì. |
| `key+ref` | Una chiave API più una guida che spiega all'assistente come usarla quando serve. |

Prima di installare qualsiasi software di terze parti, l'assistente ti dice chi lo pubblica, dove si trova il codice e quali permessi chiede. Poi ti chiede conferma.

## Chiavi API e sicurezza

Le chiavi API e le password vanno **solo** nel file `.env`, nella cartella principale. Se non esiste, crealo.

- **Le inserisci tu.** L'assistente ti dice quale riga aggiungere, per esempio `HUBSPOT_API_KEY=la_tua_chiave`, e aspetta che tu lo faccia.
- **Non incollarle mai in chat.** Se lo fai per sbaglio, l'assistente non le ripete e non le salva.
- **L'assistente non deve leggere `.env`.** In Claude Code il blocco è automatico, in `.claude/settings.json`: non toglierlo. In Codex e OpenCode non c'è un blocco automatico, ma la regola in `AGENTS.md` vieta di leggerlo. Gli script leggono le chiavi da soli quando vengono eseguiti.
- **Non condividere mai `.env`** e non pubblicare il tuo brain compilato. Il `.gitignore` esclude dai commit `.env`, la knowledge base, la memoria, l'archivio e i progetti, ma conviene comunque usare solo repository privati.

Altre protezioni già incluse:
- gli script di default **leggono soltanto**: per scrivere o inviare serve una richiesta esplicita;
- l'assistente chiede conferma prima di inviare messaggi, modificare dati negli strumenti esterni o cancellare file;
- ogni automazione è preceduta da una valutazione dei rischi su dati e permessi.

## Il framework IDEA

Ogni nuova capacità del brain (connettore, automazione, skill) nasce da una scheda in quattro parti:

- **I · Innesco**: cosa la fa partire? Tu, un evento o un orario?
- **D · Dati**: dove sta la conoscenza che serve, e in che stato è?
- **E · Esecuzione**: cosa fa l'AI, passo per passo, e dove serve la tua conferma?
- **A · Accessi**: quali strumenti vanno collegati, e con quali permessi?

Prima di implementare un'automazione si valutano anche i rischi: quali dati riceve l'AI, quali permessi ha, come ridurre entrambi al minimo. I dettagli sono in [IDEA.md](IDEA.md).

L'assistente ti aiuta a preparare le verifiche su GDPR e AI Act, ma **non certifica la conformità**. Quella verifica spetta a te o a un consulente.

## Usarlo con Codex o OpenCode

Il brain funziona anche con **Codex** e **OpenCode**. Tutte le istruzioni stanno in `AGENTS.md`, che leggono tutti e tre.

Claude Code è la base. Per passare a un altro assistente, scrivi in Claude Code:

> "voglio usare Codex" (oppure OpenCode)

La skill `/brain-sincronizza` crea i file necessari e copia skill, server MCP e agenti nel formato giusto. Da quel momento puoi lavorare dove preferisci. Ogni volta che crei o modifichi una skill, un server MCP o un agente, rilanciala per riallineare tutto.

Come si richiamano le skill:
- **Claude Code**: `/brain-stato`
- **Codex**: `$brain-stato`
- **OpenCode**: basta chiederla per nome, per esempio "usa la skill brain-stato"

Se usi solo Claude Code, non devi fare nulla: i file di Codex e OpenCode non vengono creati.

## LLM wiki (facoltativa)

Se hai già un vault Obsidian con appunti personali o di settore, il brain può consultarlo **in sola lettura** quando non trova abbastanza informazioni nei suoi file. Durante l'intervista ti verrà chiesto il percorso della cartella. Se non ce l'hai, salta la domanda.

## Domande frequenti

**Devo saper programmare?**
No. L'assistente scrive gli script e ti spiega ogni passaggio. Durante l'intervista indichi il tuo livello tecnico e lui adatta le spiegazioni.

**Quanto tempo ci vuole?**
L'intervista richiede di solito 30 o 45 minuti. L'installazione procede un passo alla volta, con i tuoi tempi.

**I miei dati dove finiscono?**
I file restano sul tuo computer, in questa cartella. Quello che passa dall'assistente viene inviato al suo fornitore (per esempio Anthropic o OpenAI), secondo i suoi termini. Leggi [DISCLAIMER.md](DISCLAIMER.md).

**Posso modificare le skill?**
Sì. Sono file di testo nella cartella delle skill (vedi `AGENTS.md` sezione 3: `.claude/skills/`, oppure `.agents/skills/` in Codex). Puoi anche chiedere a `/brain-evolvi` di crearne di nuove.

**Ho interrotto l'intervista a metà. Cosa faccio?**
Rilancia `/brain-intervista`: riparte dalla prima domanda senza risposta.

**Posso usarlo per più aziende?**
Sì: usa una copia separata della cartella per ogni azienda.

## Licenza e avvertenze

Il progetto è distribuito con licenza MIT (vedi [LICENSE](LICENSE)). È gratuito e fornito **così com'è**, senza garanzie.

L'AI può sbagliare: controlla sempre i risultati, soprattutto quando riguardano clienti, soldi, contratti o dati personali. Leggi [DISCLAIMER.md](DISCLAIMER.md) prima di iniziare.

Claude, Claude Code, Codex, OpenCode, Notion e gli altri nomi citati sono marchi dei rispettivi proprietari. Il progetto non è affiliato né approvato da nessuno di loro.
