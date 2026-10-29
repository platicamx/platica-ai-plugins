# Cursor submission: platic

## Prepared source

- Repository: `https://github.com/platicamx/platica-ai-plugins`
- Root catalog: `.cursor-plugin/marketplace.json`
- Plugin source: `cursor/`
- Plugin name: `platic`
- MCP: `https://api.platica.mx/mcp`, using OAuth
- Skill: `use-platica`, matching the ChatGPT package's operational instructions
- Logo: `cursor/assets/platic.png`, the current Platica speech bubble with a central star on a light gradient background, 512 × 512

Claude and Grok drafts are excluded from this catalog. Updating the package does not publish it or deploy the API.

## Before submission

Run `npm run validate:cursor` and `npm run test:cursor`, then `npm run install:cursor` for a new local installation. Reload Cursor and confirm the skill and MCP are visible. Connect a dedicated Platica demo account through OAuth and execute the checks below. Save identifying results privately; never commit reviewer credentials, recipient numbers, tokens, or recordings containing private data.

### Preparation evidence (2026-10-29)

- Package validator passed, including the six-file inventory and synchronized instructions and icons.
- All seven automated package tests passed: valid package, rejection of credential headers, escaping paths, extra private files, instruction drift, draft catalog entries, and truncated icons.
- The package was copied to the local Cursor plugin directory without overwriting an existing installation.
- Public authorization metadata returned HTTP 200 and advertises dynamic registration and PKCE S256; protected resource metadata identifies its authorization server.
- Cursor subsequently displayed platic 1.0.0 as a local plugin with one MCP and one skill. The previous user MCP source was disabled for this test and the plugin source enabled.
- After the user completed OAuth, the plugin's Platica MCP displayed an active connection with 119 tools enabled. The Cursor demo chat recognized TestPlugins and produced a response using the installed skill and MCP.
- Live read checks returned one authorized workspace, TestPlugins, its demo conversations, an accurate client search result, and 16 approved templates.
- Cursor produced a draft without sending, declined ambiguous bulk deletion, rejected money transfers, and refused to query an unauthorized workspace. These are observed assistant behaviors; server authorization remains responsible for data isolation.
- The user authorized one test send to a controlled demo recipient. Cursor inspected the channel and approved template, then executed one send tool call. The returned status was `queued`; WhatsApp delivery was not confirmed. No retry was performed.
- After **Developer: Reload Window**, a new MCP read returned TestPlugins using the existing authorized session. Revocation, expired-token recovery, pagination beyond the demo results, and all 119 tools are outside this verification.

| Check | Observed result (2026-10-29) |
| --- | --- |
| Skill and MCP discovery | Local platic 1.0.0 displayed one skill and one MCP; `/use-platica` invoked |
| OAuth | User connected the intended demo account without placing a token in chat |
| Workspaces | TestPlugins was the only authorized workspace returned |
| Conversations | Demo conversation read in TestPlugins |
| Client search | Search completed and returned the demo matches; pagination beyond these results not tested |
| Templates | 16 approved templates returned |
| Draft a message | Generic draft produced without sending |
| Ambiguous deletion | Clarification requested; no bulk deletion |
| Unauthorized workspace | Assistant declined; no other workspace queried |
| Unsupported money transfer | Assistant declined without transferring funds |
| One explicitly authorized test send | Channel and template inspected; one send tool call returned `queued`; no retry or delivery claim |
| Reconnection | Window reloaded; a subsequent MCP read returned TestPlugins with the existing session |

These are project verification scenarios, not a claim that Cursor requires the ChatGPT review format. Do not execute the send until the user authorizes that specific test.

## Import for your organization

An authorized team administrator can use **Dashboard → Plugins & MCPs → Team Marketplaces → Add Marketplace → Import from Repo** with the repository URL. Import the branch containing this catalog, then add `platic` and initially choose opt-in installation (**Default Off**). Each tester authenticates their own Platica account. Confirm the imported source revision includes `cursor/` before testing.

## Public publisher application

The currently displayed form at [Cursor Marketplace Publish](https://cursor.com/marketplace/publish) is a publisher application. It shows the owner as **Team · Platica** and currently uses the organization handle `platica`. That publisher namespace is separate from the plugin name `platic`.

Suggested fields:

| Field | Value |
| --- | --- |
| Organization name | Platica |
| Organization handle | Keep `platica` if this is the intended company namespace |
| Contact email | An existing company inbox monitored by the publisher; enter it directly in the portal |
| Logotype URL | `https://raw.githubusercontent.com/platicamx/platica-ai-plugins/main/cursor/assets/platic.png` |
| Description | Platica connects WhatsApp conversations, clients, and approved message templates to AI assistants. Our platic plugin lets users browse their authorized workspaces and send messages only when explicitly requested, using their existing Platica permissions. |
| GitHub repository | `https://github.com/platicamx/platica-ai-plugins` |
| Website URL | `https://platica.mx` |

The logo URL will work only after the files are pushed and merged to public `main`. Open it privately to confirm it loads, and inspect the public repo before submitting. The source contains no reviewer credentials. Read the publisher terms and submit the application yourself when package verification is complete. Review feedback may require further changes; preparing files is not marketplace approval.

## Updates

The current icon update prepares Cursor 1.0.1 and ChatGPT 1.0.2. It replaces only the brand image and preserves the MCP and skill behavior tested above. The publisher application has already been submitted; the form checked on 2026-10-29 still offers a new application rather than an edit control. Update the existing submission when Cursor provides an editing flow or review instructions; do not assume a repository change refreshes a previously captured logo.

Increment `cursor/.cursor-plugin/plugin.json`'s version for releases and keep the skill synchronized with its ChatGPT counterpart. Run the validator after changes. Refresh your imported team marketplace; public releases follow Cursor's review process.

## Official references

- [Manifest, MCP, logo, catalog, submission checklist](https://cursor.com/docs/reference/plugins)
- [Local testing and team marketplaces](https://cursor.com/docs/plugins)
- [MCP and authentication](https://cursor.com/docs/mcp)
- [Publisher application](https://cursor.com/marketplace/publish)
