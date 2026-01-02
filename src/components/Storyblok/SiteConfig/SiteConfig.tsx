'use client';

import { useEffect } from 'react';
import { storyblokEditable } from '@storyblok/react';
import { useSiteConfig, normalizeSiteConfig, applyCssVariables, resetCssVariables, SiteConfigContent } from '@/lib/storyblok/context/SiteConfigContext';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import styles from './SiteConfig.module.scss';

const SiteConfig = ({ blok }: SbComponentProps<SiteConfigContent>) => {
  const { setConfig } = useSiteConfig();
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;

  useEffect(() => {
    const normalized = normalizeSiteConfig(blok);
    setConfig(normalized);
    applyCssVariables(normalized);

    return () => {
      setConfig(undefined);
      resetCssVariables();
    };
  }, [blok, setConfig]);

  if (!isEditor) return null;

  return (
    <div {...editable} className={styles.configBadge}>
      <span className={styles.configLabel}>Site configuration active</span>
    </div>
  );
};

export default SiteConfig;
