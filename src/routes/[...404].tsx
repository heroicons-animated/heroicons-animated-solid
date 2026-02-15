import { clientOnly } from "@solidjs/start";

const GoHomeButton = clientOnly(() => import("~/components/go-home-button"));

export default function NotFound() {
  return (
    <main class="view-container flex min-h-[calc(100vh-var(--header-height))] flex-col items-center justify-center border-neutral-200 px-4 py-16 xl:border-x dark:border-neutral-800">
      <div class="flex flex-col items-center gap-6">
        <h1 class="font-mono text-8xl">404</h1>
        <p class="text-center text-secondary">
          The page you're looking for might have been moved or doesn't exist.
        </p>
        <GoHomeButton />
      </div>
    </main>
  );
}
