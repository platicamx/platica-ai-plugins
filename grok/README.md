# platic for Grok Build

Connect your Platica account to work in your authorized workspaces from Grok Build:

- read WhatsApp, Messenger, Instagram and comment conversations;
- manage clients, tags and custom fields;
- review WhatsApp templates and scheduled messages, and send approved templates you request;
- prepare and send campaigns;
- configure AI agents: prompts, schedules, guardrails and knowledge;
- publish and reply to social comments;
- check usage.

The directory profile does not expose generic messages, agent execution/delegation, custom tool discovery/connections, webhook administration, moderation, private replies, knowledge updates/reprocessing or search/export. Use the Platica dashboard for those operations.

Anything that sends a message, publishes, changes data or deletes records happens only when you explicitly ask for it. Access follows your existing workspace role.

## What this plugin contains and connects to

- **`use-platica` skill**: instructions for choosing the workspace, resolving channels and templates, and confirming sensitive actions.
- **Platica MCP server** (`.mcp.json`): a hosted HTTP server at `https://api.platica.mx/mcp/apps`. It is the only network endpoint the plugin uses. The plugin runs no local code, hooks or scripts.

**Credentials:** none are bundled or requested. Each user signs in with their Platica account through OAuth on first connect. Credentials for external services, such as custom API tools or third-party MCP servers, are configured in the Platica dashboard; those tools are not part of this plugin.

## Examples

- List the workspaces in my Platica account.
- Show recent conversations in my Platica workspace.
- Find a client named Ana in my Platica workspace.
- Create a draft campaign with the approved test template, without sending it.

## Data and support

Tools exchange the data needed for each request with `api.platica.mx`, which may include workspace IDs, names, phone numbers and message content. The plugin adds no separate data store; Platica handles account data under its privacy policy.

- [Setup and MCP documentation](https://docs.platica.mx/mcp/bienvenida)
- [Package issues](https://github.com/platicamx/platica-ai-plugins/issues)

| Language | Privacy | Terms | Support |
| --- | --- | --- | --- |
| English | [Privacy notice](https://platica.mx/en/privacy) | [Terms and conditions](https://platica.mx/en/terms-and-conditions) | [Support](https://platica.mx/en/support) |
| Português | [Aviso de privacidade](https://platica.mx/pt/privacidade) | [Termos e condições](https://platica.mx/pt/termos-e-condicoes) | [Suporte](https://platica.mx/pt/suporte) |
| Español | [Aviso de privacidad](https://platica.mx/privacidad) | [Términos y condiciones](https://platica.mx/terminos-y-condiciones) | [Soporte](https://platica.mx/soporte) |

Source is licensed under [MIT](LICENSE). Platica retains rights to its name and brand assets.
