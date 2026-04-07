import { useEffect, type DependencyList } from "react";

type AsyncEffectHelpers = {
  isActive: () => boolean;
};

type AsyncEffectCallback = (helpers: AsyncEffectHelpers) => Promise<void> | void;

export function useAsyncEffect(callback: AsyncEffectCallback, deps: DependencyList) {
  useEffect(() => {
    let active = true;

    void callback({
      isActive: () => active,
    });

    return () => {
      active = false;
    };
  }, deps);
}

