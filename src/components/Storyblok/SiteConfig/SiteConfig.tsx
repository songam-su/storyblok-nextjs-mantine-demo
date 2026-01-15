'use client';

import {
  applyCssVariables,
  normalizeSiteConfig,
  resetCssVariables,
  SiteConfigContent,
  useSiteConfig,
} from '@/lib/storyblok/context/SiteConfigContext';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { storyblokEditable } from '@storyblok/react';
import { useEffect } from 'react';
import styles from './SiteConfig.module.scss';

const SiteConfig = ({ blok }: SbComponentProps<SiteConfigContent>) => {
  const { setConfig, colorScheme } = useSiteConfig();
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;

  useEffect(() => {
    const normalized = normalizeSiteConfig(blok);
    setConfig(normalized);
    applyCssVariables(normalized, colorScheme);

    return () => {
      setConfig(undefined);
      resetCssVariables(colorScheme);
    };
  }, [blok, colorScheme, setConfig]);

  if (!isEditor) return null;

  return (
    <div {...editable} className={styles.configBadge}>
      <span className={styles.configLabel}>Site configuration active</span>
    </div>
  );
};

export default SiteConfig;
