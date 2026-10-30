# Envío a Grok (xAI)

xAI tiene dos superficies, y solo una acepta envíos de terceros:

| Superficie | ¿Hay directorio público? | Qué hacer |
|---|---|---|
| **Grok Build** (agente de código en la terminal) | Sí: el [xAI plugin marketplace](https://github.com/xai-org/plugin-marketplace), con envío por pull request | Mandar la carpeta `grok/` de este repo como plugin |
| **grok.com / Grok Bot** | No hay un proceso de envío público documentado; los [conectores personalizados](https://docs.x.ai/grok/connectors) los agrega cada usuario | Documentar que el usuario agregue `https://api.platica.mx/mcp/apps` como conector personalizado |

## Grok Build: pull request al marketplace

El marketplace es un índice en GitHub. Un plugin de terceros entra de dos formas:

- **Remote:** una entrada que apunta a un repositorio y a un commit fijo. Los ejemplos del catálogo apuntan a repos cuyo plugin está en la raíz.
- **Local:** copiar los archivos del plugin dentro del marketplace, en `external_plugins/<name>/`.

Este repo guarda varios plugins en subcarpetas, así que la vía directa es **local**: copiar `grok/` a `external_plugins/platic/`. Es lo mismo que hicieron Cal.com y Neon, que también usan un servidor MCP hospedado.

### Contenido de `grok/`

```text
grok/
├── .grok-plugin/plugin.json   manifiesto (name, version, description, author, license, keywords, logo)
├── .mcp.json                  { "type": "http", "url": "https://api.platica.mx/mcp/apps" }
├── README.md                  qué hace, endpoint al que se conecta y credenciales (ninguna)
├── LICENSE
├── assets/platic.png
└── skills/use-platica/SKILL.md
```

No ejecuta código local, hooks ni scripts. Eso cubre la revisión de seguridad del marketplace: piden declarar en el README los endpoints y las credenciales, y no aceptar ejecución de código ni exfiltración.

### Pasos

1. **Fork** de `xai-org/plugin-marketplace` desde la cuenta de la organización `platicamx`, no desde una cuenta personal. El marketplace revisa que la fuente coincida con la marca.
2. Copia la carpeta:

   ```bash
   cp -r <platica-ai-plugins>/grok <fork>/external_plugins/platic
   ```

3. Agrega esta entrada al arreglo `plugins` de `.grok-plugin/marketplace.json`:

   ```json
   {
     "name": "platic",
     "description": "Platica integration (hosted MCP server + skill). Work with WhatsApp and social conversations, clients, templates, campaigns, AI agents, comments, webhooks and usage in your Platica workspace. Sign in with your Platica account; no API key needed.",
     "category": "productivity",
     "source": {
       "type": "local",
       "path": "./external_plugins/platic"
     },
     "homepage": "https://platica.mx",
     "keywords": ["platica", "platic", "platica whatsapp", "platica crm", "platica agents"],
     "domains": ["platica.mx", "app.platica.mx", "api.platica.mx"]
   }
   ```

   Usa `keywords` y `domains` solo de la marca: activan la sugerencia automática del plugin, y los términos genéricos los rechazan.
4. Regenera el índice y valida, que es lo mismo que corre su CI:

   ```bash
   python3 scripts/generate-plugin-index.py
   python3 scripts/validate-catalog.py
   python3 scripts/generate-plugin-index.py --check
   ```

5. Abre la PR con su plantilla y espera el CI y la revisión de un code owner.

Para publicar una versión nueva, actualiza los archivos de `external_plugins/platic/` en una PR nueva y regenera el índice. No abras una entrada duplicada.

### OAuth en Grok Build

Grok Build se conecta como cualquier cliente MCP: recibe el `401` de `/mcp/apps`, lee `/.well-known/oauth-protected-resource/mcp/apps` y se registra por DCR. El registro acepta redirects `https://` y loopback (`http://localhost`, `http://127.0.0.1`), así que no hay nada que configurar. Antes de enviar, pruébalo instalando el plugin localmente en Grok Build.

## grok.com y Grok Bot

No hay un formulario público para listar conectores. Cada usuario agrega su propio conector en **grok.com/connectors → New Connector → Custom**, pegando `https://api.platica.mx/mcp/apps` e iniciando sesión con OAuth. En los planes Business y Enterprise, un admin lo habilita primero en la consola. Conviene documentarlo en `docs.platica.mx` y revisar [x.ai/news](https://x.ai/news) por si abren un directorio.
