# Envío a Meta Muse

Muse no usa un paquete de plugin: se envía el servidor MCP por un formulario del **Muse Connector Platform** ([platform.muse.ai](https://platform.muse.ai)). Lo que pide, según sus [connector guidelines](https://platform.muse.ai/docs):

- datos del conector y verificación de la empresa;
- un cuestionario de manejo de datos;
- el endpoint y la autenticación;
- la documentación de cada tool con su clasificación **Read / Write / Sensitive write**;
- una cuenta de prueba.

Muse no responde correos sobre el estado: hay que revisarlo en el portal.

## Antes de empezar

- [ ] `platicaApi` desplegado con `/mcp/apps` (Ipsofacto99/platica-api#22).
- [ ] Documentos de la empresa para la verificación (§5.2): datos fiscales o de constitución, prueba de que puedes enviar en nombre de Platica, contactos de soporte y de seguridad, y un desarrollador responsable del mantenimiento.
- [ ] Cuenta demo con datos (workspace `TestPlugins`), activa durante toda la revisión. Las credenciales van solo en el formulario seguro, nunca en este repo.
- [ ] Icono: `chatgpt/assets/platic.png` (512 × 512).

## Formulario

| Sección | Qué poner |
|---|---|
| **Connector name** | `platic` |
| **Company / developer** | `Platica`, `https://platica.mx` |
| **Example prompts** (uno por línea) | Ver abajo |
| **Icon** | `chatgpt/assets/platic.png` |
| **Payments** | No |
| **Support** | Correo o URL de soporte de Platica |
| **Privacy policy / Terms** | `https://platica.mx/privacidad`, `https://platica.mx/terminos-y-condiciones` |
| **Connection type** | **Existing MCP** → `https://api.platica.mx/mcp/apps` |
| **Documentation** | `https://docs.platica.mx/mcp/bienvenida` y este archivo (la tabla de tools de abajo) |
| **Authentication** | **OAuth with PKCE**, con **Use DCR** si el formulario lo ofrece. Ver la nota de OAuth. |
| **Access requirements** | Cuenta de Platica. Para enviar mensajes, un canal de WhatsApp conectado. Sin restricciones regionales propias. |

**Connector overview (§5.1):**

```text
platic connects Muse to a Platica workspace, the WhatsApp and social inbox that businesses use with their customers.
Intended users: business owners, support and sales teams already using Platica.
Supported tasks: read and search WhatsApp, Messenger, Instagram and comment conversations; manage clients, tags and custom fields; review WhatsApp templates and scheduled messages; send messages and campaigns the user asks for; configure AI agents and their knowledge; reply to and moderate social comments; manage webhooks; check usage.
Why a connector instead of browsing: the Platica dashboard requires an authenticated session and many screens per task; the connector reaches the same data through Platica's own API with the user's role and permissions.
Restrictions: requires a Platica account; sending requires a connected WhatsApp channel and the workspace role that allows it.
```

**Example prompts:**

```text
List the workspaces in my Platica account.
Show recent conversations in my Platica workspace.
Find a client named Ana in my Platica workspace.
Which WhatsApp templates are approved in my Platica workspace?
Create a draft campaign with the approved test template, but do not send it.
Show the knowledge entries of my support agent.
```

### Nota de OAuth

Platica soporta OAuth 2.1 con DCR (`https://api.platica.mx/oauth/register`) y PKCE S256. El registro dinámico acepta cualquier redirect `https://`, así que el callback de Muse funciona sin configurarlo. Si el formulario pide un **client ID y secret fijos** en lugar de DCR, registra un cliente con el callback que te muestre Muse y pega los valores en el formulario seguro:

```bash
curl -s https://api.platica.mx/oauth/register \
  -H "Content-Type: application/json" \
  -d '{"client_name":"Meta Muse","redirect_uris":["<callback de Muse>"],"token_endpoint_auth_method":"client_secret_post"}'
```

Muse pide ofrecer un permiso de **solo lectura** cuando sea posible (§3.1). El servidor acepta conceder solo el scope `platica:read`; confirma que la pantalla de consentimiento de app.platica.mx lo ofrezca antes de enviar.

## Cuestionario de manejo de datos (§5.3)

Las respuestas tienen que coincidir con la política de privacidad. Este es un borrador para revisar con quien la mantiene:

```text
Data accessed: workspace names and IDs, conversations and messages, client contact data (name, phone, email, custom fields), templates, campaigns, AI agent configuration and knowledge, webhook configuration, usage metrics. Only what each requested tool needs.
Purpose: to answer the user's request in Muse. No secondary use, no advertising, no model training.
Protection: HTTPS only; OAuth access tokens scoped to the workspaces the user authorizes; every call is checked against the user's live workspace role.
Sharing: data goes only to Muse as the tool response for the user's request. Webhooks send events only to URLs the user configures.
Retention: the connector stores no copy of tool responses beyond Platica's normal account data. OAuth tokens are deleted when access is revoked.
Deletion: revoking the connection invalidates its tokens; account data deletion follows Platica's privacy policy.
```

## Cuenta de prueba (§5.5)

```text
Sign in at app.platica.mx with the review account below and select the workspace "TestPlugins".
Representative data: demo conversations, clients, approved templates (including test_welcome_message), one AI agent with knowledge.
Sends: the demo WhatsApp channel and the demo recipient below reach phones controlled by Platica; no real customer is contacted.
Review account: <email> / <password>   (no 2FA)
Demo recipient: <number>
```

## Clasificación de tools (§3.2, §5.6)

El portal todavía no permite anotar tools, así que esta tabla es la documentación de clasificación. Criterios:

- **Read:** solo consulta.
- **Write:** crea, cambia o borra datos dentro del workspace, de forma acotada o reversible.
- **Sensitive write:** llega a personas, publica algo, cambia lo que el agente en vivo responde a los clientes, manda datos a una URL externa o borra datos de forma irreversible. Muse pide aprobación cada vez para estas tools, y la skill de Platica también exige confirmación explícita.

`list_templates`, `get_template` y `search_workspace_conversations` solo leen, pero pueden refrescar una caché interna. Por la regla de Muse ("una tool que combina lectura y escritura es Write"), van como Write.

**Total: 103 tools: 45 Read, 35 Write, 23 Sensitive write.**

| Tool | Title | Area | Classification | Notes |
|---|---|---|---|---|
| `get_agent` | Get agent | agents | Read |  |
| `list_agents` | List agents | agents | Read |  |
| `get_agent_assist_rules` | Get assist-rules | agentSections | Read |  |
| `get_agent_guardrails` | Get guardrails | agentSections | Read |  |
| `get_agent_prompt` | Get agent prompt | agentSections | Read |  |
| `get_agent_schedule` | Get schedule | agentSections | Read |  |
| `list_agent_knowledge` | List knowledge | agentSections | Read |  |
| `list_agent_prompt_versions` | List prompt versions | agentSections | Read |  |
| `list_agent_subagents` | List sub-agents | agentSections | Read |  |
| `list_available_subagents` | List connectable agents | agentSections | Read |  |
| `get_campaign` | Get campaign | campaigns | Read |  |
| `get_campaign_audience` | Get campaign audience | campaigns | Read |  |
| `list_campaigns` | List campaigns | campaigns | Read |  |
| `get_channel` | Get channel | channels | Read |  |
| `list_channels` | List channels | channels | Read |  |
| `get_chat` | Get API chat | chat | Read |  |
| `list_chats` | List API chats | chat | Read |  |
| `get_client` | Get client | clients | Read |  |
| `list_client_conversations` | List client conversations | clients | Read |  |
| `list_clients` | List clients | clients | Read |  |
| `get_conversation` | Get conversation | conversations | Read |  |
| `list_conversations` | List conversations | conversations | Read |  |
| `list_custom_fields` | List custom fields | customFields | Read |  |
| `get_product_doc` | Read Platica product documentation | docs | Read |  |
| `search_product_docs` | Search Platica product documentation | docs | Read |  |
| `get_scheduled_message` | Get scheduled message | messages | Read |  |
| `list_scheduled_messages` | List scheduled messages | messages | Read |  |
| `get_comment_thread` | Get comment thread | posts | Read |  |
| `get_post` | Get comment post | posts | Read |  |
| `list_comment_threads` | List comment threads | posts | Read |  |
| `list_posts` | List comment posts | posts | Read |  |
| `list_tags` | List tags | tags | Read |  |
| `get_workspace_tool` | Get workspace tool | tools | Read |  |
| `list_agent_tools` | List agent tools | tools | Read |  |
| `list_available_agent_tools` | List connectable tools | tools | Read |  |
| `list_workspace_tools` | List workspace tools | tools | Read |  |
| `get_usage_actors` | Get usage by actor | usage | Read |  |
| `get_usage_conversations` | Get conversation usage | usage | Read |  |
| `get_usage_messages` | Get message usage | usage | Read |  |
| `get_usage_period` | Get usage billing period | usage | Read |  |
| `get_usage_summary` | Get usage summary | usage | Read |  |
| `get_webhook` | Get webhook | webhooks | Read |  |
| `list_webhook_events` | List webhook event catalog | webhooks | Read |  |
| `list_webhooks` | List webhooks | webhooks | Read |  |
| `list_workspaces` | List workspaces | workspaces | Read |  |
| `create_agent` | Create agent | agents | Write |  |
| `update_agent` | Update agent | agents | Write |  |
| `connect_agent_subagent` | Connect sub-agent | agentSections | Write |  |
| `create_agent_knowledge_from_url` | Create knowledge from file URL or text | agentSections | Write |  |
| `create_agent_subagent` | Create + connect sub-agent | agentSections | Write |  |
| `disconnect_agent_subagent` | Disconnect sub-agent | agentSections | Write |  |
| `ingest_agent_knowledge_from_web` | Ingest knowledge from URLs | agentSections | Write |  |
| `update_agent_assist_rules` | Update assist-rules | agentSections | Write |  |
| `update_agent_knowledge` | Update knowledge | agentSections | Write |  |
| `update_agent_schedule` | Update schedule | agentSections | Write |  |
| `update_agent_subagent_connection` | Update sub-agent connection | agentSections | Write |  |
| `add_campaign_audience` | Add clients to campaign audience | campaigns | Write |  |
| `create_campaign` | Create campaign | campaigns | Write |  |
| `remove_campaign_audience_client` | Remove client from campaign audience | campaigns | Write |  |
| `update_campaign` | Update campaign | campaigns | Write |  |
| `send_chat_message` | Send chat message | chat | Write |  |
| `block_client` | Block client | clients | Write |  |
| `create_client` | Create client | clients | Write |  |
| `unblock_client` | Unblock client | clients | Write |  |
| `update_client` | Update client | clients | Write |  |
| `update_conversation` | Update conversation | conversations | Write |  |
| `create_custom_field` | Create custom field | customFields | Write |  |
| `update_custom_field` | Update custom field | customFields | Write |  |
| `cancel_scheduled_message` | Cancel scheduled message | messages | Write |  |
| `reschedule_scheduled_message` | Reschedule scheduled message | messages | Write |  |
| `update_comment_thread` | Update comment thread | posts | Write |  |
| `update_post` | Pause or resume the agent on a post | posts | Write |  |
| `search_workspace_conversations` | Search workspace conversations | search | Write | Reads data; may refresh an internal cache, so it is classified as a write |
| `create_tag` | Create tag | tags | Write |  |
| `update_tag` | Update tag | tags | Write |  |
| `get_template` | Get WhatsApp template | templates | Write | Reads data; may refresh an internal cache, so it is classified as a write |
| `list_templates` | List WhatsApp templates | templates | Write | Reads data; may refresh an internal cache, so it is classified as a write |
| `connect_agent_tool` | Connect tool to agent | tools | Write |  |
| `disconnect_agent_tool` | Disconnect tool from agent | tools | Write |  |
| `update_agent_tool_status` | Activate / deactivate agent tool | tools | Write |  |
| `delete_agent` | Delete agent | agents | Sensitive write | Deletes an agent |
| `delete_agent_knowledge` | Delete knowledge | agentSections | Sensitive write | Deletes a knowledge entry |
| `edit_agent_prompt` | Edit agent prompt | agentSections | Sensitive write | Changes what the live agent tells customers |
| `update_agent_guardrails` | Update guardrails | agentSections | Sensitive write | Changes the live agent's safety rules |
| `write_agent_prompt` | Write agent prompt | agentSections | Sensitive write | Replaces what the live agent tells customers |
| `clear_campaign_audience` | Clear entire campaign audience | campaigns | Sensitive write | Removes the whole campaign audience |
| `delete_campaign` | Delete campaign | campaigns | Sensitive write | Deletes a campaign |
| `send_campaign` | Send campaign | campaigns | Sensitive write | Sends a campaign to its whole audience |
| `assign_channel_agent` | Assign channel agent | channels | Sensitive write | Changes which agent answers a channel |
| `delete_client` | Delete client | clients | Sensitive write | Deletes a client |
| `reset_client_strikes` | Reset client strikes | clients | Sensitive write | Can erase the client's moderation history |
| `delete_custom_field` | Delete custom field | customFields | Sensitive write | Deletes a custom field |
| `send_message` | Send service message | messages | Sensitive write | Sends a WhatsApp message to a contact |
| `send_template_message` | Send WhatsApp template message | messages | Sensitive write | Sends a WhatsApp template to a contact |
| `moderate_comment` | Moderate a comment | posts | Sensitive write | Hides or deletes a public comment |
| `publish_comment` | Publish a comment on a post | posts | Sensitive write | Publishes a public comment |
| `reply_to_comment` | Reply publicly in a comment thread | posts | Sensitive write | Publishes a public reply |
| `send_private_reply` | Send a private reply to a commenter | posts | Sensitive write | Sends a private message to the commenter |
| `send_thread_to_agent` | Send a thread to the agent | posts | Sensitive write | Lets the agent reply publicly in the thread |
| `delete_tag` | Delete tag | tags | Sensitive write | Deletes a tag |
| `create_webhook` | Create webhook | webhooks | Sensitive write | Sends workspace events to an external URL |
| `delete_webhook` | Delete webhook | webhooks | Sensitive write | Deletes a webhook |
| `update_webhook` | Update webhook | webhooks | Sensitive write | Changes the external URL that receives events |
