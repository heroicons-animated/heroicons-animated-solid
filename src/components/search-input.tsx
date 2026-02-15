import { onCleanup, onMount } from "solid-js";
import { MagnifyingGlassIcon } from "./ui/icons";
import { Input } from "./ui/input";
import { Kbd } from "./ui/kbd";

interface SearchInputProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  resultCount?: number;
  totalCount?: number;
}

const SearchInput = (props: SearchInputProps) => {
  let inputRef: HTMLInputElement | undefined;
  const setInputRef = (el: HTMLInputElement) => {
    inputRef = el;
  };

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
          ref={setInputRef}
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
