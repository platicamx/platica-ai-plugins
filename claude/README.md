# platic for Claude

Connect your Platica account to work in your authorized workspaces from Claude:

- read and search WhatsApp, Messenger, Instagram and comment conversations;
- manage clients, tags and custom fields;
- review WhatsApp templates and scheduled messages, and send messages you request;
- prepare and send campaigns;
- configure AI agents: prompts, schedules, guardrails, sub-agents and knowledge;
- reply to and moderate social comments;
- manage webhooks and check usage.

Anything that sends a message, publishes, changes data or deletes records happens only when you explicitly ask for it. Access follows your existing workspace role.

## What this plugin contains and connects to

- **`use-platica` skill**: instructions for Claude on choosing the workspace, resolving channels and templates, and confirming sensitive actions.
- **Platica MCP server**: a remote server at `https://api.platica.mx/mcp/apps`. It is the only network endpoint the plugin uses. The plugin runs no local code, hooks or scripts.

Each user signs in with OAuth on first connect. The plugin contains no API keys or tokens, and no tool asks for one. Credentials for external services, such as custom API tools or third-party MCP servers, are configured in the Platica dashboard; those tools are not part of this plugin.

## Examples

- List the workspaces in my Platica account.
- Show recent conversations in my Platica workspace.
- Find a client named Ana in my Platica workspace.
- Which WhatsApp templates are approved in my Platica workspace?
- Create a draft campaign with the approved test template, without sending it.

Sending requires an explicit request identifying the channel, recipient, template or message, and any parameters. Listing or drafting does not authorize a send. A queued response does not confirm delivery.

## Data and support

Tools exchange the data needed for each request with `api.platica.mx`, which may include workspace IDs, names, phone numbers and message content. The plugin adds no separate data store; Platica handles account data under its privacy policy.

- [Setup and MCP documentation](https://docs.platica.mx/mcp/bienvenida)
- [Privacy policy](https://platica.mx/privacidad)
- [Terms of service](https://platica.mx/terminos-y-condiciones)
- [Package issues](https://github.com/platicamx/platica-ai-plugins/issues)

Source is licensed under [MIT](LICENSE). Platica retains rights to its name and brand assets.
