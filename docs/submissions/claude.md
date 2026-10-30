# Envío a Claude (Anthropic)

En Claude se hacen **dos envíos** desde el mismo portal, [claude.ai/directory/manage](https://claude.ai/directory/manage) → **Submit new**:

1. **MCP connector**: el servidor `https://api.platica.mx/mcp/apps`.
2. **Plugin bundle**: la carpeta `claude/` de este repositorio (skill + referencia al mismo servidor).

Anthropic recomienda enviar los dos y emparejarlos, para que quien instale el plugin y el conector vea un solo juego de tools. Fuentes: [Publish to the directory](https://claude.com/docs/directory/publish.md), [Submit a connector](https://claude.com/docs/connectors/building/submission.md), [Plugin pre-submission checklist](https://claude.com/docs/plugins/pre-submission-checklist.md).

## Antes de empezar

- [ ] `platicaApi` desplegado con `/mcp/apps` (Ipsofacto99/platica-api#22).
- [ ] Cuenta de Claude con plan de pago (Pro, Max, Team o Enterprise). En Team o Enterprise, envía un Owner.
- [ ] Probado como **custom connector** en Claude: agrega `https://api.platica.mx/mcp/apps`, inicia sesión y llama cada tool que uses en los ejemplos. El paso **Test & launch** pide confirmarlo.
- [ ] Si hay un WAF o firewall delante de la API, permite el rango de Anthropic `160.79.104.0/21`.
- [ ] Cuenta demo para revisores con datos (workspace `TestPlugins`). Las credenciales se escriben solo en el portal, nunca en este repo.

### Requisitos técnicos que ya cumple el servidor

| Requisito de Anthropic | Estado en Platica |
|---|---|
| Cada tool con `title` y `readOnlyHint` o `destructiveHint` | Las 103 tools de `/mcp/apps` los tienen |
| Nombres de tool de 64 caracteres o menos | Sí |
| OAuth 2.0 con DCR | `/.well-known/oauth-authorization-server` anuncia `registration_endpoint` |
| PKCE S256 | Anunciado en `code_challenge_methods_supported` |
| `401` con `resource_metadata` | `/mcp/apps` responde 401 apuntando a `/.well-known/oauth-protected-resource/mcp/apps` |
| `resource` igual a la URL del servidor | El documento de `/mcp/apps` dice `https://api.platica.mx/mcp/apps` |
| Redirect `https://claude.ai/api/mcp/auth_callback` y loopback de Claude Code | DCR acepta HTTPS y `http://localhost` / `127.0.0.1` |
| `/oauth/token` acepta `application/x-www-form-urlencoded` | Sí |
| Sin catch-all de métodos HTTP ni transferencias de dinero | Las API tools personalizadas no están en `/mcp/apps` |

## Envío 1: MCP connector

| Paso del portal | Qué poner |
|---|---|
| **Connection** | `https://api.platica.mx/mcp/apps`, **Universal URL** |
| **Tools** | Se sincronizan solas. No debe aparecer ninguna advertencia de anotaciones. |
| **Listing → Name** (≤100) | `platic` |
| **Listing → One-liner** (≤200) | `Work with your Platica WhatsApp conversations, clients, campaigns and AI agents from Claude.` |
| **Listing → Description** (≤2,000) | Ver abajo |
| **Listing → Categories** (1–5) | Las que más se acerquen a: Communication, Customer support, Sales / CRM, Productivity |
| **Listing → Documentation URL** | `https://docs.platica.mx/mcp/bienvenida` |
| **Listing → Privacy policy URL** | `https://platica.mx/privacidad` |
| **Listing → Support contact** | El correo o URL de soporte de Platica |
| **Listing → Icon** | `chatgpt/assets/platic.png` (512 × 512) |
| **Listing → Slug** | `platic` (**permanente** una vez publicado) |
| **Use cases** | Ver abajo. Requisitos: cuenta de Platica; para enviar, un canal de WhatsApp conectado. Lee y escribe datos. |
| **Company** | `Platica`, `https://platica.mx`, contacto principal para la revisión |
| **Authentication** | **Always required** → **OAuth sign-in** con registro dinámico (DCR). No llenes Anthropic-held credentials. |
| **Data handling** | API propia (first-party). No maneja datos de salud ni contenido patrocinado. |
| **Test & launch** | Ver abajo |
| **Compliance** | Las 7 confirmaciones. Platica no transfiere dinero ni genera imágenes, video o audio. |

**Description:**

```text
Connect your Platica account to work in your authorized workspaces from Claude. Read and search WhatsApp, Messenger, Instagram and comment conversations; manage clients, tags and custom fields; review WhatsApp templates and scheduled messages; prepare and send campaigns; configure your AI agents, their prompts, schedules and knowledge; reply to and moderate social comments; manage webhooks; and check usage.

Anything that sends a message, publishes, changes data or deletes records happens only when you explicitly ask for it. Write tools are annotated so Claude asks before running them. Access follows your current workspace role and the permissions you authorize when you sign in with OAuth.
```

**Use cases:**

```text
- Review recent WhatsApp conversations and find a client by name or phone.
- Check which WhatsApp templates are approved and send one the user asks for.
- Draft a campaign with an approved template and review its audience before sending.
- Update an AI agent's prompt, schedule or knowledge base.
- Reply to or moderate comments on Facebook and Instagram posts.
```

**Test & launch** (instrucciones para el revisor):

```text
1. Add the connector and choose Connect. Sign in at app.platica.mx with the review account below.
2. On the consent screen, select the workspace "TestPlugins" and approve read and write access.
3. Try: "List the workspaces in my Platica account", "Show recent conversations in TestPlugins",
   "Which WhatsApp templates are approved in TestPlugins?".
4. Write tools are safe to run in TestPlugins. To test a send, use the template test_welcome_message
   and the demo recipient listed below; it reaches a phone controlled by Platica.
Review account: <email> / <password>   (no 2FA)
Demo recipient: <number>
```

## Envío 2: Plugin bundle

| Campo | Valor |
|---|---|
| Repository | `https://github.com/platicamx/platica-ai-plugins` (público) |
| Plugin folder | `claude` |
| Branch | `main` |

1. Presiona **Validate** y corrige cualquier hallazgo marcado como **Blocking**. Localmente puedes correr `claude plugin validate ./claude` y `npm run validate:directories`.
2. Envía. Cada commit nuevo en `main` se escanea y, si pasa, se publica como versión nueva; sube `version` en `claude/.claude-plugin/plugin.json` en cada release.
3. Con los dos listados enviados desde la misma organización, **empareja** el plugin con el conector.

## Después de enviar

- El conector se escanea y, por defecto, se publica como **Community**. Anthropic puede escalarlo a **Verified**.
- El estado y los comentarios aparecen en el portal. Escalaciones: `mcp-review@anthropic.com`.
- Cualquier cambio importante (tools nuevas o distintas) se reporta a Anthropic y puede pasar por otra revisión.
