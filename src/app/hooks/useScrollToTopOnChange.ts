import {
  useEffect,
  useLayoutEffect,
  type DependencyList,
  type RefObject,
} from "react";

interface UseScrollToTopOnChangeOptions {
  extraFrames?: number;
  mainRef?: RefObject<HTMLElement | null>;
  targetRef?: RefObject<HTMLElement | null>;
  behavior?: ScrollBehavior;
  durationMs?: number;
}

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function animateWindowToTop(durationMs: number) {
  const startY = window.scrollY || window.pageYOffset || 0;
  if (startY <= 0) return;

  const start = performance.now();
  const frame = (now: number) => {
    const elapsed = now - start;
    const progress = Math.min(1, elapsed / durationMs);
    const eased = easeInOutCubic(progress);
    const nextY = Math.round(startY * (1 - eased));
    window.scrollTo(0, nextY);
    if (progress < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

function animateElementToTop(el: HTMLElement, durationMs: number) {
  const startTop = el.scrollTop;
  if (startTop <= 0) return;

  const start = performance.now();
  const frame = (now: number) => {
    const elapsed = now - start;
    const progress = Math.min(1, elapsed / durationMs);
    const eased = easeInOutCubic(progress);
    el.scrollTop = Math.round(startTop * (1 - eased));
    if (progress < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

function scrollToTopNow(options: UseScrollToTopOnChangeOptions) {
  const behavior = options.behavior ?? "smooth";
  const durationMs = Math.max(120, options.durationMs ?? 800);
  const tried: HTMLElement[] = [];

  const pushIfPresent = (el: unknown) => {
    if (!el) return;
    if (el instanceof HTMLElement) tried.push(el);
  };

  pushIfPresent(options.mainRef?.current);
  pushIfPresent(document.scrollingElement as unknown as HTMLElement);
  pushIfPresent(document.documentElement as unknown as HTMLElement);
  pushIfPresent(document.body as unknown as HTMLElement);

  const qsMain =
    document.getElementById("app-main") ?? document.querySelector("main");
  pushIfPresent(qsMain instanceof HTMLElement ? qsMain : null);

  // Remove duplicates while preserving order
  const candidates = Array.from(new Set(tried));

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const shouldAnimateCustom = behavior === "smooth" && !prefersReducedMotion;

  // Always try window-level scroll first
  if (shouldAnimateCustom) {
    animateWindowToTop(durationMs);
  } else {
    try {
      window.scrollTo({ top: 0, left: 0, behavior });
    } catch (e) {
      // ignore
    }
  }

  for (const el of candidates) {
    if (shouldAnimateCustom) {
      try {
        animateElementToTop(el, durationMs);
      } catch (e) {
        try {
          el.scrollTop = 0;
          el.scrollLeft = 0;
        } catch {}
      }
    } else {
      try {
        if (typeof (el as any).scrollTo === "function") {
          (el as any).scrollTo({ top: 0, left: 0, behavior });
        } else {
          (el as any).scrollTop = 0;
          (el as any).scrollLeft = 0;
        }
      } catch (e) {
        try {
          (el as any).scrollTop = 0;
          (el as any).scrollLeft = 0;
        } catch {}
      }
    }
  }

  // If a target ref is provided (e.g. anchor navigation), prefer scrolling into view
  try {
    options.targetRef?.current?.scrollIntoView({
      block: "start",
      behavior,
    });
  } catch {}
}

export function useScrollToTopOnChange(
  deps: DependencyList,
  options: UseScrollToTopOnChangeOptions = {},
) {
  useLayoutEffect(() => {
    scrollToTopNow(options);
  }, deps);

  useEffect(() => {
    const rafIds: number[] = [];
    const extraFrames = Math.max(0, options.extraFrames ?? 4);
    const timeoutIds: number[] = [];

    scrollToTopNow(options);

    for (let frame = 0; frame < extraFrames; frame += 1) {
      rafIds.push(
        requestAnimationFrame(() => {
          scrollToTopNow(options);
        }),
      );
    }

    timeoutIds.push(
      window.setTimeout(() => {
        scrollToTopNow(options);
      }, 0),
    );
    timeoutIds.push(
      window.setTimeout(() => {
        scrollToTopNow(options);
      }, 80),
    );

    return () => {
      rafIds.forEach((id) => cancelAnimationFrame(id));
      timeoutIds.forEach((id) => window.clearTimeout(id));
    };
  }, deps);
}
