import assert from "node:assert/strict";
import { lstatSync, readFileSync, readdirSync, realpathSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const cursorRoot = join(root, "cursor");
export const packageFiles = [
  ".cursor-plugin/plugin.json", "mcp.json", "README.md", "LICENSE",
  "skills/use-platica/SKILL.md", "assets/platic.png",
];

const text = (path) => readFileSync(path, "utf8").replaceAll("\r\n", "\n");
const json = (path) => JSON.parse(text(path));

export function validateCursor(repositoryRoot = root) {
  const root = resolve(repositoryRoot);
  const cursorRoot = join(root, "cursor");
  const found = [];
  function walk(dir) {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      const stat = lstatSync(path);
      assert(!stat.isSymbolicLink(), "Package must not contain symlinks");
      if (stat.isDirectory()) walk(path);
      else { assert(stat.isFile(), "Expected regular file"); found.push(relative(cursorRoot, path).replaceAll("\\", "/")); }
    }
  }
  walk(cursorRoot);
  assert.deepEqual(found.sort(), [...packageFiles].sort(), "Unexpected or missing package file");
  function packagePath(value) {
    assert(typeof value === "string" && !isAbsolute(value) && !value.split(/[\\/]/).includes(".."), "Invalid component path");
    const path = realpathSync(join(cursorRoot, value));
    const rel = relative(realpathSync(cursorRoot), path);
    assert(rel !== ".." && !rel.startsWith(`..${process.platform === "win32" ? "\\" : "/"}`) && !isAbsolute(rel), "Path escapes package");
    return path;
  }
  const manifest = json(join(cursorRoot, ".cursor-plugin/plugin.json"));
  assert.equal(manifest.name, "platic");
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert(manifest.description && manifest.author?.name);
  assert.equal(manifest.license, "MIT");
  assert.equal(manifest.repository, "https://github.com/platicamx/platica-ai-plugins");
  assert.equal(manifest.homepage, "https://platica.mx");
  assert.equal(manifest.skills, "skills/");
  assert.equal(manifest.mcpServers, "mcp.json");
  packagePath(manifest.skills);
  const mcp = json(packagePath(manifest.mcpServers));
  assert.deepEqual(mcp, { mcpServers: { platica: { url: "https://api.platica.mx/mcp/apps" } } }, "Only the hosted MCP URL belongs in this config; no headers, tokens, commands, or environment");
  const catalog = json(join(root, ".cursor-plugin/marketplace.json"));
  assert(catalog.name && catalog.owner?.name);
  assert.deepEqual(catalog.plugins, [{ name: "platic", source: "cursor" }], "Catalog must expose only the Cursor package");
  const skill = text(join(cursorRoot, "skills/use-platica/SKILL.md"));
  assert.match(skill, /^---\nname: use-platica\ndescription: .+\n---\n/);
  assert.equal(skill, text(join(root, "chatgpt/skills/use-platica/SKILL.md")), "Keep platform safety and tool instructions synchronized");
  assert.equal(text(join(cursorRoot, "LICENSE")), text(join(root, "LICENSE")));
  const png = readFileSync(packagePath(manifest.logo));
  assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(png.readUInt32BE(16), 512);
  assert.equal(png.readUInt32BE(20), 512);
  assert.deepEqual(png, readFileSync(join(root, "chatgpt/assets/platic.png")), "Use the same brand icon on both platforms");
  console.log(`Cursor package checks passed: ${packageFiles.length} files, catalog, MCP URL, paths, skill, license, 512x512 logo.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) validateCursor();
