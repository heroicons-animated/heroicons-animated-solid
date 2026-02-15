/**
 * Compatibility layer for converting Framer Motion variant format
 * to solid-motionone animate/transition props at runtime.
 */

const EASE_MAP: Record<string, string> = {
  easeInOut: "ease-in-out",
  easeIn: "ease-in",
  easeOut: "ease-out",
  linear: "linear",
};

function convertEase(ease: string | number[]): string {
  if (Array.isArray(ease)) return `cubic-bezier(${ease.join(",")})`;
  return EASE_MAP[ease] ?? ease;
}

function convertTransitionObj(t: Record<string, any>): Record<string, any> {
  const r: Record<string, any> = {};
  const skip = new Set([
    "stiffness",
    "damping",
    "mass",
    "type",
    "bounce",
    "ease",
    "times",
    "repeatType",
    "repeatDelay",
  ]);

  for (const [k, v] of Object.entries(t)) {
    if (k === "ease") {
      r.easing = convertEase(v);
    } else if (k === "times") {
      r.offset = v;
    } else if (k === "repeatType" && v === "reverse") {
      r.direction = "alternate";
    } else if (k === "repeatDelay") {
      r.endDelay = v;
    } else if (k === "type" && v === "spring") {
      // Motion One's Web Animations easing expects CSS easing values.
      // Framer spring params are approximated to a smooth ease-out fallback.
      if (!("duration" in t)) {
        r.duration = 0.35;
      }
      if (!("easing" in r)) {
        r.easing = "cubic-bezier(0.22,1,0.36,1)";
      }
    } else if (k === "bounce") {
      r.easing = "cubic-bezier(0.34,1.56,0.64,1)";
    } else if (skip.has(k)) {
      // already handled by spring or skip
    } else if (
      typeof v === "object" &&
      v !== null &&
      !Array.isArray(v)
    ) {
      // Per-property transition (e.g. { opacity: { duration: 0.2 } })
      r[k] = convertTransitionObj(v);
    } else {
      r[k] = v;
    }
  }
  return r;
}

type VariantDef =
  | Record<string, any>
  | ((custom: number) => Record<string, any>);

type Variants = Record<string, VariantDef>;

/**
 * Resolve the animation values from a variant definition.
 * Returns only the CSS/transform properties (no transition).
 */
export function resolveValues(
  variants: Variants,
  variantName: string,
  custom: number = 0
): Record<string, any> {
  const def = variants[variantName];
  if (!def) return {};
  const state = typeof def === "function" ? def(custom) : def;
  const { transition: _t, ...values } = state;
  return values;
}

/**
 * Resolve the transition options from a variant definition.
 * Converts Framer Motion transition format to solid-motionone format.
 */
export function resolveTransition(
  variants: Variants,
  variantName: string,
  custom: number = 0,
  extraTransition?: Record<string, any>
): Record<string, any> {
  const def = variants[variantName];
  if (!def && !extraTransition) return {};
  const state = def
    ? typeof def === "function"
      ? def(custom)
      : def
    : {};
  const t = state.transition ?? {};
  const merged = extraTransition ? { ...t, ...extraTransition } : t;
  if (Object.keys(merged).length === 0) return {};
  return convertTransitionObj(merged);
}
