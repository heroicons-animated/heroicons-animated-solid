import { createEffect, createSignal, type JSX } from "solid-js";
import { CheckIcon, SpinnerIcon, XIcon } from "./icons";

const DEFAULT_LOADING_DELAY = 150;

type IconStatus = "idle" | "loading" | "done" | "error";

interface IconStateProps {
  children: JSX.Element;
  status?: IconStatus;
  loadingDelay?: number;
}

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
