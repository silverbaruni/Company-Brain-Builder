// Lettura e scrittura dei formati usati dalle tre harness:
// TOML (Codex), JSON con commenti (OpenCode), frontmatter YAML (skill e agenti).
// Supporta solo il sottoinsieme che serve alla sincronizzazione, senza librerie esterne.

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

// ---------- File ----------

export const esiste = (file) => fs.existsSync(file);

export function leggiTesto(file) {
  return fs.readFileSync(file, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
}

export function scriviTesto(file, testo) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, testo.endsWith('\n') ? testo : `${testo}\n`, 'utf8');
}

// ---------- Impronte ----------

// JSON con le chiavi in ordine alfabetico: due oggetti uguali danno sempre lo stesso testo.
function jsonOrdinato(valore) {
  if (Array.isArray(valore)) return `[${valore.map(jsonOrdinato).join(',')}]`;
  if (valore && typeof valore === 'object') {
    const chiavi = Object.keys(valore).sort();
    return `{${chiavi.map((k) => `${JSON.stringify(k)}:${jsonOrdinato(valore[k])}`).join(',')}}`;
  }
  return JSON.stringify(valore);
}

export function impronta(valore) {
  const testo = typeof valore === 'string' ? valore : jsonOrdinato(valore);
  return crypto.createHash('sha256').update(testo).digest('hex').slice(0, 16);
}

// ---------- Oggetti ----------

export const eOggetto = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

// Toglie le chiavi vuote (undefined, null, array od oggetti vuoti).
export function senzaVuoti(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    if (eOggetto(v) && Object.keys(v).length === 0) continue;
    out[k] = v;
  }
  return out;
}

// Copia di obj senza le chiavi indicate.
export function senza(obj, chiavi) {
  return Object.fromEntries(Object.entries(obj ?? {}).filter(([k]) => !chiavi.includes(k)));
}

// ---------- JSON con commenti (OpenCode) ----------

export function leggiJsonc(testo) {
  let out = '';
  let inStringa = false;
  for (let i = 0; i < testo.length; i++) {
    const c = testo[i];
    if (inStringa) {
      out += c;
      if (c === '\\') out += testo[++i] ?? '';
      else if (c === '"') inStringa = false;
    } else if (c === '"') {
      inStringa = true;
      out += c;
    } else if (c === '/' && testo[i + 1] === '/') {
      while (i < testo.length && testo[i] !== '\n') i++;
      out += '\n';
    } else if (c === '/' && testo[i + 1] === '*') {
      const fine = testo.indexOf('*/', i + 2);
      i = fine < 0 ? testo.length : fine + 1;
    } else {
      out += c;
    }
  }
  return JSON.parse(out.replace(/,(\s*[}\]])/g, '$1'));
}

// ---------- TOML (Codex) ----------

export function leggiToml(src) {
  src = src.replace(/\r\n/g, '\n');
  const radice = {};
  let corrente = radice;
  let i = 0;
  const n = src.length;

  const errore = (msg) => {
    const riga = src.slice(0, i).split('\n').length;
    throw new Error(`TOML non valido alla riga ${riga}: ${msg}`);
  };
  const spazi = () => {
    while (i < n && (src[i] === ' ' || src[i] === '\t')) i++;
  };
  const saltaVuoto = () => {
    for (;;) {
      spazi();
      if (src[i] === '#') while (i < n && src[i] !== '\n') i++;
      else if (src[i] === '\n') i++;
      else return;
    }
  };
  const fineRiga = () => {
    spazi();
    if (src[i] === '#') while (i < n && src[i] !== '\n') i++;
    if (i < n && src[i] !== '\n') errore('attesa la fine della riga');
  };

  const sequenzaEscape = () => {
    const c = src[i++];
    const semplici = { n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', '"': '"', '\\': '\\' };
    if (c in semplici) return semplici[c];
    if (c === 'u' || c === 'U') {
      const lunghezza = c === 'u' ? 4 : 8;
      const codice = parseInt(src.slice(i, i + lunghezza), 16);
      i += lunghezza;
      return String.fromCodePoint(codice);
    }
    return errore(`sequenza \\${c} non valida`);
  };

  // Conta le virgolette in più subito prima della chiusura (es. """" = una virgoletta nel testo).
  const virgoletteExtra = (pos, carattere) => {
    let extra = 0;
    while (src[pos + 3 + extra] === carattere && extra < 2) extra++;
    return extra;
  };

  const stringaBase = () => {
    if (src.startsWith('"""', i)) {
      i += 3;
      if (src[i] === '\n') i++;
      let out = '';
      while (i < n) {
        if (src.startsWith('"""', i)) {
          const extra = virgoletteExtra(i, '"');
          i += 3 + extra;
          return out + '"'.repeat(extra);
        }
        if (src[i] === '\\') {
          i++;
          if (/[ \t\n]/.test(src[i])) while (i < n && /[ \t\n]/.test(src[i])) i++;
          else out += sequenzaEscape();
        } else {
          out += src[i++];
        }
      }
      return errore('stringa su più righe non chiusa');
    }
    i++;
    let out = '';
    while (i < n && src[i] !== '"') {
      if (src[i] === '\n') errore('stringa non chiusa');
      if (src[i] === '\\') {
        i++;
        out += sequenzaEscape();
      } else {
        out += src[i++];
      }
    }
    i++;
    return out;
  };

  const stringaLetterale = () => {
    if (src.startsWith("'''", i)) {
      i += 3;
      if (src[i] === '\n') i++;
      const fine = src.indexOf("'''", i);
      if (fine < 0) errore('stringa su più righe non chiusa');
      const extra = virgoletteExtra(fine, "'");
      const out = src.slice(i, fine + extra);
      i = fine + 3 + extra;
      return out;
    }
    i++;
    const fine = src.indexOf("'", i);
    if (fine < 0) errore('stringa non chiusa');
    const out = src.slice(i, fine);
    i = fine + 1;
    return out;
  };

  const chiave = () => {
    spazi();
    if (src[i] === '"') return stringaBase();
    if (src[i] === "'") return stringaLetterale();
    const m = /^[A-Za-z0-9_-]+/.exec(src.slice(i, i + 256));
    if (!m) errore('attesa una chiave');
    i += m[0].length;
    return m[0];
  };

  const chiavePuntata = () => {
    const parti = [chiave()];
    spazi();
    while (src[i] === '.') {
      i++;
      parti.push(chiave());
      spazi();
    }
    return parti;
  };

  const imposta = (obj, parti, valore) => {
    let o = obj;
    for (const p of parti.slice(0, -1)) {
      if (o[p] === undefined) o[p] = {};
      o = o[p];
    }
    o[parti[parti.length - 1]] = valore;
  };

  const valore = () => {
    spazi();
    const c = src[i];
    if (c === '"') return stringaBase();
    if (c === "'") return stringaLetterale();
    if (c === '[') {
      i++;
      const lista = [];
      for (;;) {
        saltaVuoto();
        if (src[i] === ']') {
          i++;
          return lista;
        }
        lista.push(valore());
        saltaVuoto();
        if (src[i] === ',') i++;
        else if (src[i] !== ']') errore('attesa una virgola o ] in una lista');
      }
    }
    if (c === '{') {
      i++;
      const obj = {};
      spazi();
      if (src[i] === '}') {
        i++;
        return obj;
      }
      for (;;) {
        const k = chiavePuntata();
        if (src[i] !== '=') errore('atteso =');
        i++;
        imposta(obj, k, valore());
        spazi();
        if (src[i] === ',') {
          i++;
          continue;
        }
        if (src[i] === '}') {
          i++;
          return obj;
        }
        errore('attesa una virgola o } in una tabella');
      }
    }
    const m = /^[^\s,\]}#]+/.exec(src.slice(i, i + 256));
    if (!m) errore('atteso un valore');
    i += m[0].length;
    if (m[0] === 'true') return true;
    if (m[0] === 'false') return false;
    const numero = Number(m[0].replace(/_/g, ''));
    return Number.isNaN(numero) ? m[0] : numero;
  };

  const apriTabella = (parti, comeLista) => {
    let o = radice;
    parti.forEach((p, idx) => {
      if (idx === parti.length - 1 && comeLista) {
        if (!Array.isArray(o[p])) o[p] = [];
        const nuova = {};
        o[p].push(nuova);
        o = nuova;
        return;
      }
      if (o[p] === undefined) o[p] = {};
      o = Array.isArray(o[p]) ? o[p][o[p].length - 1] : o[p];
    });
    return o;
  };

  for (;;) {
    saltaVuoto();
    if (i >= n) return radice;
    if (src[i] === '[') {
      const comeLista = src[i + 1] === '[';
      i += comeLista ? 2 : 1;
      const parti = chiavePuntata();
      if (src[i] !== ']' || (comeLista && src[i + 1] !== ']')) errore('attesa ]');
      i += comeLista ? 2 : 1;
      corrente = apriTabella(parti, comeLista);
      fineRiga();
    } else {
      const k = chiavePuntata();
      if (src[i] !== '=') errore('atteso =');
      i++;
      imposta(corrente, k, valore());
      fineRiga();
    }
  }
}

// Divide un file TOML in blocchi, uno per intestazione [tabella].
// Serve a riscrivere solo alcune tabelle lasciando il resto del file com'è.
export function dividiToml(src) {
  const blocchi = [{ intestazione: null, righe: [] }];
  for (const riga of src.replace(/\r\n/g, '\n').split('\n')) {
    const m = /^\s*\[\[?\s*([^\]]+?)\s*\]\]?\s*(#.*)?$/.exec(riga);
    if (m) blocchi.push({ intestazione: m[1], righe: [riga] });
    else blocchi[blocchi.length - 1].righe.push(riga);
  }
  return blocchi;
}

const chiaveToml = (k) => (/^[A-Za-z0-9_-]+$/.test(k) ? k : JSON.stringify(k));

function valoreToml(v) {
  if (typeof v === 'string') return JSON.stringify(v);
  if (typeof v === 'boolean' || typeof v === 'number') return String(v);
  if (Array.isArray(v)) return `[${v.map(valoreToml).join(', ')}]`;
  if (eOggetto(v)) {
    const parti = Object.entries(v).map(([k, x]) => `${chiaveToml(k)} = ${valoreToml(x)}`);
    return parti.length ? `{ ${parti.join(', ')} }` : '{}';
  }
  throw new Error(`valore non scrivibile in TOML: ${v}`);
}

const rigaToml = (k, v) => {
  const testo =
    typeof v === 'string' && v.includes('\n')
      ? `"""\n${v.replace(/\\/g, '\\\\').replace(/"""/g, '""\\"')}"""`
      : valoreToml(v);
  return `${chiaveToml(k)} = ${testo}`;
};

// Scrive una tabella TOML e le sue sottotabelle. percorso è la lista delle chiavi ([] per la radice).
export function scriviToml(percorso, obj) {
  const semplici = [];
  const tabelle = [];
  const liste = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (eOggetto(v)) tabelle.push([k, v]);
    else if (Array.isArray(v) && v.length && v.every(eOggetto)) liste.push([k, v]);
    else semplici.push([k, v]);
  }
  const nome = (parti) => parti.map(chiaveToml).join('.');
  const righe = [];
  if (percorso.length && (semplici.length || (!tabelle.length && !liste.length))) righe.push(`[${nome(percorso)}]`);
  for (const [k, v] of semplici) righe.push(rigaToml(k, v));
  for (const [k, v] of tabelle) righe.push('', scriviToml([...percorso, k], v));
  for (const [k, lista] of liste) {
    for (const elemento of lista) {
      righe.push('', `[[${nome([...percorso, k])}]]`);
      for (const [kk, vv] of Object.entries(elemento)) righe.push(rigaToml(kk, vv));
    }
  }
  return righe.join('\n').replace(/^\n+/, '');
}

// ---------- Frontmatter YAML (skill e agenti) ----------

export function leggiFrontmatter(testo) {
  testo = testo.replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const m = /^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)/.exec(testo);
  if (!m) return { campi: [], corpo: testo };
  const campi = [];
  for (const riga of m[1].split('\n')) {
    const k = /^([A-Za-z0-9_-]+)\s*:/.exec(riga);
    if (k) campi.push({ chiave: k[1], righe: [riga] });
    else if (campi.length) campi[campi.length - 1].righe.push(riga);
  }
  return { campi, corpo: testo.slice(m[0].length) };
}

// Valore testuale di un campo. Gestisce testo semplice, tra virgolette e blocchi > e |.
export function valoreCampo(fm, chiave) {
  const campo = fm.campi.find((c) => c.chiave === chiave);
  if (!campo) return undefined;
  const primo = campo.righe[0].slice(campo.righe[0].indexOf(':') + 1).trim();
  const resto = campo.righe.slice(1);
  if (/^[>|]/.test(primo)) {
    const rientro = Math.min(...resto.filter((r) => r.trim()).map((r) => r.match(/^ */)[0].length));
    const testo = resto.map((r) => r.slice(rientro)).join('\n').trim();
    if (primo.startsWith('|')) return testo;
    return testo
      .split(/\n\s*\n/)
      .map((paragrafo) => paragrafo.split('\n').map((r) => r.trim()).join(' '))
      .join('\n');
  }
  if (primo.startsWith('"')) {
    try {
      return JSON.parse(primo);
    } catch {
      return primo.slice(1, -1);
    }
  }
  if (primo.startsWith("'")) return primo.slice(1, -1).replace(/''/g, "'");
  return [primo, ...resto.map((r) => r.trim())].filter(Boolean).join(' ');
}

export function impostaCampo(fm, chiave, valore) {
  // Testo semplice senza virgolette quando è sicuro, altrimenti tra virgolette doppie.
  const semplice =
    /^[\p{L}\p{N}][\p{L}\p{N} _.,()/'-]*$/u.test(valore) &&
    !valore.endsWith(' ') &&
    !/^(true|false|null|yes|no|on|off|[\d.]+)$/i.test(valore);
  const righe = [`${chiave}: ${semplice ? valore : JSON.stringify(valore)}`];
  const campo = fm.campi.find((c) => c.chiave === chiave);
  if (campo) campo.righe = righe;
  else fm.campi.push({ chiave, righe });
}

export function scriviFrontmatter(fm, corpo) {
  const intestazione = fm.campi.flatMap((c) => c.righe).join('\n');
  return `---\n${intestazione}\n---\n\n${corpo.trim()}\n`;
}
