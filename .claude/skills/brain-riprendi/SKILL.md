---
name: brain-riprendi
description: >-
  Riprende il lavoro dall'ultima sessione salvata. Usala a inizio giornata o quando l'utente chiede "dove eravamo rimasti?", "riprendiamo", "cosa c'è da fare?".
---

# brain-riprendi

**Prima di tutto leggi `AGENTS.md`.**

## Cosa fare

1. Trova il file più recente in `memoria/` con nome `AAAA-MM-GG.md` e leggilo.
   - Se non ce ne sono, controlla se esiste `knowledge_base/contesto_installazione/piano_implementazione.md`: se no proponi `/brain-intervista`, se sì riparti dal primo passo non spuntato.
2. Leggi lo stato del piano (`piano_implementazione.md`) e dei progetti aperti in `progetti/` con stato diverso da `fatto`.
3. Presenta all'utente, in modo breve:
   - quando è stata l'ultima sessione e cosa era stato fatto (2 righe);
   - le cose che doveva fare lui nel frattempo: chiedi se le ha fatte;
   - il prossimo passo consigliato;
   - in alternativa, altre 1 o 2 cose aperte.
4. Chiedi da cosa vuole partire e poi passa alla skill giusta (di solito `/brain-installa` o `/brain-evolvi`).

Se l'ultima sessione è di più di 30 giorni fa, proponi anche un `/brain-stato` per controllare che i connettori funzionino ancora.
