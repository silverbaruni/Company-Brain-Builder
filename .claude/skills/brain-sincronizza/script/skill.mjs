// Skill: cartelle con un SKILL.md. Il formato è lo stesso per tutte le harness, cambia solo la posizione.
//   .claude/skills/  letta da Claude Code (e da OpenCode)
//   .agents/skills/  letta da Codex (e da OpenCode)
// Le cartelle vengono copiate così come sono, file compresi.

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const CARTELLE = {
  claude: '.claude/skills',
  codex: '.agents/skills',
};

function improntaCartella(dir) {
  const hash = crypto.createHash('sha256');
  const visita = (rel) => {
    const voci = fs.readdirSync(path.join(dir, rel), { withFileTypes: true });
    voci.sort((a, b) => (a.name < b.name ? -1 : 1));
    for (const voce of voci) {
      const relativo = rel ? `${rel}/${voce.name}` : voce.name;
      if (voce.isDirectory()) visita(relativo);
      else if (voce.isFile()) {
        // Gli a capo Windows (\r\n) e Unix (\n) contano come uguali.
        const contenuto = fs.readFileSync(path.join(dir, relativo)).toString('latin1').replace(/\r\n/g, '\n');
        hash.update(`${relativo}\0${contenuto}\0`, 'latin1');
      }
    }
  };
  visita('');
  return hash.digest('hex').slice(0, 16);
}

export function adattatoreSkill(radice) {
  const cartella = (lato) => path.join(radice, CARTELLE[lato]);
  return {
    tipo: 'skill',
    lati: Object.keys(CARTELLE),
    percorso: (lato, nome) => `${CARTELLE[lato]}/${nome}/`,

    carica() {
      const elementi = {};
      for (const lato of this.lati) {
        elementi[lato] = new Map();
        const dir = cartella(lato);
        if (!fs.existsSync(dir)) continue;
        for (const voce of fs.readdirSync(dir, { withFileTypes: true })) {
          const sorgente = path.join(dir, voce.name);
          if (!voce.isDirectory() || !fs.existsSync(path.join(sorgente, 'SKILL.md'))) continue;
          elementi[lato].set(voce.name, { valore: sorgente, impronta: improntaCartella(sorgente) });
        }
      }
      return elementi;
    },

    scrivi(lato, nome, sorgente) {
      const destinazione = path.join(cartella(lato), nome);
      fs.rmSync(destinazione, { recursive: true, force: true });
      fs.cpSync(sorgente, destinazione, { recursive: true });
    },

    elimina(lato, nome) {
      fs.rmSync(path.join(cartella(lato), nome), { recursive: true, force: true });
    },

    salva() {},
  };
}

// Skill messe in .opencode/skills/: OpenCode le legge, ma Claude Code e Codex no.
export function skillSoloOpencode(radice) {
  const dir = path.join(radice, '.opencode', 'skills');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((v) => v.isDirectory() && fs.existsSync(path.join(dir, v.name, 'SKILL.md')))
    .map((v) => v.name);
}
