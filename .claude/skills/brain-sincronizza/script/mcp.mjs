// Server MCP. Ogni harness li scrive in un file diverso:
//   Claude Code  .mcp.json            "mcpServers": { nome: {...} }
//   Codex        .codex/config.toml   [mcp_servers.nome]
//   OpenCode     opencode.json        "mcp": { nome: {...} }
//
// Ogni server viene tradotto in un formato comune ("neutro"):
//   { tipo: 'stdio' | 'http', command, args, env, cwd, url, headers, enabled }
// Le variabili d'ambiente nel formato neutro si scrivono ${NOME}, come in Claude Code.
// I campi che esistono solo in una harness (timeout, oauth, permessi sui tool...) restano dove sono.

import path from 'node:path';
import {
  dividiToml,
  esiste,
  impronta,
  leggiJsonc,
  leggiTesto,
  leggiToml,
  scriviTesto,
  scriviToml,
  senza,
  senzaVuoti,
} from './formati.mjs';

const VARIABILE = /^\$\{([A-Za-z_][A-Za-z0-9_]*)\}$/;
const BEARER = /^Bearer \$\{([A-Za-z_][A-Za-z0-9_]*)\}$/;

function neutro(n) {
  const out = senzaVuoti(n);
  if (out.enabled !== false) delete out.enabled;
  return out;
}

// Applica una funzione a tutti i valori testuali di un oggetto.
const mappaTesti = (obj, f) =>
  obj && Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, typeof v === 'string' ? f(v) : v]));

// ---------- Claude Code ----------

const CAMPI_CLAUDE = ['type', 'command', 'args', 'env', 'url', 'headers'];

function daClaude(e) {
  const http = e.type === 'http' || e.type === 'sse' || (!e.command && e.url);
  return neutro(
    http
      ? { tipo: 'http', url: e.url, headers: e.headers }
      : { tipo: 'stdio', command: e.command, args: e.args, env: e.env },
  );
}

function versoClaude(n, esistente, avviso) {
  if (n.cwd) avviso('Claude Code non ha una cartella di lavoro per i server MCP: il campo cwd non è stato copiato.');
  if (n.enabled === false) avviso('in Claude Code non si può disattivare un server da .mcp.json: è stato copiato attivo.');
  const tipo = n.tipo === 'http' ? (esistente?.type === 'sse' ? 'sse' : 'http') : 'stdio';
  return senzaVuoti({
    type: tipo,
    command: n.command,
    args: n.args,
    env: n.env,
    url: n.url,
    headers: n.headers,
    ...senza(esistente, CAMPI_CLAUDE),
  });
}

// ---------- OpenCode ----------

const CAMPI_OPENCODE = ['type', 'command', 'environment', 'cwd', 'url', 'headers', 'enabled'];

const daVariabiliOpencode = (s) => s.replace(/\{env:([A-Za-z_][A-Za-z0-9_]*)\}/g, (_, nome) => `\${${nome}}`);

function versoVariabiliOpencode(s, avviso) {
  return s.replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)(:-[^}]*)?\}/g, (_, nome, predefinito) => {
    if (predefinito) avviso(`OpenCode non supporta valori predefiniti per le variabili: \${${nome}${predefinito}} è diventato {env:${nome}}.`);
    return `{env:${nome}}`;
  });
}

function daOpencode(e) {
  if (e.type === 'remote') {
    return neutro({ tipo: 'http', url: e.url, headers: mappaTesti(e.headers, daVariabiliOpencode), enabled: e.enabled });
  }
  const [command, ...args] = e.command ?? [];
  return neutro({
    tipo: 'stdio',
    command,
    args,
    env: mappaTesti(e.environment, daVariabiliOpencode),
    cwd: e.cwd,
    enabled: e.enabled,
  });
}

function versoOpencode(n, esistente, avviso) {
  const converti = (obj) => mappaTesti(obj, (s) => versoVariabiliOpencode(s, avviso));
  const base =
    n.tipo === 'http'
      ? { type: 'remote', url: n.url, headers: converti(n.headers) }
      : { type: 'local', command: [n.command, ...(n.args ?? [])], environment: converti(n.env), cwd: n.cwd };
  return senzaVuoti({
    ...base,
    ...senza(esistente, CAMPI_OPENCODE),
    enabled: n.enabled === false ? false : undefined,
  });
}

// ---------- Codex ----------

const CAMPI_CODEX = [
  'command',
  'args',
  'env',
  'env_vars',
  'cwd',
  'url',
  'http_headers',
  'env_http_headers',
  'bearer_token_env_var',
  'enabled',
];

function daCodex(e) {
  if (e.url) {
    const headers = { ...(e.http_headers ?? {}) };
    for (const [h, variabile] of Object.entries(e.env_http_headers ?? {})) headers[h] = `\${${variabile}}`;
    if (e.bearer_token_env_var) headers.Authorization = `Bearer \${${e.bearer_token_env_var}}`;
    return neutro({ tipo: 'http', url: e.url, headers, enabled: e.enabled });
  }
  const env = { ...(e.env ?? {}) };
  for (const v of e.env_vars ?? []) {
    const nome = typeof v === 'string' ? v : v?.name;
    if (nome) env[nome] = `\${${nome}}`;
  }
  return neutro({ tipo: 'stdio', command: e.command, args: e.args, env, cwd: e.cwd, enabled: e.enabled });
}

function versoCodex(n, esistente, avviso) {
  const extra = senza(esistente, CAMPI_CODEX);
  const disattivato = n.enabled === false ? false : undefined;
  if (n.tipo === 'http') {
    const http_headers = {};
    const env_http_headers = {};
    let bearer;
    for (const [h, v] of Object.entries(n.headers ?? {})) {
      if (h.toLowerCase() === 'authorization' && BEARER.test(v)) bearer = BEARER.exec(v)[1];
      else if (VARIABILE.test(v)) env_http_headers[h] = VARIABILE.exec(v)[1];
      else if (v.includes('${')) avviso(`l'intestazione ${h} mescola testo e variabili e Codex non lo supporta: impostala a mano in .codex/config.toml.`);
      else http_headers[h] = v;
    }
    return senzaVuoti({ url: n.url, bearer_token_env_var: bearer, http_headers, env_http_headers, ...extra, enabled: disattivato });
  }
  const env = {};
  const env_vars = [];
  for (const [k, v] of Object.entries(n.env ?? {})) {
    const m = VARIABILE.exec(v);
    if (m && m[1] === k) env_vars.push(k);
    else if (String(v).includes('${')) avviso(`la variabile ${k} = ${v} non si può tradurre per Codex: impostala a mano in .codex/config.toml.`);
    else env[k] = v;
  }
  return senzaVuoti({ command: n.command, args: n.args, env, env_vars, cwd: n.cwd, ...extra, enabled: disattivato });
}

// ---------- Adattatore ----------

function trovaFileOpencode(radice) {
  for (const nome of ['opencode.json', 'opencode.jsonc']) {
    if (esiste(path.join(radice, nome))) return path.join(radice, nome);
  }
  return path.join(radice, 'opencode.json');
}

export function adattatoreMcp(radice, avvisi) {
  const file = {
    claude: path.join(radice, '.mcp.json'),
    codex: path.join(radice, '.codex', 'config.toml'),
    opencode: trovaFileOpencode(radice),
  };
  const lettori = { claude: daClaude, codex: daCodex, opencode: daOpencode };
  const scrittori = { claude: versoClaude, codex: versoCodex, opencode: versoOpencode };
  let grezzi; // per lato: { contenuto del file, server: { nome: configurazione } }
  let modificati;

  const leggiFile = (lato) => {
    const f = file[lato];
    if (!esiste(f)) return { esisteva: false, contenuto: lato === 'codex' ? '' : {}, server: {} };
    const testo = leggiTesto(f);
    try {
      if (lato === 'claude') {
        const contenuto = JSON.parse(testo);
        return { esisteva: true, contenuto, server: contenuto.mcpServers ?? {} };
      }
      if (lato === 'opencode') {
        const contenuto = leggiJsonc(testo);
        return { esisteva: true, contenuto, server: contenuto.mcp ?? {} };
      }
      return { esisteva: true, contenuto: testo, server: leggiToml(testo).mcp_servers ?? {} };
    } catch (e) {
      throw new Error(`Non riesco a leggere ${path.relative(radice, f).replace(/\\/g, '/')}: ${e.message}`);
    }
  };

  return {
    tipo: 'mcp',
    lati: ['claude', 'codex', 'opencode'],
    percorso: (lato) => path.relative(radice, file[lato]).replace(/\\/g, '/'),

    carica() {
      modificati = new Set();
      grezzi = {};
      const elementi = {};
      for (const lato of this.lati) {
        grezzi[lato] = leggiFile(lato);
        elementi[lato] = new Map();
        for (const [nome, configurazione] of Object.entries(grezzi[lato].server)) {
          const valore = lettori[lato](configurazione);
          elementi[lato].set(nome, { valore, impronta: impronta(valore) });
        }
      }
      return elementi;
    },

    scrivi(lato, nome, valore) {
      const avviso = (testo) => avvisi.push(`MCP ${nome} (${this.percorso(lato)}): ${testo}`);
      grezzi[lato].server[nome] = scrittori[lato](valore, grezzi[lato].server[nome], avviso);
      modificati.add(lato);
    },

    elimina(lato, nome) {
      delete grezzi[lato].server[nome];
      modificati.add(lato);
    },

    salva() {
      for (const lato of modificati) {
        const { esisteva, contenuto, server } = grezzi[lato];
        if (!esisteva && Object.keys(server).length === 0) continue;
        if (lato === 'claude') {
          scriviTesto(file.claude, JSON.stringify({ ...contenuto, mcpServers: server }, null, 2));
        } else if (lato === 'opencode') {
          if (file.opencode.endsWith('.jsonc')) avvisi.push(`${this.percorso('opencode')} è stato riscritto: gli eventuali commenti sono stati tolti.`);
          const base = esisteva ? contenuto : { $schema: 'https://opencode.ai/config.json' };
          scriviTesto(file.opencode, JSON.stringify({ ...base, mcp: server }, null, 2));
        } else {
          scriviTesto(file.codex, testoCodex(contenuto, server));
        }
      }
    },
  };
}

// Riscrive solo le tabelle [mcp_servers...] di config.toml, il resto del file resta com'è.
function testoCodex(testoOriginale, server) {
  const altri = dividiToml(testoOriginale || '# Configurazione di Codex per questo progetto.\n')
    .filter((b) => !/^mcp_servers(\s*\.|$)/.test(b.intestazione ?? ''))
    .flatMap((b) => b.righe)
    .join('\n')
    .trimEnd();
  const tabelle = Object.entries(server).map(([nome, conf]) => scriviToml(['mcp_servers', nome], conf));
  return [altri, ...tabelle].filter(Boolean).join('\n\n');
}
