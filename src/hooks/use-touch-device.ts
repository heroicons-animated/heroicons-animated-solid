import { createSignal, onMount } from "solid-js";
import { isServer } from "solid-js/web";

const useTouchDevice = (): (() => boolean) => {
  const [isTouchDevice, setIsTouchDevice] = createSignal(false);

  onMount(() => {
    if (isServer) return;

    const hasTouchScreen =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-expect-error - legacy property
      navigator.msMaxTouchPoints > 0;

    setIsTouchDevice(hasTouchScreen);
  });

  return isTouchDevice;
};

export { useTouchDevice };
