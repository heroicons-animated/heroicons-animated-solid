import type { Component, JSX } from "solid-js";

export interface IconManifestItem {
  name: string;
  keywords: string[];
}

export interface AnimatedIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export interface AnimatedIconProps
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "ref"> {
  size?: number;
  ref?: (handle: AnimatedIconHandle) => void;
}

export interface IconListItem {
  name: string;
  icon: Component<AnimatedIconProps>;
  keywords: string[];
}
