# Sincronizzazione a mano (senza Node)

Usa queste regole solo se `node --version` non funziona. Proponi comunque all'utente di installare Node (https://nodejs.org, versione LTS): con Node la sincronizzazione è più sicura.

Senza lo script non c'è memoria delle sincronizzazioni precedenti. Quindi **chiedi sempre all'utente da quale harness arrivano le modifiche** e mostra l'elenco di cosa cambierai prima di farlo.

Lavora solo sulle harness che l'utente usa davvero. Claude Code è sempre la base. Crea i file di Codex (`.agents/skills/`, `.codex/`) o di OpenCode (`opencode.json`) solo se esistono già o se l'utente ha chiesto di passare a quell'harness.

## 1. Istruzioni

- Tutte le istruzioni stanno in `AGENTS.md`.
- `CLAUDE.md` deve contenere solo la riga `@AGENTS.md`. Se contiene altro, proponi di spostarlo in `AGENTS.md`.

## 2. Skill

- Le cartelle in `.claude/skills/` e `.agents/skills/` devono essere identiche.
- Confronta le due cartelle skill per skill. Copia l'intera cartella dalla harness di partenza all'altra, file compresi.
- Una skill in `.opencode/skills/` va spostata in `.agents/skills/` e poi copiata in `.claude/skills/`.
- Prima di cancellare una skill da una delle due cartelle, chiedi conferma.

## 3. Server MCP

Stesso server, tre formati. Esempio con un server remoto e uno locale:

`.mcp.json` (Claude Code)
```json
{
  "mcpServers": {
    "notion": { "type": "http", "url": "https://mcp.notion.com/mcp", "headers": { "Authorization": "Bearer ${NOTION_TOKEN}" } },
    "fatture": { "type": "stdio", "command": "npx", "args": ["-y", "fatture-mcp"], "env": { "FATT_TOKEN": "${FATT_TOKEN}", "REGIONE": "it" } }
  }
}
```

`.codex/config.toml` (Codex)
```toml
[mcp_servers.notion]
url = "https://mcp.notion.com/mcp"
bearer_token_env_var = "NOTION_TOKEN"

[mcp_servers.fatture]
command = "npx"
args = ["-y", "fatture-mcp"]
env_vars = ["FATT_TOKEN"]

[mcp_servers.fatture.env]
REGIONE = "it"
```

`opencode.json` (OpenCode)
```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "notion": { "type": "remote", "url": "https://mcp.notion.com/mcp", "headers": { "Authorization": "Bearer {env:NOTION_TOKEN}" } },
    "fatture": { "type": "local", "command": ["npx", "-y", "fatture-mcp"], "environment": { "FATT_TOKEN": "{env:FATT_TOKEN}", "REGIONE": "it" } }
  }
}
```

Regole di traduzione:
- variabili: `${NOME}` in Claude Code, `{env:NOME}` in OpenCode. In Codex una variabile con lo stesso nome va in `env_vars`, un'intestazione `Authorization: Bearer ${NOME}` diventa `bearer_token_env_var = "NOME"`, un'altra intestazione `${NOME}` va in `env_http_headers`;
- server disattivato: `enabled = false` in Codex, `"enabled": false` in OpenCode. Claude Code non ha un equivalente in `.mcp.json`;
- in `.codex/config.toml` e `opencode.json` modifica solo la parte dei server MCP e lascia il resto del file com'è;
- i campi che esistono in una sola harness (timeout, oauth, permessi sui tool) non si copiano.

## 4. Agenti

Copia solo descrizione e istruzioni. Modello e permessi non si copiano: avvisa l'utente di impostarli.

`.claude/agents/revisore.md`
```markdown
---
name: revisore
description: Revisore dei documenti
---

Controlla i documenti. Non modificare nulla.
```

`.codex/agents/revisore.toml`
```toml
name = "revisore"
description = "Revisore dei documenti"
developer_instructions = """
Controlla i documenti. Non modificare nulla.
"""
```

`.opencode/agents/revisore.md`
```markdown
---
description: Revisore dei documenti
mode: subagent
---

Controlla i documenti. Non modificare nulla.
```

## 5. Alla fine

Elenca all'utente cosa hai copiato, cosa hai cancellato e cosa deve sistemare a mano. Non creare né modificare `.brain-sync.json`: lo usa solo lo script. Alla prossima esecuzione con Node, lo script confronterà le harness da zero e segnalerà eventuali differenze.
