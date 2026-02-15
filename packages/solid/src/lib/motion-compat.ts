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
  if (Array.isArray(ease)) {
    return `cubic-bezier(${ease.join(",")})`;
  }
  return EASE_MAP[ease] ?? ease;
}

type TransitionObj = Record<string, unknown>;
type TransitionKey = string;

function applySpecialTransitionKey(
  key: TransitionKey,
  value: unknown,
  source: TransitionObj,
  target: TransitionObj
): boolean {
  switch (key) {
    case "ease":
      target.easing = convertEase(value as string | number[]);
      return true;
    case "times":
      target.offset = value;
      return true;
    case "repeatType":
      if (value === "reverse") {
        target.direction = "alternate";
      }
      return true;
    case "repeatDelay":
      target.endDelay = value;
      return true;
    case "type":
      if (value === "spring") {
        // Motion One's Web Animations easing expects CSS easing values.
        // Framer spring params are approximated to a smooth ease-out fallback.
        if (!("duration" in source)) {
          target.duration = 0.35;
        }
        if (!("easing" in target)) {
          target.easing = "cubic-bezier(0.22,1,0.36,1)";
        }
      }
      return true;
    case "bounce":
      target.easing = "cubic-bezier(0.34,1.56,0.64,1)";
      return true;
    default:
      return false;
  }
}

function isTransitionObject(value: unknown): value is TransitionObj {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function convertTransitionObj(t: TransitionObj): TransitionObj {
  const r: TransitionObj = {};
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
    if (applySpecialTransitionKey(k, v, t, r) || skip.has(k)) {
      continue;
    }
    if (isTransitionObject(v)) {
      // Per-property transition (e.g. { opacity: { duration: 0.2 } })
      r[k] = convertTransitionObj(v as TransitionObj);
      continue;
    }
    r[k] = v;
  }
  return r;
}

type VariantValue = Record<string, unknown>;
type VariantDef = VariantValue | ((custom: number) => VariantValue);
type Variants = Record<string, VariantDef>;

/**
 * Resolve the animation values from a variant definition.
 * Returns only the CSS/transform properties (no transition).
 */
export function resolveValues(
  variants: Variants,
  variantName: string,
  custom = 0
): VariantValue {
  const def = variants[variantName];
  if (!def) {
    return {};
  }
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
  custom = 0,
  extraTransition?: TransitionObj
): TransitionObj {
  const def = variants[variantName];
  if (!(def || extraTransition)) {
    return {};
  }
  let state: VariantValue;
  if (!def) {
    state = {};
  } else if (typeof def === "function") {
    state = def(custom);
  } else {
    state = def;
  }
  const t = state.transition ?? {};
  const merged = extraTransition ? { ...t, ...extraTransition } : t;
  if (Object.keys(merged).length === 0) {
    return {};
  }
  return convertTransitionObj(merged);
}
