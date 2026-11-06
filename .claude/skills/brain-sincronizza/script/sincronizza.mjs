#!/usr/bin/env node
// brain-sincronizza: allinea skill, server MCP e agenti tra Claude Code, Codex e OpenCode.
// Le istruzioni non vanno copiate: stanno in AGENTS.md e CLAUDE.md contiene solo "@AGENTS.md".
//
// Uso (dalla cartella del brain):
//   node .claude/skills/brain-sincronizza/script/sincronizza.mjs              mostra cosa farebbe
//   node .claude/skills/brain-sincronizza/script/sincronizza.mjs --applica    esegue
//   ... --applica --attiva codex                  crea i file di Codex (anche: opencode, codex,opencode)
//   ... --applica --risolvi mcp:notion=opencode   in un conflitto tiene la versione di OpenCode
//   ... --applica --risolvi skill:prova=elimina   conferma un'eliminazione
//
// Harness attive: Claude Code è sempre attivo. Codex e OpenCode partecipano solo se i loro file
// esistono già (vedi FILE_HARNESS) o se vengono attivati con --attiva. Così i loro file vengono
// creati solo quando l'utente chiede di usarli.
//
// Come capisce da dove arrivano le modifiche: in .brain-sync.json salva l'impronta di ogni
// elemento in ogni harness all'ultima sincronizzazione. Se un elemento è cambiato in una sola
// harness, la modifica viene copiata nelle altre. Se è cambiato in più harness in modo diverso,
// è un conflitto e decide l'utente. Le eliminazioni vanno sempre confermate.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { adattatoreAgenti } from './agenti.mjs';
import { esiste, leggiTesto, scriviTesto } from './formati.mjs';
import { adattatoreMcp } from './mcp.mjs';
import { adattatoreSkill, skillSoloOpencode } from './skill.mjs';

const NOMI_LATI = { claude: 'Claude Code', codex: 'Codex', opencode: 'OpenCode' };
const NOMI_TIPI = { skill: 'Skill', mcp: 'Server MCP', agente: 'Agente' };
const FILE_STATO = '.brain-sync.json';
const RIMANDO = '@AGENTS.md';
// Se esiste almeno uno di questi file o cartelle, l'harness è già in uso.
const FILE_HARNESS = {
  codex: ['.agents/skills', '.codex'],
  opencode: ['opencode.json', 'opencode.jsonc', '.opencode'],
};

// ---------- Argomenti ----------

const argomenti = process.argv.slice(2);
const applica = argomenti.includes('--applica');
const risoluzioni = new Map();
const daAttivare = new Set();
let radice = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
for (let k = 0; k < argomenti.length; k++) {
  if (argomenti[k] === '--risolvi') {
    const [chiave, scelta] = (argomenti[++k] ?? '').split('=');
    risoluzioni.set(chiave, scelta);
  } else if (argomenti[k] === '--radice') {
    radice = path.resolve(argomenti[++k]);
  } else if (argomenti[k] === '--attiva') {
    for (const lato of (argomenti[++k] ?? '').split(',').filter(Boolean)) {
      if (!FILE_HARNESS[lato]) {
        console.error(`ERRORE: --attiva ${lato}: scegli codex, opencode oppure codex,opencode.`);
        process.exit(1);
      }
      daAttivare.add(lato);
    }
  }
}

function latiAttivi() {
  const attivi = new Set(['claude', ...daAttivare]);
  for (const [lato, file] of Object.entries(FILE_HARNESS)) {
    if (file.some((f) => esiste(path.join(radice, f)))) attivi.add(lato);
  }
  return new Set(Object.keys(NOMI_LATI).filter((l) => attivi.has(l)));
}

// ---------- Decisione per ogni elemento ----------

// attuale e precedente: impronta per lato (null se l'elemento non c'è).
function decidi(lati, attuale, precedente) {
  const presenti = lati.filter((l) => attuale[l]);
  if (!precedente) {
    if (!presenti.length) return { azione: 'niente' };
    if (new Set(presenti.map((l) => attuale[l])).size > 1) return { azione: 'conflitto', lati: presenti };
    const mancanti = lati.filter((l) => !attuale[l]);
    return mancanti.length ? { azione: 'copia', sorgente: presenti[0], destinazioni: mancanti } : { azione: 'niente' };
  }
  const cambiati = lati.filter((l) => attuale[l] !== (precedente[l] ?? null));
  // Harness appena attivate: non c'erano all'ultima sincronizzazione e l'elemento va creato.
  const daRiempire = lati.filter((l) => !(l in precedente) && !attuale[l]);
  if (!cambiati.length) {
    if (!daRiempire.length || !presenti.length) return { azione: 'niente' };
    return { azione: 'copia', sorgente: presenti[0], destinazioni: daRiempire };
  }
  if (new Set(cambiati.map((l) => attuale[l])).size > 1) return { azione: 'conflitto', lati: cambiati };
  if (!attuale[cambiati[0]]) {
    if (!presenti.length) return { azione: 'niente' };
    return { azione: 'eliminazione', cancellatoIn: cambiati, presenti };
  }
  return { azione: 'copia', sorgente: cambiati[0], destinazioni: lati.filter((l) => !cambiati.includes(l)) };
}

function applicaRisoluzione(chiave, decisione, lati, attuale) {
  const scelta = risoluzioni.get(chiave);
  if (!scelta || !['conflitto', 'eliminazione'].includes(decisione.azione)) return decisione;
  const presenti = lati.filter((l) => attuale[l]);
  if (scelta === 'elimina') return { azione: 'elimina', presenti };
  if (lati.includes(scelta) && attuale[scelta]) {
    return { azione: 'copia', sorgente: scelta, destinazioni: lati.filter((l) => l !== scelta), risolto: true };
  }
  throw new Error(`--risolvi ${chiave}=${scelta}: scegli "elimina" oppure un lato dove l'elemento esiste (${presenti.join(', ')}).`);
}

// ---------- Istruzioni ----------

function controllaIstruzioni(avvisi, azioni) {
  if (!esiste(path.join(radice, 'AGENTS.md'))) {
    avvisi.push('Manca AGENTS.md: è il file con tutte le istruzioni. Senza, Codex e OpenCode non sanno come lavorare.');
  }
  const fileClaude = ['CLAUDE.md'].find((f) => esiste(path.join(radice, f)));
  if (!fileClaude) {
    azioni.push(`Istruzioni: creo CLAUDE.md con il solo rimando "${RIMANDO}".`);
    if (applica) scriviTesto(path.join(radice, 'CLAUDE.md'), RIMANDO);
  } else if (leggiTesto(path.join(radice, fileClaude)).trim() !== RIMANDO) {
    avvisi.push(
      `${fileClaude} contiene altro oltre a "${RIMANDO}". Sposta quel testo in AGENTS.md e lascia in ${fileClaude} solo il rimando, altrimenti Codex e OpenCode non lo vedono.`,
    );
  }
  for (const nome of skillSoloOpencode(radice)) {
    avvisi.push(`La skill ${nome} è in .opencode/skills/, che Claude Code e Codex non leggono. Spostala in .agents/skills/ e rilancia la sincronizzazione.`);
  }
}

// ---------- Programma ----------

function leggiStato() {
  const file = path.join(radice, FILE_STATO);
  if (!esiste(file)) return { versione: 1, elementi: {} };
  return JSON.parse(leggiTesto(file));
}

function principale() {
  const avvisi = [];
  const azioniIstruzioni = [];
  const attivi = latiAttivi();
  const adattatori = [adattatoreSkill(radice), adattatoreMcp(radice, avvisi), adattatoreAgenti(radice, avvisi)];
  for (const ad of adattatori) ad.lati = ad.lati.filter((l) => attivi.has(l));
  const statoPrecedente = leggiStato();

  // 1. Legge tutto e decide, senza scrivere niente.
  const piano = [];
  for (const ad of adattatori) {
    const elementi = ad.carica();
    const prefisso = `${ad.tipo}:`;
    const nomi = new Set([
      ...ad.lati.flatMap((l) => [...elementi[l].keys()]),
      ...Object.keys(statoPrecedente.elementi)
        .filter((k) => k.startsWith(prefisso))
        .map((k) => k.slice(prefisso.length)),
    ]);
    for (const nome of [...nomi].sort()) {
      const chiave = prefisso + nome;
      const attuale = Object.fromEntries(ad.lati.map((l) => [l, elementi[l].get(nome)?.impronta ?? null]));
      const decisione = applicaRisoluzione(chiave, decidi(ad.lati, attuale, statoPrecedente.elementi[chiave]), ad.lati, attuale);
      piano.push({ ad, nome, chiave, decisione, elementi });
    }
  }

  // 2. Esegue (solo con --applica).
  fase = 'scrittura';
  controllaIstruzioni(avvisi, azioniIstruzioni);
  const nuovoStato = { versione: 1, aggiornato: new Date().toISOString().slice(0, 10), elementi: {} };
  // Con solo Claude Code non c'è niente da allineare: non si crea nemmeno .brain-sync.json.
  if (applica && attivi.size > 1) {
    for (const { ad, nome, decisione, elementi } of piano) {
      if (decisione.azione === 'copia') {
        const valore = elementi[decisione.sorgente].get(nome).valore;
        for (const lato of decisione.destinazioni) ad.scrivi(lato, nome, valore);
      } else if (decisione.azione === 'elimina') {
        for (const lato of decisione.presenti) ad.elimina(lato, nome);
      }
    }
    // Rilegge tutto e salva le nuove impronte. I conflitti e le eliminazioni non confermate
    // tengono le impronte vecchie, così alla prossima esecuzione vengono riproposti.
    for (const ad of adattatori) {
      ad.salva();
      const elementi = ad.carica();
      for (const { ad: a, nome, chiave, decisione } of piano) {
        if (a !== ad) continue;
        if (['conflitto', 'eliminazione'].includes(decisione.azione)) {
          if (statoPrecedente.elementi[chiave]) nuovoStato.elementi[chiave] = statoPrecedente.elementi[chiave];
          continue;
        }
        const impronte = Object.fromEntries(ad.lati.map((l) => [l, elementi[l].get(nome)?.impronta ?? null]));
        if (Object.values(impronte).some(Boolean)) nuovoStato.elementi[chiave] = impronte;
      }
    }
    // Un'harness appena attivata deve lasciare almeno un file, anche se non c'era niente da copiare
    // (per esempio nessun server MCP): altrimenti alla prossima esecuzione non risulterebbe attiva.
    for (const lato of daAttivare) {
      if (FILE_HARNESS[lato].some((f) => esiste(path.join(radice, f)))) continue;
      if (lato === 'opencode') {
        scriviTesto(path.join(radice, 'opencode.json'), JSON.stringify({ $schema: 'https://opencode.ai/config.json', mcp: {} }, null, 2));
      } else {
        scriviTesto(path.join(radice, '.codex', 'config.toml'), '# Configurazione di Codex per questo progetto.\n');
      }
    }
    fs.writeFileSync(path.join(radice, FILE_STATO), `${JSON.stringify(nuovoStato, null, 2)}\n`, 'utf8');
  }

  stampaResoconto(piano, avvisi, azioniIstruzioni, attivi);
}

function stampaResoconto(piano, avvisi, azioniIstruzioni, attivi) {
  const lato = (ad, l, nome) => `${NOMI_LATI[l]} (${ad.percorso(l, nome)})`;
  const etichetta = ({ ad, nome }) => `${NOMI_TIPI[ad.tipo]} "${nome}"`;
  const righe = [];
  const sezione = (titolo, voci) => {
    if (voci.length) righe.push('', `${titolo} (${voci.length})`, ...voci.map((v) => `  - ${v}`));
  };

  righe.push(applica ? 'SINCRONIZZAZIONE ESEGUITA' : 'ANTEPRIMA: non è stato modificato nessun file');
  righe.push(`Harness attive: ${[...attivi].map((l) => NOMI_LATI[l]).join(', ')}`);
  if (attivi.size === 1) {
    righe.push('Si usa solo Claude Code: non c\'è niente da sincronizzare. Per passare a un\'altra harness: --attiva codex oppure --attiva opencode');
  }
  sezione('Istruzioni', azioniIstruzioni);
  sezione(
    applica ? 'Copiati' : 'Da copiare',
    piano
      .filter((p) => p.decisione.azione === 'copia')
      .map((p) => {
        const verso = p.decisione.destinazioni.map((l) => NOMI_LATI[l]).join(', ');
        const nota = p.decisione.risolto ? ' (conflitto risolto)' : '';
        return `${etichetta(p)}: da ${lato(p.ad, p.decisione.sorgente, p.nome)} verso ${verso}${nota}`;
      }),
  );
  sezione(
    applica ? 'Eliminati' : 'Da eliminare',
    piano.filter((p) => p.decisione.azione === 'elimina').map((p) => `${etichetta(p)} da ${p.decisione.presenti.map((l) => NOMI_LATI[l]).join(', ')}`),
  );
  sezione(
    'CONFLITTI da decidere',
    piano
      .filter((p) => p.decisione.azione === 'conflitto')
      .map((p) => `${etichetta(p)} [${p.chiave}]: versioni diverse in ${p.decisione.lati.map((l) => lato(p.ad, l, p.nome)).join(' e ')}`),
  );
  sezione(
    'ELIMINAZIONI da confermare',
    piano
      .filter((p) => p.decisione.azione === 'eliminazione')
      .map(
        (p) =>
          `${etichetta(p)} [${p.chiave}]: cancellato in ${p.decisione.cancellatoIn.map((l) => NOMI_LATI[l]).join(', ')}, ancora presente in ${p.decisione.presenti
            .map((l) => lato(p.ad, l, p.nome))
            .join(', ')}`,
      ),
  );
  sezione('Avvisi', [...new Set(avvisi)]);

  const allineati = piano.filter((p) => p.decisione.azione === 'niente').length;
  righe.push('', `Già allineati: ${allineati} elementi.`);
  const daDecidere = piano.some((p) => ['conflitto', 'eliminazione'].includes(p.decisione.azione));
  if (daDecidere) righe.push('Per decidere: --risolvi <chiave>=<claude|codex|opencode|elimina>');
  if (!applica && piano.some((p) => p.decisione.azione !== 'niente')) righe.push('Per eseguire: aggiungi --applica');
  console.log(righe.join('\n'));
}

let fase = 'lettura';
try {
  principale();
} catch (e) {
  console.error(`ERRORE: ${e.message}`);
  if (fase === 'lettura' || !applica) console.error('Non è stato modificato nessun file.');
  else console.error('La sincronizzazione si è interrotta a metà: rilancia l\'anteprima per vedere cosa resta da fare.');
  process.exit(1);
}
