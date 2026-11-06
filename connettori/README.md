# Connettori

Qui stanno i file che collegano il brain agli strumenti esterni. Li crea `/brain-installa`. Il registro di tutte le connessioni è in `../CONNETTORI.md`.

## Sottocartelle

| Cartella | Contenuto | Nome dei file |
|---|---|---|
| `script/` | Script Python o Bash che interrogano un'API | `{tool}.py`, `{tool}.sh` |
| `riferimenti/` | Guide su come usare l'API di uno strumento (tipo `key+ref`) | `{tool}-api.md` |
| `export/` | Pipeline che scaricano dati in CSV o JSON | `export/{tool}/`, dati in `export/{tool}/dati/` |

`{tool}` è il nome dello strumento in minuscolo senza spazi (es. `google_drive`, `fatture_in_cloud`).

## Regole per gli script

- Leggono chiavi e token **solo** da `../.env` tramite variabili d'ambiente. Mai chiavi scritte nel codice.
- In cima al file un commento con: cosa fa, quali variabili `.env` usa, come si lancia, esempio di output.
- Di default fanno solo letture. Le azioni che scrivono o inviano qualcosa vanno chiamate in modo esplicito e chiedono conferma.
- Stampano errori chiari in italiano (es. "Manca HUBSPOT_API_KEY in .env").
- Se servono pacchetti Python, elencali nel commento iniziale e chiedi conferma all'utente prima di installarli.

## Regole per gli export

- I dati scaricati vanno in `export/{tool}/dati/`, che è esclusa da git perché può contenere dati sensibili.
- Accanto metti un `README.md` con: da dove arrivano i dati, ogni quanto si aggiornano, come rilanciare l'export.
