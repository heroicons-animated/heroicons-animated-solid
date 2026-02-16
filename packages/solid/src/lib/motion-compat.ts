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

function toFiniteNumber(value: unknown): number | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return undefined;
  }
  return value;
}

// biome-ignore lint/suspicious/noExplicitAny: Motion One options vary by property at runtime.
type TransitionObj = Record<string, any>;
type TransitionKey = string;

function resolveSpringDuration(source: TransitionObj): number {
  const stiffness = toFiniteNumber(source.stiffness) ?? 100;
  const damping = toFiniteNumber(source.damping) ?? 12;
  const mass = toFiniteNumber(source.mass) ?? 0.4;
  const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));

  if (dampingRatio >= 1) {
    return 0.28;
  }
  if (dampingRatio >= 0.6) {
    return 0.34;
  }
  return 0.42;
}

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
        if (!("duration" in source)) {
          target.duration = resolveSpringDuration(source);
        }
        if (!("easing" in target)) {
          target.easing = "cubic-bezier(0.22,1,0.36,1)";
        }
      }
      return true;
    case "bounce":
      if (source.type !== "spring") {
        target.easing = "cubic-bezier(0.34,1.56,0.64,1)";
      }
      return true;
    default:
      return false;
  }
}

function isTransitionObject(value: unknown): value is TransitionObj {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mapPathDrawTransitionKey(
  key: string,
  value: unknown,
  target: TransitionObj
): boolean {
  if (key === "pathLength") {
    if (isTransitionObject(value)) {
      target.strokeDasharray = convertTransitionObj(value as TransitionObj);
    }
    return true;
  }
  if (key === "pathOffset") {
    if (isTransitionObject(value)) {
      target.strokeDashoffset = convertTransitionObj(value as TransitionObj);
    }
    return true;
  }
  if (key === "pathSpacing") {
    if (isTransitionObject(value) && !("strokeDasharray" in target)) {
      target.strokeDasharray = convertTransitionObj(value as TransitionObj);
    }
    return true;
  }
  return false;
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
    if (mapPathDrawTransitionKey(k, v, r)) {
      continue;
    }
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

const CSS_PATH_PREFIX = "path(";

function toCssPath(pathData: string): string {
  const normalized = pathData.trim();
  if (normalized.startsWith(CSS_PATH_PREFIX)) {
    return normalized;
  }
  return `path("${normalized.replace(/"/g, '\\"')}")`;
}

function resolvePathValue(value: unknown): unknown {
  if (typeof value === "string") {
    return toCssPath(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) =>
      typeof item === "string" ? toCssPath(item) : item
    );
  }
  return value;
}

function toKeyframes(value: unknown, fallback: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value.length > 0 ? value : [fallback];
  }
  if (value === undefined) {
    return [fallback];
  }
  return [value];
}

function normalizeKeyframes(values: unknown[], frameCount: number): unknown[] {
  if (values.length === frameCount) {
    return values;
  }
  if (values.length === 1) {
    return new Array(frameCount).fill(values[0]);
  }

  const normalized: unknown[] = [];
  for (let index = 0; index < frameCount; index += 1) {
    normalized.push(values[Math.min(index, values.length - 1)]);
  }
  return normalized;
}

function negatePathOffset(value: unknown): unknown {
  if (typeof value === "number") {
    return -value;
  }
  if (typeof value === "string") {
    const normalized = value.trim();
    if (normalized.length === 0) {
      return normalized;
    }
    if (normalized.startsWith("-")) {
      return normalized.slice(1);
    }
    return `-${normalized}`;
  }
  return value;
}

function applyPathDrawCompat(values: VariantValue): void {
  const hasPathDrawValues =
    "pathLength" in values || "pathOffset" in values || "pathSpacing" in values;
  if (!hasPathDrawValues) {
    return;
  }

  const pathLengthFrames = toKeyframes(values.pathLength, 1);
  const pathOffsetFrames = toKeyframes(values.pathOffset, 0);
  const pathSpacingFrames = toKeyframes(values.pathSpacing, 1);
  const frameCount = Math.max(
    pathLengthFrames.length,
    pathOffsetFrames.length,
    pathSpacingFrames.length
  );

  const normalizedPathLength = normalizeKeyframes(pathLengthFrames, frameCount);
  const normalizedPathOffset = normalizeKeyframes(pathOffsetFrames, frameCount);
  const normalizedPathSpacing = normalizeKeyframes(
    pathSpacingFrames,
    frameCount
  );

  const strokeDasharray = normalizedPathLength.map(
    (length, index) => `${length} ${normalizedPathSpacing[index]}`
  );
  const strokeDashoffset = normalizedPathOffset.map((offset) =>
    negatePathOffset(offset)
  );

  values.pathLength = 1;
  values.strokeDasharray =
    strokeDasharray.length === 1 ? strokeDasharray[0] : strokeDasharray;
  values.strokeDashoffset =
    strokeDashoffset.length === 1 ? strokeDashoffset[0] : strokeDashoffset;

  values.pathOffset = undefined;
  values.pathSpacing = undefined;
}

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
  const { transition: _t, originX, originY, ...values } = state;

  if (originX !== undefined || originY !== undefined) {
    const x = toTransformOriginPart(originX, "50%");
    const y = toTransformOriginPart(originY, "50%");
    values.transformOrigin = `${x} ${y}`;
    values.transformBox = "fill-box";
  }

  if ("d" in values) {
    values.d = resolvePathValue(values.d);
  }
  applyPathDrawCompat(values);

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
