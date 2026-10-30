# platic for Cursor

Connect your Platica account to browse authorized workspaces, WhatsApp conversations, clients, and templates. Send messages only when you explicitly request them. Access follows your existing workspace role.

This Cursor plugin includes the `use-platica` skill and the hosted Platica MCP server. OAuth connects each user's own account; the package contains no API keys or tokens. A Platica account is required, and sending requires an eligible WhatsApp channel and sufficient permissions.

## Try it locally

From the repository root, with Node.js installed:

```sh
npm run validate:cursor
npm run install:cursor
```

The installer copies this package to `~/.cursor/plugins/local/platic`. It refuses to overwrite an existing installation. Restart Cursor or run **Developer: Reload Window**, then open **Customize** and check for `use-platica` and the Platica MCP server. Enterprise organizations may require an admin to allow local plugin imports. An installed marketplace version with the same name takes precedence.

Connect the MCP through Cursor's OAuth interface and sign in to the intended Platica account. Never paste credentials into a chat. Invoke `/use-platica` with a request such as:

> List the workspaces in my Platica account.

Other examples:

- Show recent conversations in my selected Platica workspace.
- Find a client named Ana in my Platica workspace.
- Which WhatsApp templates are approved in my Platica workspace?

Sending requires an explicit request identifying the channel, controlled recipient, template or message, and any parameters. Listing or drafting does not authorize a send. A queued response does not confirm delivery. Never automatically retry an uncertain send.

## Data and support

Tools exchange the data needed for the requested operation with `api.platica.mx`, which may include workspace IDs, names, phone numbers, and message content. This package adds no separate data store; Platica handles account data under its privacy policy. Tool results can contain personal data: use a demo account for recordings and remove private details before sharing them.

- [Setup and MCP documentation](https://docs.platica.mx/mcp/bienvenida)
- [Privacy policy](https://platica.mx/privacidad)
- [Terms of service](https://platica.mx/terminos-y-condiciones)
- [Package issues](https://github.com/platicamx/platica-ai-plugins/issues)

Source is licensed under [MIT](LICENSE). Platica retains rights to its name and brand assets.
