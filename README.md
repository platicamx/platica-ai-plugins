# platica-ai-plugins

Official source for **platic**, the Platica plugin for ChatGPT, Codex, and Cursor.

Connect your Platica account to browse workspaces, WhatsApp conversations, clients, and templates. Send messages when you explicitly request them, using your existing workspace permissions. Each user signs in through OAuth.

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

## Development

Cursor's package lives in `cursor/`, and its catalog is `.cursor-plugin/marketplace.json`. Keep the shared skill and icon consistent across both packages.

Validate the Cursor package and run its tests before opening a pull request:

```sh
npm run validate:cursor
npm run test:cursor
```

These checks validate the package structure. To check account access and tools, connect the plugin in the target application and try it with a test account.

## Support and license

- [MCP documentation](https://docs.platica.mx/mcp/bienvenida)
- [Privacy policy](https://platica.mx/privacidad)
- [Terms](https://platica.mx/terminos-y-condiciones)
- [Issues](https://github.com/platicamx/platica-ai-plugins/issues)

The source is licensed under [MIT](LICENSE). Platica retains rights to its name and brand assets.
