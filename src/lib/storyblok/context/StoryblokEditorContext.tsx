'use client';

import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORYBLOK_PREVIEW_QUERY = '_storyblok';
const STORYBLOK_PREVIEW_TOKEN_QUERY = '_storyblok_tk';
const STORYBLOK_PREVIEW_HOST = 'app.storyblok.com';

const detectStoryblokEditor = (): boolean => {
  if (typeof window === 'undefined') return false;

  const isInIframe = (() => {
    try {
      return window.self !== window.top;
    } catch {
      // Cross-origin access to window.top can throw inside the Storyblok editor iframe.
      return true;
    }
  })();

  const isPreviewPath = window.location.pathname.startsWith('/sb-preview');
  if (isPreviewPath && isInIframe) return true;

  const ancestorOrigins = (window.location as any)?.ancestorOrigins as string[] | undefined;
  if (
    Array.isArray(ancestorOrigins) &&
    ancestorOrigins.some((o) => typeof o === 'string' && o.includes(STORYBLOK_PREVIEW_HOST))
  ) {
    return true;
  }

  const referrer = document?.referrer || '';
  return referrer.includes(STORYBLOK_PREVIEW_HOST);
};

export interface StoryblokEditorContextValue {
  isEditor: boolean;
  isVisualEditor: boolean;
}

const StoryblokEditorContext = createContext<StoryblokEditorContextValue>({
  isEditor: false,
  isVisualEditor: false,
});

interface StoryblokEditorProviderProps {
  children: ReactNode;
  initialIsEditor?: boolean;
}

export function StoryblokEditorProvider({ children, initialIsEditor = false }: StoryblokEditorProviderProps) {
  // `isEditor` controls whether we render Storyblok editable markup.
  // We allow this to be `true` initially to keep SSR/client hydration consistent on preview routes,
  // then correct it after mount based on actual runtime detection.
  const [isEditor, setIsEditor] = useState<boolean>(() => initialIsEditor || detectStoryblokEditor());
  // `isVisualEditor` means "running inside the Storyblok Visual Editor iframe".
  // This is used for UX behaviors (e.g. disabling navigation) that should NOT apply to normal preview pages.
  const [isVisualEditor, setIsVisualEditor] = useState<boolean>(() => detectStoryblokEditor());

  useEffect(() => {
    const detected = detectStoryblokEditor();

    // Always keep `isVisualEditor` accurate.
    setIsVisualEditor(detected);

    // Correct `isEditor` after hydration.
    setIsEditor(detected);
  }, []);

  const value = useMemo(() => ({ isEditor, isVisualEditor }), [isEditor, isVisualEditor]);

  return <StoryblokEditorContext.Provider value={value}>{children}</StoryblokEditorContext.Provider>;
}

export const useStoryblokEditor = () => useContext(StoryblokEditorContext);
