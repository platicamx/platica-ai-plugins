# platica-ai-plugins

Official source for **platic**, the Platica plugin for ChatGPT and Codex.

Connect your Platica account to browse workspaces, conversations, clients, and WhatsApp templates, and send messages you explicitly request. Access follows your authorized workspaces and current account permissions. The package connects to the hosted Platica MCP server using OAuth; no API keys are included.

This first release contains the ChatGPT package. Other platforms will be added in separate releases after their packages are verified.

## Build the upload package

With Node.js installed, run from the repository root:

```sh
npm run zip:chatgpt
```

Upload `dist/platic-chatgpt.zip` at [OpenAI Plugins](https://platform.openai.com/plugins). The ZIP contains the manifest, MCP configuration, onboarding skill, brand icon, and license. Generated ZIPs and local platform drafts are excluded from Git.

## Submit for review

The package includes five positive and three negative review scenarios. These are scenarios to execute, not evidence that they have passed. Before submitting:

1. Complete publisher identity verification and the MCP domain challenge shown in the portal.
2. Connect the MCP using OAuth and resolve the portal's metadata, skill, and tool findings.
3. Provide a dedicated reviewer account and sign-in instructions through the portal's private review form. Prepare a demo workspace with a connected WhatsApp channel, approved test template, example parameters, and a controlled demo recipient. Keep credentials and recipient details outside this repository and the ZIP.
4. Run all eight scenarios with that account, record the walkthrough, and provide the video URL in the portal.
5. Submit for review. Publish after approval.

Packaging does not verify the live OAuth flow, tool annotations, or WhatsApp delivery. See the [official submission guide](https://developers.openai.com/plugins/deploy/submission).

## Support and license

- [MCP documentation](https://docs.platica.mx/mcp/bienvenida)
- [Privacy policy](https://platica.mx/privacidad)
- [Terms](https://platica.mx/terminos-y-condiciones)

The package source is licensed under [MIT](LICENSE). The Platica name and brand assets remain the property of Platica; the code license does not grant trademark rights.
