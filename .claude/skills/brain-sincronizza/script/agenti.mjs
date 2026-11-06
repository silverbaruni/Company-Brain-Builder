// Agenti (subagent). Ogni harness ha un formato diverso:
//   Claude Code  .claude/agents/nome.md    frontmatter (name, description, tools, model) + istruzioni
//   OpenCode     .opencode/agents/nome.md  frontmatter (description, mode, model, permission) + istruzioni
//   Codex        .codex/agents/nome.toml   name, description, model, developer_instructions
//
// Vengono sincronizzati solo descrizione e istruzioni. Modello e permessi hanno nomi diversi
// in ogni harness: restano dove sono e, per gli agenti nuovi, vanno impostati a mano.

import fs from 'node:fs';
import path from 'node:path';
import {
  esiste,
  impostaCampo,
  impronta,
  leggiFrontmatter,
  leggiTesto,
  leggiToml,
  scriviFrontmatter,
  scriviTesto,
  scriviToml,
  valoreCampo,
} from './formati.mjs';

const CARTELLE = {
  claude: ['.claude/agents'],
  codex: ['.codex/agents'],
  opencode: ['.opencode/agents', '.opencode/agent'], // la seconda è il nome vecchio, ancora supportato
};
const ESTENSIONE = { claude: '.md', codex: '.toml', opencode: '.md' };
// Il nome diventa un nome di file: niente "/", "\" o "..", così non si esce dalla cartella degli agenti.
const NOME_VALIDO = /^[A-Za-z0-9_-]+$/;

function leggiAgente(lato, file) {
  const testo = leggiTesto(file);
  const base = path.basename(file, ESTENSIONE[lato]);
  if (lato === 'codex') {
    const dati = leggiToml(testo);
    return {
      nome: dati.name ?? base,
      valore: { descrizione: dati.description ?? '', istruzioni: (dati.developer_instructions ?? '').trim() },
    };
  }
  const fm = leggiFrontmatter(testo);
  return {
    nome: (lato === 'claude' && valoreCampo(fm, 'name')) || base,
    valore: { descrizione: valoreCampo(fm, 'description') ?? '', istruzioni: fm.corpo.trim() },
  };
}

export function adattatoreAgenti(radice, avvisi) {
  let file; // per lato: nome -> percorso del file

  return {
    tipo: 'agente',
    lati: Object.keys(CARTELLE),
    percorso(lato, nome) {
      const f = file?.[lato]?.get(nome) ?? path.join(radice, CARTELLE[lato][0], nome + ESTENSIONE[lato]);
      return path.relative(radice, f).replace(/\\/g, '/');
    },

    carica() {
      file = {};
      const elementi = {};
      for (const lato of this.lati) {
        file[lato] = new Map();
        elementi[lato] = new Map();
        for (const cartella of CARTELLE[lato]) {
          const dir = path.join(radice, cartella);
          if (!esiste(dir)) continue;
          for (const nomeFile of fs.readdirSync(dir)) {
            if (!nomeFile.endsWith(ESTENSIONE[lato])) continue;
            const percorso = path.join(dir, nomeFile);
            try {
              const { nome, valore } = leggiAgente(lato, percorso);
              if (!NOME_VALIDO.test(nome)) {
                throw new Error(`il nome "${nome}" non è valido. Usa solo lettere, numeri, "-" e "_"`);
              }
              if (elementi[lato].has(nome)) continue;
              file[lato].set(nome, percorso);
              elementi[lato].set(nome, { valore, impronta: impronta(valore) });
            } catch (e) {
              throw new Error(`Non riesco a leggere ${path.relative(radice, percorso).replace(/\\/g, '/')}: ${e.message}`);
            }
          }
        }
      }
      return elementi;
    },

    scrivi(lato, nome, valore) {
      const esistente = file[lato].get(nome);
      const destinazione = esistente ?? path.join(radice, CARTELLE[lato][0], nome + ESTENSIONE[lato]);
      if (!esistente) {
        avvisi.push(`Agente ${nome} creato in ${this.percorso(lato, nome)}: modello e permessi non vengono copiati, controllali se servono.`);
      }

      if (lato === 'codex') {
        const dati = esistente ? leggiToml(leggiTesto(esistente)) : {};
        const { name, description, developer_instructions, ...altri } = dati;
        const nuovo = { name: name ?? nome, description: valore.descrizione, ...altri, developer_instructions: `${valore.istruzioni}\n` };
        scriviTesto(destinazione, scriviToml([], nuovo));
      } else {
        const fm = esistente ? leggiFrontmatter(leggiTesto(esistente)) : { campi: [] };
        if (lato === 'claude' && !esistente) impostaCampo(fm, 'name', nome);
        impostaCampo(fm, 'description', valore.descrizione);
        if (lato === 'opencode' && !esistente) impostaCampo(fm, 'mode', 'subagent');
        scriviTesto(destinazione, scriviFrontmatter(fm, valore.istruzioni));
      }
      file[lato].set(nome, destinazione);
    },

    elimina(lato, nome) {
      const f = file[lato].get(nome);
      if (f) fs.rmSync(f, { force: true });
    },

    salva() {},
  };
}
