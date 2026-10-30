import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const appsUrl = "https://api.platica.mx/mcp/apps";

const text = (path) => readFileSync(path, "utf8").replaceAll("\r\n", "\n");
const json = (path) => JSON.parse(text(path));

// Claude and Grok Build read the same layout: a manifest folder, `.mcp.json`
// with one remote HTTP server, the shared skill, a README and a license.
const packages = [
  { dir: "claude", manifest: ".claude-plugin/plugin.json" },
  { dir: "grok", manifest: ".grok-plugin/plugin.json" },
];

export function validateDirectories(repositoryRoot = root) {
  const sharedSkill = text(join(repositoryRoot, "chatgpt/skills/use-platica/SKILL.md"));
  const cursorVersion = json(join(repositoryRoot, "cursor/.cursor-plugin/plugin.json")).version;

  for (const { dir, manifest: manifestPath } of packages) {
    const base = join(repositoryRoot, dir);
    const manifest = json(join(base, manifestPath));
    assert.equal(manifest.name, "platic", `${dir}: name`);
    assert.equal(manifest.version, cursorVersion, `${dir}: release every package with the same version`);
    assert(manifest.description && manifest.author?.name, `${dir}: description and author`);
    assert.equal(manifest.license, "MIT", `${dir}: license`);

    // Only the hosted URL: no headers, tokens, commands or environment.
    assert.deepEqual(
      json(join(base, ".mcp.json")),
      { mcpServers: { platica: { type: "http", url: appsUrl } } },
      `${dir}: .mcp.json must point at ${appsUrl} and nothing else`,
    );

    assert.equal(text(join(base, "skills/use-platica/SKILL.md")), sharedSkill, `${dir}: keep the skill in sync`);
    assert.equal(text(join(base, "LICENSE")), text(join(repositoryRoot, "LICENSE")), `${dir}: LICENSE`);

    // Claude's directory blocks a README under 40 words outside code blocks.
    const readme = text(join(base, "README.md")).replace(/```[\s\S]*?```/g, "");
    assert(readme.split(/\s+/).filter(Boolean).length >= 40, `${dir}: README needs at least 40 words`);
    assert(readme.includes(appsUrl), `${dir}: README must name the endpoint it connects to`);

    if (manifest.logo) assert(existsSync(join(base, manifest.logo)), `${dir}: logo file`);
  }
  console.log(`Directory package checks passed: ${packages.map((p) => p.dir).join(", ")}.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) validateDirectories();
