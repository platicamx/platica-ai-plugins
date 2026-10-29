import { copyFileSync, existsSync, lstatSync, mkdirSync, realpathSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { cursorRoot, packageFiles, validateCursor } from "./validate-cursor.mjs";

validateCursor();
const localRoot = join(homedir(), ".cursor", "plugins", "local");
// Reject redirected parent folders before writing outside the intended user directory.
let current = homedir();
for (const part of [".cursor", "plugins", "local"]) {
  current = join(current, part);
  if (existsSync(current) && lstatSync(current).isSymbolicLink()) {
    throw new Error("Local plugin parent must not be a symlink");
  }
}
mkdirSync(localRoot, { recursive: true });
const destination = join(realpathSync(localRoot), "platic");
if (existsSync(destination)) {
  throw new Error("A local platic installation already exists. Review or move it before installing; nothing was overwritten.");
}
mkdirSync(destination);
for (const name of packageFiles) {
  const target = join(destination, name);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(join(cursorRoot, name), target);
}
console.log(`Installed local package at ${destination}`);
console.log("Reload Cursor, inspect Customize, then connect the intended Platica demo account through OAuth.");
