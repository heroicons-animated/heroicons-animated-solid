import { createEffect, createSignal, type JSX } from "solid-js";

const DEFAULT_LOADING_DELAY = 150;

type IconStatus = "idle" | "loading" | "done" | "error";

interface IconStateProps {
  children: JSX.Element;
  status?: IconStatus;
  loadingDelay?: number;
}

/** Inline SVG icons for status states */
const SpinnerIcon = () => (
  <svg
    aria-hidden="true"
    class="animate-spin"
    fill="none"
    height="16"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const CheckIcon = () => (
  <svg
    aria-hidden="true"
    class="text-green-600"
    fill="none"
    height="16"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

const XIcon = () => (
  <svg
    aria-hidden="true"
    class="text-red-500"
    fill="none"
    height="16"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const IconState = (props: IconStateProps) => {
  const [showLoading, setShowLoading] = createSignal(false);

  createEffect(() => {
    const status = props.status ?? "idle";
    if (status === "loading") {
      const timeout = setTimeout(
        () => setShowLoading(true),
        DEFAULT_LOADING_DELAY
      );
      return () => clearTimeout(timeout);
    }
    setShowLoading(false);
  });

  const renderIcon = () => {
    const status = props.status ?? "idle";
    if (status === "loading" && showLoading()) {
      return <SpinnerIcon />;
    }
    if (status === "done") {
      return <CheckIcon />;
    }
    if (status === "error") {
      return <XIcon />;
    }
    return props.children;
  };

  return (
    <span class="flex items-center justify-center [&>svg]:size-4 [&>svg]:shrink-0">
      {renderIcon()}
    </span>
  );
};

export { IconState };
export type { IconStatus, IconStateProps };
