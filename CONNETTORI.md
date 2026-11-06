# Connettori

Registro di tutte le connessioni del company brain.

- Le prime righe le crea `/brain-intervista` (con stato `non ancora collegato`).
- `/brain-installa` aggiorna tipo, autenticazione, stato e file man mano che collega gli strumenti.
- Va aggiornato ogni volta che una connessione viene aggiunta, modificata o rimossa.

## Riepilogo

| Strumento | Area | Tipo connessione | Autenticazione | Stato | File |
|---|---|---|---|---|---|
| _esempio: Gmail_ | _comunicazione clienti_ | _mcp_ | _OAuth_ | _attivo_ | _n/a_ |

<!-- Cancella la riga di esempio quando aggiungi la prima connessione reale. -->

## Legenda

### Tipo connessione

| Tipo | Significato | Dove sta |
|---|---|---|
| `mcp` | Server MCP collegato a Claude | Configurazione MCP, nessun file qui |
| `script` | Script Python o Bash che interroga un'API | `connettori/script/{tool}.py` o `.sh` |
| `export` | Pipeline che scarica dati in CSV o JSON | `connettori/export/{tool}/` |
| `key+ref` | Chiave in `.env` più una guida su come usare l'API | `.env` + `connettori/riferimenti/{tool}-api.md` |
| `non ancora collegato` | Strumento usato dall'azienda ma non ancora connesso | Nessuno |

### Autenticazione

`OAuth`, `API key`, `token`, `utente e password`, `nessuna`. Le chiavi stanno **solo** in `.env` e le inserisce l'utente.

### Stato

`attivo`, `da verificare` (non risponde o da testare), `non ancora collegato`, `disattivato`.

### Aree

Usa una di queste aree (aggiungine altre se servono):
comunicazione clienti, comunicazione team, calendario, finanza e contabilità, documenti, CRM e vendite, progetti, marketing, risorse umane, assistenza clienti.

## Note per connettore

Per ogni connessione attiva aggiungi qui una breve sezione:

```
### {Strumento}
- Cosa legge / cosa può fare:
- Limiti noti:
- Variabili in .env: NOME_VARIABILE
- Collegato il: AAAA-MM-GG
```
