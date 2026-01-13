'use client';

import { useEffect, useMemo, useState } from 'react';
import PageSkeleton from '../PageSkeleton/PageSkeleton';
import styles from './AppLoadingOverlay.module.scss';

const DEFAULT_MAX_WAIT_MS = 900;

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export default function AppLoadingOverlay() {
  const [isVisible, setIsVisible] = useState(true);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // Two RAFs tends to land after the first paint/hydration work.
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

      const fontsReady = (document as any).fonts?.ready as Promise<void> | undefined;

      // Don’t block indefinitely on fonts (or on browsers without FontFaceSet).
      await Promise.race([fontsReady ?? Promise.resolve(), wait(DEFAULT_MAX_WAIT_MS)]);

      if (cancelled) return;

      if (prefersReducedMotion) {
        setIsVisible(false);
        return;
      }

      // Small delay so the fade feels intentional (prevents a flash).
      await wait(120);
      if (!cancelled) setIsVisible(false);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [prefersReducedMotion]);

  return (
    <div className={styles.overlay} data-visible={isVisible ? 'true' : 'false'} aria-hidden="true">
      <div className={styles.inner}>
        <PageSkeleton mode="page" />
      </div>
    </div>
  );
}
