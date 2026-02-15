import "@motionone/dom";
import "solid-js";

declare module "solid-js" {
  // biome-ignore lint/style/noNamespace: JSX module augmentation requires namespace syntax.
  namespace JSX {
    interface IntrinsicAttributes {
      key?: string | number;
    }

    interface CSSProperties {
      [key: string]: string | number | undefined;
    }

    interface SVGAttributes<T> {
      [key: string]: unknown;
    }
  }
}

declare module "@motionone/dom" {
  interface Options {
    custom?: number;
  }
}
