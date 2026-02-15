/**
 * Converts React icon components from heroicons-animated (using motion/react)
 * to SolidJS icon components (using solid-motionone + compat layer).
 *
 * Usage: node --import tsx scripts/convert-icons.ts
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const REACT_ICONS_DIR = path.resolve(
  __dirname,
  "../../heroicons-animated/packages/react/src/icons"
);
const SOLID_ICONS_DIR = path.resolve(
  __dirname,
  "../packages/solid/src/icons"
);

fs.mkdirSync(SOLID_ICONS_DIR, { recursive: true });

const iconFiles = fs
  .readdirSync(REACT_ICONS_DIR)
  .filter((f) => f.endsWith(".tsx") && f !== "index.ts" && f !== "types.ts");

console.log(`Converting ${iconFiles.length} icon files...`);

let success = 0;
let errors = 0;

for (const file of iconFiles) {
  try {
    const content = fs.readFileSync(path.join(REACT_ICONS_DIR, file), "utf-8");
    const converted = convertIcon(content, file);
    fs.writeFileSync(path.join(SOLID_ICONS_DIR, file), converted);
    success++;
  } catch (e: any) {
    console.error(`Error converting ${file}: ${e.message}`);
    errors++;
  }
}

console.log(`Done! ${success} converted, ${errors} errors.`);

// ---------------------------------------------------------------------------
// Main conversion function
// ---------------------------------------------------------------------------

function convertIcon(content: string, filename: string): string {
  const baseName = filename.replace(".tsx", "");
  const componentName = kebabToPascal(baseName) + "Icon";
  const handleName = componentName + "Handle";
  const propsName = componentName + "Props";

  // --- Extract parts from the React file ---

  // 1. Extract variant definitions (everything between imports and forwardRef)
  const variantDefs = extractVariantDefinitions(content);

  // 2. Detect controls
  const controlInfos = detectControls(content);
  const hasMultipleControls = controlInfos.length > 1;

  // 3. Extract the SVG body from the return statement
  const svgBody = extractSvgBody(content);

  // 4. Extract start/stop variant names from useImperativeHandle
  const startStopInfo = extractStartStopInfo(content, controlInfos);

  // 5. Extract mouse handler variant names
  const mouseEnterInfo = extractMouseHandlerInfo(content, "handleMouseEnter", controlInfos);
  const mouseLeaveInfo = extractMouseHandlerInfo(content, "handleMouseLeave", controlInfos);

  // --- Transform SVG body ---
  let transformedSvg = transformSvgBody(svgBody, controlInfos, hasMultipleControls);

  // --- Build signals declaration ---
  let signalsDecl: string;
  if (hasMultipleControls) {
    signalsDecl = controlInfos
      .map((ci) => {
        const sig = controlToSignalName(ci.name);
        const setter = controlToSetterName(ci.name);
        return `  const [${sig}, ${setter}] = createSignal("normal");`;
      })
      .join("\n");
  } else {
    signalsDecl = '  const [variant, setVariant] = createSignal("normal");';
  }

  // --- Build ref callback ---
  let refCallback: string;
  if (hasMultipleControls) {
    const startLines = startStopInfo.start
      .map((s) => `        ${controlToSetterName(s.control)}("${s.variant}");`)
      .join("\n");
    const stopLines = startStopInfo.stop
      .map((s) => `        ${controlToSetterName(s.control)}("${s.variant}");`)
      .join("\n");
    refCallback = `  if (local.ref) {
    isControlled = true;
    local.ref({
      startAnimation: () => {
${startLines}
      },
      stopAnimation: () => {
${stopLines}
      },
    });
  }`;
  } else {
    const startVar = startStopInfo.start[0]?.variant || "animate";
    const stopVar = startStopInfo.stop[0]?.variant || "normal";
    refCallback = `  if (local.ref) {
    isControlled = true;
    local.ref({
      startAnimation: () => setVariant("${startVar}"),
      stopAnimation: () => setVariant("${stopVar}"),
    });
  }`;
  }

  // --- Build mouse handlers ---
  let enterActions: string;
  let leaveActions: string;
  if (hasMultipleControls) {
    enterActions = mouseEnterInfo
      .map((s) => `      ${controlToSetterName(s.control)}("${s.variant}");`)
      .join("\n");
    leaveActions = mouseLeaveInfo
      .map((s) => `      ${controlToSetterName(s.control)}("${s.variant}");`)
      .join("\n");
  } else {
    const enterVar = mouseEnterInfo[0]?.variant || "animate";
    const leaveVar = mouseLeaveInfo[0]?.variant || "normal";
    enterActions = `      setVariant("${enterVar}");`;
    leaveActions = `      setVariant("${leaveVar}");`;
  }

  // --- Assemble the output file ---
  const output = `import { Motion } from "solid-motionone";
import type { JSX } from "solid-js";
import { createSignal, mergeProps, splitProps } from "solid-js";
import { resolveValues, resolveTransition } from "@/lib/motion-compat";
import { cn } from "@/lib/utils";

export interface ${handleName} {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface ${propsName} extends JSX.HTMLAttributes<HTMLDivElement> {
  size?: number;
  ref?: (handle: ${handleName}) => void;
}

${variantDefs}
const ${componentName} = (rawProps: ${propsName}) => {
  const props = mergeProps({ size: 28 }, rawProps);
  const [local, others] = splitProps(props, [
    "onMouseEnter", "onMouseLeave", "class", "size", "ref",
  ]);
${signalsDecl}
  let isControlled = false;

${refCallback}

  const handleMouseEnter: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
    if (isControlled) {
      if (typeof local.onMouseEnter === "function") local.onMouseEnter(e);
    } else {
${enterActions}
    }
  };

  const handleMouseLeave: JSX.EventHandler<HTMLDivElement, MouseEvent> = (e) => {
    if (isControlled) {
      if (typeof local.onMouseLeave === "function") local.onMouseLeave(e);
    } else {
${leaveActions}
    }
  };

  return (
    <div
      class={cn(local.class)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...others}
    >
${transformedSvg}
    </div>
  );
};

export { ${componentName} };
`;

  return output;
}

// ---------------------------------------------------------------------------
// Extraction functions
// ---------------------------------------------------------------------------

function kebabToPascal(str: string): string {
  return str
    .split("-")
    .map((part) => {
      if (part === "3d") return "3D";
      if (part === "2x2") return "2X2";
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("");
}

interface ControlInfo {
  name: string; // e.g. "controls", "cursorControls"
}

function detectControls(content: string): ControlInfo[] {
  const matches = [...content.matchAll(/const (\w+) = useAnimation\(\)/g)];
  if (matches.length === 0) return [{ name: "controls" }];
  return matches.map((m) => ({ name: m[1] }));
}

function controlToSignalName(controlName: string): string {
  if (controlName === "controls") return "variant";
  return controlName.replace(/Controls$/, "Variant");
}

function controlToSetterName(controlName: string): string {
  const sig = controlToSignalName(controlName);
  return "set" + sig.charAt(0).toUpperCase() + sig.slice(1);
}

function extractVariantDefinitions(content: string): string {
  // Find all const blocks between imports and the forwardRef/component definition
  // Variants are typically: const XXX_VARIANTS = { ... }; or const XXX = { ... };
  // Also handle transition constants: const XXX_TRANSITION = { ... };
  const lines = content.split("\n");
  const variantLines: string[] = [];
  let inVariantSection = false;
  let braceDepth = 0;

  for (const line of lines) {
    // Start of variant section: after last import, before forwardRef
    if (line.startsWith("const ") && !line.includes("useAnimation") && !line.includes("forwardRef")) {
      // Check if this looks like a variant/transition constant
      if (line.includes("= {") || line.includes(": Variants") || line.includes("Variants =")) {
        inVariantSection = true;
      }
    }

    if (inVariantSection) {
      // Remove `: Variants` type annotation
      let processedLine = line.replace(/:\s*Variants\b/, "");
      variantLines.push(processedLine);

      // Track brace depth
      for (const ch of line) {
        if (ch === "{") braceDepth++;
        if (ch === "}") braceDepth--;
      }

      if (braceDepth === 0 && line.includes("}")) {
        inVariantSection = false;
        // Add blank line after variant block
        variantLines.push("");
      }
    }
  }

  return variantLines.join("\n").trim();
}

function extractSvgBody(content: string): string {
  // Find the <svg ... > ... </svg> block in the return statement
  const svgStart = content.indexOf("<svg");
  if (svgStart === -1) {
    // Some icons wrap the svg in a motion.svg
    const motionSvgStart = content.indexOf("<motion.svg");
    if (motionSvgStart === -1) return "";
    return extractTagBlock(content, motionSvgStart, "motion.svg");
  }
  return extractTagBlock(content, svgStart, "svg");
}

function extractTagBlock(content: string, startIdx: number, tagName: string): string {
  const closeTag = `</${tagName}>`;
  const endIdx = content.indexOf(closeTag, startIdx);
  if (endIdx === -1) return "";
  return content.substring(startIdx, endIdx + closeTag.length);
}

interface VariantAction {
  control: string;
  variant: string;
}

function extractStartStopInfo(
  content: string,
  controlInfos: ControlInfo[]
): { start: VariantAction[]; stop: VariantAction[] } {
  const startActions: VariantAction[] = [];
  const stopActions: VariantAction[] = [];

  // Find the useImperativeHandle CALL (not the import)
  const impStart = content.indexOf("useImperativeHandle(ref");
  if (impStart === -1) return { start: startActions, stop: stopActions };

  // Get a large chunk: from useImperativeHandle to the end of the block
  // The block ends with `});` - find it by matching braces
  let depth = 0;
  let impEnd = impStart;
  let foundFirstParen = false;
  for (let i = impStart; i < content.length; i++) {
    if (content[i] === "(") { depth++; foundFirstParen = true; }
    if (content[i] === ")") { depth--; }
    if (foundFirstParen && depth === 0) { impEnd = i + 1; break; }
  }

  const impBlock = content.substring(impStart, impEnd);

  // Find startAnimation and stopAnimation positions within the block
  const startAnimIdx = impBlock.indexOf("startAnimation");
  const stopAnimIdx = impBlock.indexOf("stopAnimation");

  if (startAnimIdx < 0) {
    // Fallback
    for (const ci of controlInfos) {
      startActions.push({ control: ci.name, variant: "animate" });
      stopActions.push({ control: ci.name, variant: "normal" });
    }
    return { start: startActions, stop: stopActions };
  }

  // Section between "startAnimation" and "stopAnimation"
  const startSection = impBlock.substring(
    startAnimIdx,
    stopAnimIdx >= 0 ? stopAnimIdx : impBlock.length
  );
  // Section from "stopAnimation" to end
  const stopSection = stopAnimIdx >= 0 ? impBlock.substring(stopAnimIdx) : "";

  // Find .start("xxx") calls for each control (handles extra args like .start("xxx", {...}))
  for (const ci of controlInfos) {
    const re = new RegExp(`${ci.name}\\.start\\("(\\w+)"`);
    const sm = startSection.match(re);
    if (sm) startActions.push({ control: ci.name, variant: sm[1] });
    const tm = stopSection.match(re);
    if (tm) stopActions.push({ control: ci.name, variant: tm[1] });
  }

  // Fallback defaults
  if (startActions.length === 0) {
    for (const ci of controlInfos) {
      startActions.push({ control: ci.name, variant: "animate" });
    }
  }
  if (stopActions.length === 0) {
    for (const ci of controlInfos) {
      stopActions.push({ control: ci.name, variant: "normal" });
    }
  }

  return { start: startActions, stop: stopActions };
}

function extractMouseHandlerInfo(
  content: string,
  handlerName: string,
  controlInfos: ControlInfo[]
): VariantAction[] {
  const actions: VariantAction[] = [];

  // Find the handler block
  const handlerIdx = content.indexOf(`const ${handlerName} = useCallback`);
  if (handlerIdx === -1) return actions;

  // Get a reasonable chunk of text
  const chunk = content.substring(handlerIdx, handlerIdx + 500);

  // Find the else branch (non-controlled actions)
  const elseIdx = chunk.indexOf("} else {");
  if (elseIdx === -1) return actions;

  // Get text after "else {" until the next closing bracket pattern
  const afterElse = chunk.substring(elseIdx + 8);
  // Find the closing "}" - take everything up to it
  const closingIdx = afterElse.indexOf("}");
  const elseBody = afterElse.substring(0, closingIdx > 0 ? closingIdx : 200);

  for (const ci of controlInfos) {
    const re = new RegExp(`${ci.name}\\.start\\("(\\w+)"`);
    const m = elseBody.match(re);
    if (m) actions.push({ control: ci.name, variant: m[1] });
  }

  return actions;
}

function extractBracedBlock(content: string, fromIdx: number): string | null {
  let depth = 0;
  let start = -1;

  for (let i = fromIdx; i < content.length; i++) {
    if (content[i] === "{" || content[i] === "(") {
      if (start === -1 && content[i] === "(") start = i;
      if (content[i] === "{") {
        if (start === -1) start = i;
        depth++;
      }
    }
    if (content[i] === "}" || content[i] === ")") {
      if (content[i] === "}") depth--;
      if (depth <= 0 && start !== -1) {
        return content.substring(fromIdx, i + 1);
      }
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// SVG body transformation
// ---------------------------------------------------------------------------

function transformSvgBody(
  svgBody: string,
  controlInfos: ControlInfo[],
  hasMultipleControls: boolean
): string {
  let result = svgBody;

  // Replace motion.xxx with Motion.xxx
  result = result.replace(/<motion\./g, "<Motion.");
  result = result.replace(/<\/motion\./g, "</Motion.");

  // Fix SVG attributes
  result = result.replace(/strokeLinecap="/g, 'stroke-linecap="');
  result = result.replace(/strokeLinejoin="/g, 'stroke-linejoin="');
  result = result.replace(/strokeWidth="/g, 'stroke-width="');
  result = result.replace(/strokeWidth=\{/g, "stroke-width={");
  result = result.replace(/fillRule="/g, 'fill-rule="');
  result = result.replace(/clipRule="/g, 'clip-rule="');
  result = result.replace(/strokeDasharray="/g, 'stroke-dasharray="');
  result = result.replace(/strokeDashoffset="/g, 'stroke-dashoffset="');
  result = result.replace(/clipPath="/g, 'clip-path="');

  // Fix size references
  result = result.replace(/\bheight=\{size\}/g, "height={local.size}");
  result = result.replace(/\bwidth=\{size\}/g, "width={local.size}");

  // Fix style props
  result = result.replace(/transformOrigin:/g, '"transform-origin":');
  result = result.replace(/\boriginX:/g, '"origin-x":');
  result = result.replace(/\boriginY:/g, '"origin-y":');

  // Process each Motion element to replace animate/variants/initial/custom/transition props
  result = processMotionElements(result, controlInfos, hasMultipleControls);

  // Normalize indentation: strip original indentation and re-indent with 6 spaces
  const lines = result.split("\n");
  // Find the minimum indentation (excluding empty lines)
  let minIndent = Infinity;
  for (const l of lines) {
    if (l.trim().length === 0) continue;
    const indent = l.match(/^(\s*)/)?.[1].length ?? 0;
    if (indent < minIndent) minIndent = indent;
  }
  if (!isFinite(minIndent)) minIndent = 0;
  // Strip min indent and add 6 spaces
  const indented = lines
    .map((l) => {
      if (l.trim().length === 0) return "";
      return "      " + l.substring(minIndent);
    })
    .join("\n");
  return indented;
}

function processMotionElements(
  svgBody: string,
  controlInfos: ControlInfo[],
  hasMultipleControls: boolean
): string {
  // Process each <Motion.xxx opening tag
  const lines = svgBody.split("\n");
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    if (trimmed.startsWith("<Motion.")) {
      // Collect the full opening tag (may span multiple lines)
      const tagLines: string[] = [lines[i]];
      let hasClose = trimmed.endsWith(">") || trimmed.endsWith("/>");

      if (!hasClose) {
        while (i + 1 < lines.length) {
          i++;
          tagLines.push(lines[i]);
          const t = lines[i].trim();
          if (t.endsWith(">") || t.endsWith("/>")) {
            hasClose = true;
            break;
          }
        }
      }

      const tagBlock = tagLines.join("\n");
      const processed = processMotionOpenTag(tagBlock, controlInfos, hasMultipleControls);
      result.push(processed);
    } else {
      result.push(lines[i]);
    }
    i++;
  }

  return result.join("\n");
}

function processMotionOpenTag(
  tagBlock: string,
  controlInfos: ControlInfo[],
  hasMultipleControls: boolean
): string {
  let tag = tagBlock;

  // Detect which control this element uses
  let usedControl: string | null = null;
  for (const ci of controlInfos) {
    if (tag.includes(`animate={${ci.name}}`)) {
      usedControl = ci.name;
      break;
    }
  }

  // Detect variants prop
  let variantName: string | null = null;
  const variantMatch = tag.match(/variants=\{(\w+)\}/);
  if (variantMatch) {
    variantName = variantMatch[1];
  }

  // Detect inline variants
  const hasInlineVariants = /variants=\{\{/.test(tag);

  // Detect custom value
  let customValue: string | null = null;
  const customMatch = tag.match(/custom=\{(\d+)\}/);
  if (customMatch) {
    customValue = customMatch[1];
  }

  // Detect direct transition prop (named constant)
  let directTransitionConst: string | null = null;
  const transConstMatch = tag.match(/transition=\{([A-Z_]\w+)\}/);
  if (transConstMatch) {
    directTransitionConst = transConstMatch[1];
  }

  // Detect direct inline transition={{ ... }}
  let hasInlineTransition = false;
  const inlineTransMatch = tag.match(/\n(\s*)transition=\{\{([\s\S]*?)\}\}/);
  if (inlineTransMatch) {
    hasInlineTransition = true;
  }

  // Remove old props
  if (usedControl) {
    tag = tag.replace(new RegExp(`\\n\\s*animate=\\{${usedControl}\\}`), "");
  }
  if (variantName) {
    tag = tag.replace(new RegExp(`\\n\\s*variants=\\{${variantName}\\}`), "");
  }
  tag = tag.replace(/\n\s*initial="normal"/g, "");
  if (customValue !== null) {
    tag = tag.replace(new RegExp(`\\n\\s*custom=\\{${customValue}\\}`), "");
  }

  // Handle inline variants: extract and create reference
  if (hasInlineVariants) {
    // Extract the inline variant text
    const inlineVarRegex = /\n(\s*)variants=\{\{([\s\S]*?)\}\}/;
    const ivm = tag.match(inlineVarRegex);
    if (ivm) {
      // Remove the inline variants prop
      tag = tag.replace(inlineVarRegex, "");
      // We'll add the inline object directly as animate/transition
      // Parse the inline variant to get normal/animate states
      // For simplicity, use __INLINE__ marker and handle below
      variantName = "__INLINE__:" + ivm[2].trim();
    }
  }

  // Remove inline transition (we'll add converted version)
  let inlineTransitionText = "";
  if (hasInlineTransition && inlineTransMatch) {
    inlineTransitionText = inlineTransMatch[2].trim();
    tag = tag.replace(/\n\s*transition=\{\{[\s\S]*?\}\}/, "");
  }
  if (directTransitionConst) {
    tag = tag.replace(new RegExp(`\\n\\s*transition=\\{${directTransitionConst}\\}`), "");
  }

  // Build the signal name for this element
  const signalName = hasMultipleControls && usedControl
    ? controlToSignalName(usedControl)
    : "variant";

  // Add new animate/transition props
  const indent = getIndent(tag);

  if (variantName && !variantName.startsWith("__INLINE__")) {
    const customArg = customValue !== null ? `, ${customValue}` : "";
    let transExtra = "";
    if (directTransitionConst) {
      transExtra = `, undefined, ${directTransitionConst}`;
    } else if (inlineTransitionText) {
      transExtra = `, undefined, {${inlineTransitionText}}`;
    }

    // Insert after the <Motion.xxx tag name
    tag = tag.replace(
      /(<Motion\.\w+)/,
      `$1\n${indent}  animate={resolveValues(${variantName}, ${signalName}()${customArg})}\n${indent}  transition={resolveTransition(${variantName}, ${signalName}()${customArg}${transExtra})}`
    );
  } else if (variantName?.startsWith("__INLINE__:")) {
    // Inline variant - create an object literal
    const varBody = variantName.slice("__INLINE__:".length);
    const inlineObjName = `{${varBody}}`;
    let transExtra = "";
    if (inlineTransitionText) {
      transExtra = `, undefined, {${inlineTransitionText}}`;
    }
    tag = tag.replace(
      /(<Motion\.\w+)/,
      `$1\n${indent}  animate={resolveValues(${inlineObjName}, ${signalName}())}\n${indent}  transition={resolveTransition(${inlineObjName}, ${signalName}()${transExtra})}`
    );
  }

  return tag;
}

function getIndent(tagBlock: string): string {
  // Get the indentation of the <Motion line
  const match = tagBlock.match(/^(\s*)</);
  return match ? match[1] : "          ";
}
