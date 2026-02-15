import { onMount, onCleanup } from "solid-js";
import { Input } from "./ui/input";
import { Kbd } from "./ui/kbd";

type SearchInputProps = {
  searchValue: string;
  setSearchValue: (value: string) => void;
  resultCount?: number;
  totalCount?: number;
};

/** Inline magnifying glass SVG */
const MagnifyingGlassIcon = () => (
  <svg
    class="size-5 text-neutral-400"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const SearchInput = (props: SearchInputProps) => {
  let inputRef: HTMLInputElement | undefined;

  onMount(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef?.focus();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        props.setSearchValue("");
        inputRef?.blur();
      }
    };
    document.addEventListener("keydown", handler);
    onCleanup(() => document.removeEventListener("keydown", handler));
  });

  const showResultCount = () =>
    props.searchValue.length > 0 &&
    props.resultCount !== undefined &&
    props.totalCount !== undefined;

  return (
    <div class="sticky top-0 z-50 border-neutral-200 border-y bg-background/80 backdrop-blur-md dark:border-neutral-800 dark:bg-background/80">
      <div class="view-container flex items-center gap-2 border-neutral-200 py-2 xl:border-x dark:border-neutral-800">
        <Input
          aria-label="Search icons"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          class="h-10 bg-white dark:bg-[#0A0A0A]"
          inputMode="search"
          leadingIcon={<MagnifyingGlassIcon />}
          onInput={(e) => props.setSearchValue(e.currentTarget.value)}
          placeholder="Search icons..."
          ref={inputRef}
          role="search"
          spellcheck={false}
          trailingIcon={
            showResultCount() ? (
              <span class="font-mono text-neutral-400 text-sm">
                {props.resultCount}/{props.totalCount}
              </span>
            ) : (
              <Kbd class="border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
                ⌘ K
              </Kbd>
            )
          }
          value={props.searchValue}
        />
      </div>
    </div>
  );
};

export { SearchInput };
