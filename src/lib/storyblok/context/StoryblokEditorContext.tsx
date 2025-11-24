'use client';

import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORYBLOK_PREVIEW_QUERY = '_storyblok';
const STORYBLOK_PREVIEW_HOST = 'app.storyblok.com';

const detectStoryblokEditor = (): boolean => {
  if (typeof window === 'undefined') return false;

  const params = new URLSearchParams(window.location.search);
  if (params.has(STORYBLOK_PREVIEW_QUERY)) return true;

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
  const [isEditor, setIsEditor] = useState<boolean>(initialIsEditor);

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
