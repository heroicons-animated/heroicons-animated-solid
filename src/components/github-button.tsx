import { createSignal, onMount } from "solid-js";
import { LINK } from "~/constants";

const GITHUB_API = "https://api.github.com/repos/Aniket-508/heroicons-animated";

const GithubStarsButton = () => {
  const [displayStars, setDisplayStars] = createSignal<number>(0);
  const [starsLoaded, setStarsLoaded] = createSignal(false);

  onMount(async () => {
    try {
      const response = await fetch(GITHUB_API, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "heroicons-animated",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const count = data.stargazers_count ?? 0;
        // Simple animate-up
        let current = 0;
        const duration = 1500;
        const interval = 20;
        const steps = duration / interval;
        const increment = count / steps;
        const timer = setInterval(() => {
          current += increment;
          if (current >= count) {
            setDisplayStars(count);
            setStarsLoaded(true);
            clearInterval(timer);
          } else {
            setDisplayStars(Math.floor(current));
          }
        }, interval);
      }
    } catch {
      setStarsLoaded(true);
    }
  });

  return (
    <a
      aria-label={`Star on GitHub${starsLoaded() ? ` (${displayStars().toLocaleString()} stars)` : ""}`}
      class="group/github-stars supports-[corner-shape:squircle]:corner-squircle flex size-9 items-center justify-center gap-2 rounded-[14px] bg-white focus-within:outline-offset-2 focus-visible:outline-1 focus-visible:outline-primary supports-[corner-shape:squircle]:rounded-[20px] sm:size-auto sm:px-2.5 sm:py-2 dark:bg-white/10"
      href={LINK.GITHUB}
      rel="noopener noreferrer"
      tabIndex={0}
      target="_blank"
    >
      {/* GitHub logo */}
      <svg
        aria-hidden="true"
        class="size-4"
        fill="currentColor"
        viewBox="0 0 15 15"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          d="M7.49933 0.25C3.49635 0.25 0.25 3.49593 0.25 7.50024C0.25 10.703 2.32715 13.4206 5.2081 14.3797C5.57084 14.446 5.70302 14.2222 5.70302 14.0299C5.70302 13.8576 5.69679 13.4019 5.69323 12.797C3.67661 13.235 3.2535 11.825 3.2535 11.825C2.92712 10.9874 2.44977 10.7644 2.44977 10.7644C1.78283 10.3149 2.49881 10.3238 2.49881 10.3238C3.24167 10.375 3.62983 11.0849 3.62983 11.0849C4.28734 12.2153 5.31354 11.8996 5.71447 11.7138C5.78073 11.2366 5.96433 10.9096 6.16613 10.7083C4.56637 10.505 2.88105 9.88104 2.88105 7.11424C2.88105 6.3219 3.15702 5.67182 3.64318 5.16195C3.56663 4.95894 3.31772 4.2238 3.71559 3.23348C3.71559 3.23348 4.33753 3.01718 5.67916 3.94937C6.27227 3.77171 6.89053 3.68226 7.50244 3.67949C8.11096 3.68226 8.72922 3.77171 9.32572 3.94937C10.6624 3.01718 11.2845 3.23348 11.2845 3.23348C11.6831 4.2238 11.4341 4.95894 11.3577 5.16195C11.8469 5.67182 12.1183 6.3219 12.1183 7.11424C12.1183 9.88808 10.4309 10.5027 8.82684 10.7017C9.07938 10.9358 9.30479 11.3977 9.30479 12.1065C9.30479 13.127 9.29529 13.9407 9.29529 14.0299C9.29529 14.2239 9.42358 14.4496 9.79331 14.3788C12.6745 13.4179 14.75 10.7025 14.75 7.50024C14.75 3.49593 11.5036 0.25 7.49933 0.25Z"
          fill-rule="evenodd"
        />
      </svg>
      <span
        aria-hidden="true"
        class="hidden min-w-4 text-center font-sans text-black text-sm tabular-nums tracking-[-0.4px] sm:inline dark:text-white"
      >
        {displayStars()}
      </span>
      {/* Star icon */}
      <svg
        aria-hidden="true"
        class="hidden text-neutral-400 transition-colors duration-100 group-hover/github-stars:text-[#e3b341] sm:block"
        fill="none"
        height={13}
        viewBox="0 0 13 13"
        width={13}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clip-rule="evenodd"
          d="M6.45803 2.89654e-06C6.6061 0.000101587 6.75082 0.0440267 6.87397 0.126243C6.99712 0.208458 7.09317 0.325286 7.15003 0.462003L8.56003 3.855L12.224 4.148C12.3717 4.15988 12.5125 4.2152 12.6287 4.30699C12.7449 4.39878 12.8314 4.52293 12.8772 4.66379C12.923 4.80464 12.926 4.9559 12.8859 5.09849C12.8459 5.24108 12.7645 5.36861 12.652 5.465L9.86103 7.855L10.714 11.43C10.7483 11.574 10.7392 11.725 10.6878 11.8638C10.6364 12.0027 10.5451 12.1233 10.4253 12.2103C10.3056 12.2973 10.1627 12.347 10.0148 12.353C9.86685 12.359 9.72045 12.3211 9.59403 12.244L6.45603 10.33L3.32103 12.245C3.19461 12.3221 3.04821 12.36 2.90027 12.354C2.75234 12.348 2.60949 12.2983 2.48972 12.2113C2.36996 12.1243 2.27864 12.0037 2.22726 11.8649C2.17589 11.726 2.16676 11.575 2.20103 11.431L3.05303 7.857L0.263028 5.467C0.150277 5.37074 0.0685828 5.24323 0.028266 5.10056C-0.0120509 4.9579 -0.00918217 4.80648 0.0365099 4.66545C0.082202 4.52441 0.168667 4.40008 0.284984 4.30816C0.401301 4.21624 0.54225 4.16086 0.690028 4.149L4.35303 3.856L5.76303 0.463003C5.81993 0.325626 5.91638 0.208264 6.04013 0.125824C6.16387 0.0433847 6.30933 -0.000410263 6.45803 2.89654e-06Z"
          fill="currentColor"
          fill-rule="evenodd"
        />
      </svg>
    </a>
  );
};

export { GithubStarsButton };
