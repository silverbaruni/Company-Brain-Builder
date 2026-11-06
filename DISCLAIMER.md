# Avvertenze d'uso

Company Brain Builder è distribuito gratuitamente, **così com'è**, senza garanzie di alcun tipo. Le condizioni legali complete sono nel file `LICENSE`. Questo documento spiega in parole semplici cosa significa in pratica.

Usando il progetto accetti queste avvertenze.

## 1. È uno strumento, non un servizio

Il progetto è un insieme di istruzioni, skill e script che fai girare tu, sul tuo computer, con l'assistente AI che scegli tu (Claude Code, Codex, OpenCode o altri). L'autore non gestisce i tuoi dati, non vede cosa fai e non fornisce assistenza garantita.

## 2. L'AI può sbagliare

Le risposte, i documenti, gli script e le automazioni prodotti dall'AI possono essere incompleti, imprecisi o sbagliati. **Controllali sempre** prima di usarli, soprattutto quando riguardano clienti, soldi, contratti o dati personali.

## 3. I tuoi dati sono una tua responsabilità

- Decidi tu quali dati dare al brain e a quali servizi collegarlo.
- Se tratti dati personali (di clienti, fornitori, dipendenti), il titolare del trattamento sei tu o la tua azienda, non l'autore del progetto. Spetta a te rispettare il GDPR e le altre norme applicabili.
- I dati che passano dall'assistente AI vengono inviati al fornitore di quell'assistente (per esempio Anthropic o OpenAI), secondo i suoi termini e la sua informativa privacy.
- Fai copie di backup. Il progetto non le fa al posto tuo.
- Il `.gitignore` esclude dai commit `.env`, la knowledge base, la memoria, l'archivio e i progetti, ma **non pubblicare mai il tuo brain** su un repository pubblico.

## 4. Chiavi API e password

Le chiavi vanno solo nel file `.env`, che inserisci tu. Non incollarle in chat e non condividere `.env`. Il progetto include alcune protezioni (per esempio `.claude/settings.json` blocca la lettura di `.env`, ma solo in Claude Code: in Codex e OpenCode non c'è un blocco automatico), ma nessuna protezione è perfetta. La custodia delle tue credenziali resta a te.

## 5. Connettori e software di terze parti

Il brain può proporti di collegare strumenti esterni (Notion, Gmail, CRM, gestionali…) e di installare server MCP, pacchetti o script scritti da altri.

- Quel software **non è parte di questo progetto** e l'autore non lo controlla né lo garantisce.
- Lo installi e lo usi sotto la tua responsabilità, rispettando i termini d'uso di chi lo fornisce.
- Preferisci i connettori ufficiali e dai solo i permessi minimi necessari, se possibile in sola lettura.

## 6. Nessuna consulenza legale né certificazione

Le schede IDEA e le valutazioni dei rischi ti aiutano a ragionare su GDPR, AI Act e sicurezza, ma **non sono un parere legale** e non certificano la conformità di nulla. Per dati particolari, dati di clienti o automazioni importanti, rivolgiti a un consulente o al tuo responsabile privacy.

## 7. Azioni automatiche

Il brain è pensato per chiedere conferma prima di inviare messaggi, modificare dati in strumenti esterni o cancellare file. Sei tu a dare quella conferma: leggi sempre cosa stai approvando. Se modifichi le istruzioni o togli le conferme, lo fai a tuo rischio.

## 8. Marchi

Claude, Claude Code, Codex, OpenCode, Notion e gli altri nomi citati sono marchi dei rispettivi proprietari. Sono citati solo per indicare con quali strumenti funziona il progetto. Il progetto non è affiliato né approvato da nessuno di loro.

## 9. Limitazione di responsabilità

Nei limiti massimi consentiti dalla legge, l'autore non risponde di danni diretti o indiretti, perdita di dati, mancati guadagni, violazioni di norme o altri problemi derivanti dall'uso o dall'impossibilità di usare il progetto, dei contenuti prodotti dall'AI o dei servizi di terze parti collegati. Restano salvi i casi in cui la legge non consente di escludere la responsabilità.
