import assert from "node:assert/strict";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { packageFiles, root, validateCursor } from "./validate-cursor.mjs";

function fixture(t) {
  const tempBase = realpathSync(tmpdir());
  const dir = mkdtempSync(join(tempBase, "platic-package-test-"));
  t.after(() => {
    const target = realpathSync(dir);
    assert.equal(dirname(target), tempBase, "Cleanup must stay within the temporary directory");
    assert(target.startsWith(join(tempBase, "platic-package-test-")), "Unexpected fixture cleanup target");
    rmSync(target, { recursive: true, force: true });
  });
  const files = [
    ...packageFiles.map((name) => `cursor/${name}`),
    ".cursor-plugin/marketplace.json", "LICENSE",
    "chatgpt/skills/use-platica/SKILL.md", "chatgpt/assets/platic.png",
  ];
  for (const name of files) {
    mkdirSync(dirname(join(dir, name)), { recursive: true });
    copyFileSync(join(root, name), join(dir, name));
  }
  return dir;
}

function changeJson(dir, name, change) {
  const path = join(dir, name);
  const value = JSON.parse(readFileSync(path, "utf8"));
  change(value);
  writeFileSync(path, JSON.stringify(value));
}

test("the complete source package passes validation", (t) => {
  assert.doesNotThrow(() => validateCursor(fixture(t)));
});

test("a credential header cannot enter the distributable MCP config", (t) => {
  const dir = fixture(t);
  changeJson(dir, "cursor/mcp.json", (j) => { j.mcpServers.platica.headers = { Authorization: "synthetic-invalid-header" }; });
  assert.throws(() => validateCursor(dir), /no headers, tokens, commands/);
});

test("a component cannot reference a file outside the package", (t) => {
  const dir = fixture(t);
  changeJson(dir, "cursor/.cursor-plugin/plugin.json", (j) => { j.logo = "../chatgpt/assets/platic.png"; });
  assert.throws(() => validateCursor(dir), /Invalid component path/);
});

test("an extra private setup file cannot enter the package", (t) => {
  const dir = fixture(t);
  writeFileSync(join(dir, "cursor", "reviewer-setup.txt"), "synthetic private setup");
  assert.throws(() => validateCursor(dir), /Unexpected or missing package file/);
});

test("safety instruction drift across platforms is rejected", (t) => {
  const dir = fixture(t);
  writeFileSync(join(dir, "cursor/skills/use-platica/SKILL.md"), "---\nname: use-platica\ndescription: A test skill\n---\nChanged instructions.\n");
  assert.throws(() => validateCursor(dir), /instructions synchronized/);
});

test("unverified platform drafts cannot appear in the Cursor catalog", (t) => {
  const dir = fixture(t);
  changeJson(dir, ".cursor-plugin/marketplace.json", (j) => { j.plugins.push({ name: "draft", source: ".drafts/claude" }); });
  assert.throws(() => validateCursor(dir), /only the Cursor package/);
});

test("a truncated icon cannot pass the package check", (t) => {
  const dir = fixture(t);
  writeFileSync(join(dir, "cursor/assets/platic.png"), Buffer.from("invalid image"));
  assert.throws(() => validateCursor(dir));
});
