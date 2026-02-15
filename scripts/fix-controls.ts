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

  // Remove leftover "animate={controls}" and "initial=\"normal\"" and "variants={...}" from Motion tags
  // Pattern: after resolveTransition(...)) there might be leftover " animate={controls} initial="normal" variants={VARIANTS_NAME}>"
  content = content.replace(
    /transition=\{resolveTransition\([^)]+\)\}\s*\)\}\s*animate=\{controls\}\s*initial="normal"\s*variants=\{[A-Z_]+\}>/g,
    (match) => {
      // Extract just the transition part
      const transMatch = match.match(
        /transition=\{resolveTransition\([^)]+\)\}\s*\)\}/
      );
      if (transMatch) {
        return transMatch[0] + ">";
      }
      return match;
    }
  );

  // Also handle cases where animate={controls} appears without being replaced at all
  // (i.e. no resolveValues was added)
  content = content.replace(
    /animate=\{controls\}\s*initial="normal"\s*variants=\{(\w+)\}/g,
    (match, varName) => {
      return `animate={resolveValues(${varName}, variant())}
                transition={resolveTransition(${varName}, variant())}`;
    }
  );

  // Clean up any remaining standalone animate={controls}
  content = content.replace(/\s*animate=\{controls\}/g, "");

  // Clean up remaining initial="normal"
  content = content.replace(/\s*initial="normal"/g, "");

  // Clean up remaining variants={SOMETHING} on Motion tags (but not variant definitions)
  content = content.replace(
    /(\s*)variants=\{([A-Z][A-Z_0-9]+)\}/g,
    (match, ws, varName) => {
      // Only remove if it's in a JSX tag context (after other props)
      return "";
    }
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    fixedCount++;
    console.log(`Fixed: ${file}`);
  }
}

console.log(`\nDone. Fixed ${fixedCount} files.`);
