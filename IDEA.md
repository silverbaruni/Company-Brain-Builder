# Framework IDEA

IDEA è il framework su cui si basa ogni capacità del company brain. Va rispettato sempre: ogni connettore, automazione o skill nasce da una scheda IDEA compilata.

## Le quattro parti

### I · Innesco (Trigger)
Cosa attiva la capacità.
- È manuale (l'utente la chiama), automatica (un evento), schedulata (ogni giorno alle 9) o via webhook?
- Chi o cosa la avvia?
- Quanto spesso succede?

### D · Dati (Conoscenza)
Dove sta la conoscenza che serve.
- In quale strumento o file si trova?
- In che formato (documento, foglio, email, database)?
- Di che qualità è (aggiornata, completa, ordinata)?
- È raggiungibile via API o va esportata a mano?

### E · Esecuzione (Azioni)
Cosa fa l'AI in autonomia.
- Quali passaggi compie, in ordine?
- Cosa produce (risposta, file, bozza, messaggio)?
- Dove serve una conferma umana prima di procedere?

### A · Accessi (Connessioni)
Quali sistemi devono essere collegati.
- Quali connettori servono? Sono già in `CONNETTORI.md`?
- Che tipo di connessione e di autenticazione?
- Quali dati o permessi mancano ancora?

## Scheda da copiare

```markdown
## Scheda IDEA: {nome capacità}

**Obiettivo:** cosa risolve, in una frase.

**I · Innesco**
- Tipo: manuale / automatico / schedulato / webhook
- Dettaglio:

**D · Dati**
- Fonti:
- Formato:
- Qualità:
- Raggiungibile via API: sì / no / in parte

**E · Esecuzione**
1.
2.
- Output:
- Conferma umana richiesta su:

**A · Accessi**
- Connettori necessari:
- Già collegati:
- Mancanti:

**Priorità:** alta / media / bassa
**Stato:** da fare / in corso / fatto
```

## Valutazione dei rischi (prima di ogni automazione)

Ogni automazione deve essere preceduta da una valutazione dei rischi. Senza questa valutazione non si implementa nulla, anche se la scheda IDEA è già compilata.

Prima di partire bisogna capire due cose:
- **Che dati stiamo dando all'AI.** Sono dati personali, sensibili, finanziari, riservati o di clienti e dipendenti? Servono tutti, o ne bastano meno?
- **Che permessi stiamo dando all'AI.** Può solo leggere o anche scrivere, inviare, modificare, cancellare? Su quali strumenti e con quali account?

Poi bisogna far sì che i rischi si azzerino, o almeno si riducano al minimo:
- dare all'AI solo i dati strettamente necessari;
- usare permessi minimi e, dove possibile, in sola lettura;
- tenere una conferma umana prima di ogni azione difficile da annullare;
- non inserire mai chiavi o password nella chat: stanno solo in `.env`.

### Conformità

Ogni automazione deve rispettare:
- **AI Act** (Regolamento UE sull'intelligenza artificiale);
- **GDPR** (Regolamento UE sulla protezione dei dati personali);
- eventuali altre normative in vigore.

L'AI può aiutarti a preparare la verifica: elencare i dati coinvolti, i rischi e le misure. **Non può però certificare la conformità.** La verifica la fai tu, o il tuo responsabile privacy o un consulente, e va scritta nella scheda con nome e data.

### Da aggiungere alla scheda IDEA

```markdown
**R · Rischi (da compilare prima di procedere)**
- Dati forniti all'AI:
- Dati personali o sensibili coinvolti: sì / no
- Permessi dati all'AI:
- Misure per azzerare i rischi:
- Verifica AI Act: da verificare / verificata da {nome} il AAAA-MM-GG
- Verifica GDPR: da verificare / verificata da {nome} il AAAA-MM-GG
  (l'AI non compila mai "verificata": lo fa solo una persona)
```

### Privilegio minimo

Ogni automazione deve avere solo i permessi che servono per fare il suo lavoro, e nient'altro.
- Parti sempre dalla **sola lettura**. Aggiungi la scrittura solo se serve davvero.
- Usa **account di servizio dedicati**, non l'account personale di una persona. Meglio uno per ogni connettore.
- Limita l'accesso alle sole cartelle, caselle o archivi necessari, non a tutto lo strumento.
- Revoca i permessi quando l'automazione non è più usata.
- Rivedi i permessi ogni tanto: quelli dati "per provare" tendono a restare.

### DPA con i fornitori

Prima di collegare uno strumento o un servizio AI che tratta dati personali, serve un **DPA** (Data Processing Agreement, accordo sul trattamento dei dati) con il fornitore.
- Controlla che il DPA sia firmato o accettato prima di inviare dati.
- Verifica che i tuoi dati **non vengano usati per addestrare i modelli** del fornitore.
- Verifica dove sono conservati i dati e se escono dall'UE. In quel caso servono garanzie adeguate.
- Verifica per quanto tempo il fornitore conserva i dati e come li cancella.
- Registra il fornitore e l'esito del controllo in `CONNETTORI.md`.

### Altre norme e sicurezza

Oltre a quanto scritto sopra, valuta sempre ogni automazione in base alla tua industria e alle normative vigenti.
