# platica-ai-plugins

Official source for **platic**, the Platica plugin for ChatGPT, Codex, Cursor, Claude, and Grok Build.

Connect your Platica account to work with conversations, clients, templates, campaigns, AI agents, social comments, webhooks and usage. Messages, changes and deletions happen only when you explicitly request them, using your existing workspace permissions. Each user signs in through OAuth.

Every package connects to `https://api.platica.mx/mcp/apps`, the endpoint for app directories. It leaves out the tools that ask for credentials or connect third-party services (custom HTTP API tools and external MCP servers); those are configured in the Platica dashboard. The full catalog at `https://api.platica.mx/mcp` stays available to anyone who adds it by hand as a custom connector.

## Cursor

See the [Cursor setup guide](cursor/README.md) for installation and examples.

To try the plugin locally, run these commands from the repository root with Node.js installed:

```sh
npm run validate:cursor
npm run install:cursor
```

Reload Cursor, enable the plugin, and connect your Platica account through OAuth.

## ChatGPT and Codex

The plugin package lives in `chatgpt/`. To build the upload ZIP, run:

```sh
npm run zip:chatgpt
```

The output is `dist/platic-chatgpt.zip`, containing the manifest, MCP configuration, `use-platica` skill, icon, and license.

## Claude

The plugin bundle lives in `claude/` (`.claude-plugin/plugin.json`, `.mcp.json`, skill, README, license). Claude also lists the server itself as an MCP connector.

## Grok Build

The plugin lives in `grok/` (`.grok-plugin/plugin.json`, `.mcp.json`, skill, README, license, logo). It is listed through the xAI plugin marketplace.

## Muse

Muse connects to the MCP server directly, with no package in this repository.

## Development

Each platform has its own package folder: `chatgpt/`, `cursor/` (catalog in `.cursor-plugin/marketplace.json`), `claude/` and `grok/`. Keep the shared skill, icon, license and version consistent across them.

Validate the packages and run the tests before opening a pull request:

```sh
npm run validate:cursor
npm run test:cursor
npm run validate:directories
```

These checks validate the package structure. To check account access and tools, connect the plugin in the target application and try it with a test account.

## Support and license

- [MCP documentation](https://docs.platica.mx/mcp/bienvenida)
- [Privacy policy](https://platica.mx/privacidad)
- [Terms](https://platica.mx/terminos-y-condiciones)
- [Issues](https://github.com/platicamx/platica-ai-plugins/issues)

The source is licensed under [MIT](LICENSE). Platica retains rights to its name and brand assets.
