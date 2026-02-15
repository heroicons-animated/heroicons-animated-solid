import { clientOnly } from "@solidjs/start";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";

const CommentAuthorLink = () => {
  return (
    <a
      class="inline-block underline underline-offset-3 transition-[decoration-color,color] duration-100 focus-within:outline-offset-0 hover:text-primary hover:decoration-primary focus-visible:text-primary focus-visible:outline-1 focus-visible:outline-primary"
      href="https://aniketpawar.com/"
      rel="noopener external"
      tabIndex={0}
      target="_blank"
    >
      aniket
    </a>
  );
};

const CommentLucideAnimatedLink = () => {
  return (
    <a
      class="inline-block underline underline-offset-3 transition-[decoration-color,color] duration-100 focus-within:outline-offset-0 hover:text-primary hover:decoration-primary focus-visible:text-primary focus-visible:outline-1 focus-visible:outline-primary"
      href="https://lucide-animated.com/"
      rel="noopener external"
      tabIndex={0}
      target="_blank"
    >
      lucide-animated by dmytro
    </a>
  );
};

const CommentAnimationsDevLink = () => {
  return (
    <a
      class="inline-block underline underline-offset-3 transition-[decoration-color,color] duration-100 focus-within:outline-offset-0 hover:text-primary hover:decoration-primary focus-visible:text-primary focus-visible:outline-1 focus-visible:outline-primary"
      href="https://animations.dev/"
      rel="noopener external"
      tabIndex={0}
      target="_blank"
    >
      animations.dev
    </a>
  );
};

const CourseButton = clientOnly(() =>
  import("~/components/course-button").then((m) => ({
    default: m.CourseButton,
  }))
);

const CourseButtonFallback = () => (
  <Skeleton class="h-7 w-[120px] rounded-[8px] supports-[corner-shape:squircle]:rounded-[12px]" />
);

const CommentBlock = () => {
  return (
    <div class="relative my-[40px] flex w-full max-w-[610px] flex-col items-center justify-center pl-4 after:absolute after:left-0 after:h-full after:w-[4px] after:bg-neutral-400/50 max-[655px]:px-4 max-[655px]:after:left-4">
      <blockquote class="font-sans text-neutral-700 text-sm/[150%] tracking-[0.01em] before:content-[open-quote] after:content-[close-quote] max-[655px]:pl-4 dark:text-neutral-200">
        these icons were heavily inspired from the work of{" "}
        <CommentLucideAnimatedLink /> and what i learned from the{" "}
        <CommentAnimationsDevLink /> course.
      </blockquote>
      <div class="mt-4 flex w-full flex-wrap items-center justify-between gap-4 border-neutral-200 border-t pt-4 max-[655px]:pl-4 dark:border-neutral-800">
        <div class="flex items-center gap-2">
          <Avatar size="sm">
            <AvatarImage
              alt="Aniket Pawar, the author of the heroicons-animated"
              class="select-none"
              src="https://ik.imagekit.io/2oajjadqkz/profile.jpg?updatedAt=1770631384305"
            />
            <AvatarFallback class="bg-neutral-200 font-sans dark:bg-neutral-800">
              AP
            </AvatarFallback>
          </Avatar>
          <p class="text-[13px] text-neutral-600 tracking-[0.01em] dark:text-neutral-400">
            <CommentAuthorLink />, creator of heroicons-animated
          </p>
        </div>
        <CourseButton fallback={<CourseButtonFallback />} />
      </div>
    </div>
  );
};

export { CommentBlock };
