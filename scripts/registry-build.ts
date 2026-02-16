import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const ICONS_DIR = path.join(ROOT_DIR, "packages/solid/src/icons");
const MOTION_COMPAT_FILE = path.join(
  ROOT_DIR,
  "packages/solid/src/lib/motion-compat.ts"
);
const PUBLIC_REGISTRY_DIR = path.join(ROOT_DIR, "public/r");
const ROOT_REGISTRY_FILE = path.join(ROOT_DIR, "registry.json");
const SCHEMA_URL = "https://shadcn-solid.com/schema.json";
const SITE_NAME = "heroicons-animated-solid";
const SITE_URL = "https://solid.heroicons-animated.com";
const REGISTRY_TYPE = "registry:ui";
const MOTION_COMPAT_NAME = "motion-compat";

interface RegistryFile {
  path: string;
  type: string;
  content?: string;
}

interface RegistryItem {
  name: string;
  title: string;
  description: string;
  type: string;
  registryDependencies: string[];
  dependencies: string[];
  files: RegistryFile[];
}

interface Registry {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

function toIconRegistryItem(name: string, content: string): RegistryItem {
  return {
    name,
    title: name,
    description: `Animated ${name} icon for SolidJS`,
    type: REGISTRY_TYPE,
    registryDependencies: [MOTION_COMPAT_NAME],
    dependencies: ["solid-motionone"],
    files: [
      {
        path: `${name}.tsx`,
        type: REGISTRY_TYPE,
        content,
      },
    ],
  };
}

function toMotionCompatItem(content: string): RegistryItem {
  return {
    name: MOTION_COMPAT_NAME,
    title: MOTION_COMPAT_NAME,
    description: "Shared motion compatibility helpers for SolidJS icons",
    type: REGISTRY_TYPE,
    registryDependencies: [],
    dependencies: [],
    files: [
      {
        path: "lib/motion-compat.ts",
        type: REGISTRY_TYPE,
        content,
      },
    ],
  };
}

function toRegistrySummaryItem(item: RegistryItem): RegistryItem {
  const [file] = item.files;
  return {
    ...item,
    files: [{ path: file.path, type: file.type }],
  };
}

async function readIconEntries(): Promise<RegistryItem[]> {
  const files = await readdir(ICONS_DIR);
  const iconFiles = files
    .filter((file) => file.endsWith(".tsx"))
    .sort((a, b) => a.localeCompare(b));

  const items: RegistryItem[] = [];
  for (const file of iconFiles) {
    const name = file.slice(0, -4);
    const content = await readFile(path.join(ICONS_DIR, file), "utf8");
    items.push(toIconRegistryItem(name, content));
  }

  return items;
}

async function cleanPublicRegistryDir(): Promise<void> {
  await mkdir(PUBLIC_REGISTRY_DIR, { recursive: true });
  const existing = await readdir(PUBLIC_REGISTRY_DIR);

  for (const file of existing) {
    if (file.endsWith(".json")) {
      await rm(path.join(PUBLIC_REGISTRY_DIR, file), { force: true });
    }
  }
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
  const formatted = JSON.stringify(value, null, 2).replace(
    /\[\n\s+"([^"\n]+)"\n\s+\]/g,
    '["$1"]'
  );
  await writeFile(filePath, `${formatted}\n`, "utf8");
}

async function main(): Promise<void> {
  const iconItems = await readIconEntries();
  const motionCompatContent = await readFile(MOTION_COMPAT_FILE, "utf8");
  const items = [...iconItems, toMotionCompatItem(motionCompatContent)].sort(
    (a, b) => a.name.localeCompare(b.name)
  );
  const rootRegistry: Registry = {
    $schema: SCHEMA_URL,
    name: SITE_NAME,
    homepage: SITE_URL,
    items: items.map(toRegistrySummaryItem),
  };

  await cleanPublicRegistryDir();
  await writeJson(ROOT_REGISTRY_FILE, rootRegistry);
  await writeJson(
    path.join(PUBLIC_REGISTRY_DIR, "registry.json"),
    rootRegistry
  );

  for (const item of items) {
    await writeJson(path.join(PUBLIC_REGISTRY_DIR, `${item.name}.json`), {
      $schema: SCHEMA_URL,
      ...item,
    });
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
