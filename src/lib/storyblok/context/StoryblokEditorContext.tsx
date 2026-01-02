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

  const params = new URLSearchParams(window.location.search);
  if (params.has(STORYBLOK_PREVIEW_QUERY)) return true;
  if (params.has(STORYBLOK_PREVIEW_TOKEN_QUERY)) return true;

  const ancestorOrigins = (window.location as any)?.ancestorOrigins as string[] | undefined;
  if (Array.isArray(ancestorOrigins) && ancestorOrigins.some((o) => typeof o === 'string' && o.includes(STORYBLOK_PREVIEW_HOST))) {
    return true;
  }

  const referrer = document?.referrer || '';
  return referrer.includes(STORYBLOK_PREVIEW_HOST);
};

export interface StoryblokEditorContextValue {
  isEditor: boolean;
}

const StoryblokEditorContext = createContext<StoryblokEditorContextValue>({
  isEditor: false,
});

interface StoryblokEditorProviderProps {
  children: ReactNode;
  initialIsEditor?: boolean;
}

export function StoryblokEditorProvider({ children, initialIsEditor = false }: StoryblokEditorProviderProps) {
  const [isEditor, setIsEditor] = useState<boolean>(() => initialIsEditor || detectStoryblokEditor());

  useEffect(() => {
    if (initialIsEditor) return; // already known
    if (detectStoryblokEditor()) {
      setIsEditor(true);
    }
  }, [initialIsEditor]);

  const value = useMemo(() => ({ isEditor }), [isEditor]);

  return <StoryblokEditorContext.Provider value={value}>{children}</StoryblokEditorContext.Provider>;
}

export const useStoryblokEditor = () => useContext(StoryblokEditorContext);
