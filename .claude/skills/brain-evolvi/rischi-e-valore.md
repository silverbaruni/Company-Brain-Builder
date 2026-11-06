# Valutazione rischi e valore

Questo file viene letto da `brain-evolvi` solo quando l'utente accetta la valutazione (passo 7 della Modalità B). Una domanda alla volta, come sempre. Dopo ogni risposta aggiorna la sezione "Rischi e valore" di `progetto.md`.

## Parte 1 · Dati sensibili e sicurezza

1. Riprendi le fonti elencate in **Dati** e negli **Accessi**. Per ognuna chiedi che tipo di informazioni contiene e classificala:
   - **Dati personali**: nomi, email, telefoni, indirizzi di clienti, fornitori o dipendenti.
   - **Dati particolari**: salute, opinioni politiche o religiose, dati giudiziari, dati biometrici.
   - **Dati economici**: IBAN, fatture, stipendi, carte di pagamento.
   - **Credenziali**: password, chiavi API, token.
   - **Riservati aziendali**: prezzi, margini, contratti, strategie.
   - **Nessun dato sensibile.**
2. Domande da fare:
   - Chi vedrà il risultato dell'automazione? Solo tu, il team o anche clienti ed esterni?
   - I dati passano verso servizi esterni o restano negli strumenti che usi già?
   - L'automazione deve solo leggere o deve anche scrivere, inviare o cancellare?
   - Cosa succede se sbaglia? Per esempio un'email al cliente sbagliato o un dato sovrascritto.
   - Si possono usare meno dati? Per esempio solo le iniziali, o niente importi.
3. Per ogni rischio proponi una misura concreta:
   - **Accesso minimo**: sola lettura quando basta, e solo le cartelle e le liste necessarie.
   - **Credenziali solo in `.env`**, inserite dall'utente. Mai in chat, mai nella knowledge base, mai nel codice.
   - **Meno dati possibili**: non salvare in `knowledge_base/` o in `memoria/` dati personali che non servono.
   - **Controllo umano** prima di ogni azione irreversibile o verso l'esterno, come inviare, pagare o cancellare. Aggiorna anche il diagramma TO-BE con un rombo di approvazione.
   - **Traccia**: l'automazione scrive cosa ha fatto in un log leggibile.
   - **Prova prima su dati finti** o su pochi record.
4. Se ci sono **dati particolari**, o dati personali di clienti che escono dall'azienda, consiglia di sentire il responsabile privacy o un consulente GDPR prima di andare in produzione. Non dare pareri legali definitivi.
5. Riassumi in una tabella:

   | Rischio | Probabilità (bassa/media/alta) | Impatto (basso/medio/alto) | Misura |
   |---------|-------------------------------|---------------------------|--------|

6. Ogni misura diventa un passo del piano di implementazione.

## Parte 2 · Tempo risparmiato e valore

1. Domande da fare, una alla volta:
   - Quanto tempo ci vuole oggi per farlo una volta? (minuti)
   - Quante volte succede? (al giorno, alla settimana o al mese)
   - Quante persone lo fanno?
   - Con l'automazione, quanto tempo resta per controllare e approvare? (minuti)
   - Quanto tempo stimi per costruirla e metterla in funzione? (ore; se non lo sa, proponi tu una stima e dichiarala come stima)
   - Facoltativo: costo orario medio di chi lo fa (€). Se non vuole dirlo, calcola solo le ore.
2. Calcola e mostra i passaggi:
   ```
   minuti risparmiati per volta = minuti oggi − minuti dopo
   ore risparmiate al mese     = minuti risparmiati × volte al mese × persone ÷ 60
   ore risparmiate all'anno    = ore al mese × 11   (mesi lavorativi)
   valore annuo (€)            = ore all'anno × costo orario
   rientro (mesi)              = ore per costruirla ÷ ore risparmiate al mese
   ```
   Per convertire: 1 volta al giorno ≈ 21 volte al mese, 1 volta alla settimana ≈ 4,3 volte al mese.
3. Esempio da mostrare se serve:
   > Oggi 20 minuti, dopo 5 minuti → 15 minuti risparmiati. 3 volte a settimana ≈ 13 al mese, 2 persone.
   > 15 × 13 × 2 ÷ 60 = **6,5 ore al mese** → circa **71 ore all'anno**. A 30 €/h ≈ **2.130 € all'anno**.
   > Costruirla richiede 8 ore → rientra in poco più di **1 mese**.
4. Aggiungi i benefici non misurabili in ore: meno errori, risposte più veloci, meno dipendenza da una sola persona.
5. Dai un giudizio onesto. Se il risparmio è piccolo e il rischio è alto, dillo e proponi di semplificare l'idea o di rimandarla.

## Modello per `progetto.md`

Copia questa sezione in `progetto.md`, tra "Scheda IDEA" e "Domande e risposte":

```markdown
## Rischi e valore
### Dati sensibili
| Fonte | Tipo di dati | Misura |
|-------|--------------|--------|
### Rischi
| Rischio | Probabilità | Impatto | Misura |
|---------|-------------|---------|--------|
### Tempo risparmiato
- Minuti risparmiati per volta: ...
- Ore al mese: ... · Ore all'anno: ...
- Valore annuo: ... €
- Rientro: ... mesi
- Benefici non misurabili: ...
### Giudizio
...
```
