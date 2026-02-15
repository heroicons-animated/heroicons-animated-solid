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

// biome-ignore lint/suspicious/noExplicitAny: Motion One options vary by property at runtime.
type TransitionObj = Record<string, any>;
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
    "d",
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

// biome-ignore lint/suspicious/noExplicitAny: Variant payload is dynamic and icon-specific.
type VariantValue = Record<string, any>;
// biome-ignore lint/suspicious/noExplicitAny: Custom payload can be number or object depending on icon variant usage.
type VariantDef = VariantValue | ((custom: any) => VariantValue);
type Variants = Record<string, VariantDef>;

function toTransformOriginPart(value: unknown, fallback: string): string {
  if (typeof value === "number") {
    return `${value * 100}%`;
  }
  if (typeof value === "string" && value.length > 0) {
    return value;
  }
  return fallback;
}

/**
 * Resolve the animation values from a variant definition.
 * Returns only the CSS/transform properties (no transition).
 */
export function resolveValues(
  variants: Variants,
  variantName: string,
  // biome-ignore lint/suspicious/noExplicitAny: Custom payload shape varies per icon.
  custom: any = 0
  // biome-ignore lint/suspicious/noExplicitAny: Returned object is forwarded to Motion animate prop.
): any {
  const def = variants[variantName];
  if (!def) {
    return {};
  }
  const state = typeof def === "function" ? def(custom) : def;
  const { transition: _t, originX, originY, d: _d, ...values } = state;

  if (originX !== undefined || originY !== undefined) {
    const x = toTransformOriginPart(originX, "50%");
    const y = toTransformOriginPart(originY, "50%");
    values.transformOrigin = `${x} ${y}`;
  }

  return values;
}

/**
 * Resolve the transition options from a variant definition.
 * Converts Framer Motion transition format to solid-motionone format.
 */
export function resolveTransition(
  variants: Variants,
  variantName: string,
  // biome-ignore lint/suspicious/noExplicitAny: Custom payload shape varies per icon.
  custom: any = 0,
  extraTransition?: TransitionObj
  // biome-ignore lint/suspicious/noExplicitAny: Returned object is forwarded to Motion transition prop.
): any {
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
