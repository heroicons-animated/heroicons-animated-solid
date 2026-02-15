import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, "..", "packages", "solid", "src", "icons");

const files = fs.readdirSync(iconsDir).filter((f) => f.endsWith(".tsx"));

let fixedCount = 0;

for (const file of files) {
  const filePath = path.join(iconsDir, file);
  let content = fs.readFileSync(filePath, "utf-8");
  const original = content;

  // Replace variants={EXPRESSION} with animate and transition
  // Match: variants={SOME_EXPRESSION}
  // where SOME_EXPRESSION could be:
  //   - CREATE_SOMETHING(args) (function call)
  //   - SOMETHING (plain identifier)
  content = content.replace(
    /(\s+)variants=\{([A-Z][A-Z_0-9]*(?:\([^)]*\))?)\}/g,
    (match, ws, expr) => {
      return `${ws}animate={resolveValues(${expr}, variant())}${ws}transition={resolveTransition(${expr}, variant())}`;
    }
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    fixedCount++;
    console.log(`Fixed: ${file}`);
  }
}

console.log(`\nDone. Fixed ${fixedCount} files.`);
