import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "~/lib/utils";

interface SponsorHeartFilledProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
  size?: number;
  animate?: boolean;
}

const SponsorHeartFilled = (props: SponsorHeartFilledProps) => {
  const [local, others] = splitProps(props, ["class", "size", "animate"]);

  return (
    <svg
      aria-label="heart-filled"
      {...others}
      class={cn(
        "inline-block transform-gpu",
        local.animate &&
          "motion-safe:animate-[sponsor-heart-pulse_0.45s_ease-in-out_3]",
        local.class
      )}
      fill="currentColor"
      height={local.size ?? 16}
      preserveAspectRatio="xMidYMid"
      style={{
        "transform-box": "fill-box",
        "transform-origin": "center",
      }}
      viewBox="0 0 24 24"
      width={local.size ?? 16}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Sponsor heart</title>
      <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
    </svg>
  );
};

export { SponsorHeartFilled };
