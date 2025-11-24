'use client';

import { Button, ButtonVariant, MantineColor, MantineSize } from '@mantine/core';
import Link from 'next/link';
import styles from './SbButton.module.scss'; // ✅ Import SCSS module
import React, { useEffect, useMemo, useState } from 'react';
import { StoryblokMultilink } from '@/lib/storyblok/resources/types/storyblok';
import { Button as SbButtonProps } from '@/lib/storyblok/resources/types/storyblok-components';
import { getSbLink } from '@/lib/storyblok/utils/getSbLink';
import { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';

const SbButton: React.FC<SbComponentProps<SbButtonProps>> = (props) => {
  const { blok, storyblokEditable } = props;
  const { style, background_color, text_color, size, link, label } = blok;

  // Map Storyblok size to Mantine size
  const useUISize = (
    sbSize?: 'small' | 'medium' | 'large'
  ):
    | MantineSize
    | 'compact-xs'
    | 'compact-sm'
    | 'compact-md'
    | 'compact-lg'
    | 'compact-xl'
    | (string & {})
    | undefined => {
    const sizeMap = useMemo<Record<'small' | 'medium' | 'large', MantineSize>>(
      () => ({
        small: 'sm',
        medium: 'md',
        large: 'lg',
      }),
      []
    );

    return sizeMap[sbSize ?? 'medium'];
  };

  // Map Storyblok color to Mantine color
  const useUIColor = (sbColor?: 'primary-dark' | 'white'): MantineColor => {
    const colorMap = useMemo<Record<'primary-dark' | 'white', MantineColor>>(
      () => ({
        'primary-dark': 'dark',
        white: 'cyan', // or 'white' if you want actual white
      }),
      []
    );

    return colorMap[sbColor ?? 'primary-dark'];
  };

  // Map Storyblok style to Mantine Button variant
  const useUIButtonVariant = (sbStyle: 'default' | 'ghost' | undefined): ButtonVariant => {
    const variantMap = useMemo<Record<'default' | 'ghost', ButtonVariant>>(
      () => ({
        default: 'default',
        ghost: 'transparent', // Mantine's closest to ghost
      }),
      []
    );

    return variantMap[sbStyle ?? 'default'];
  };

  // Map Storyblok color to SCSS class
  const getColorClass = (sbColor?: string): string => {
    const colorMap: Record<string, string> = {
      'primary-highlight': styles['primary-highlight'],
      'highlight-1': styles['highlight-1'],
      'highlight-2': styles['highlight-2'],
      'highlight-3': styles['highlight-3'],
      'primary-dark': styles['primary-dark'],
      white: styles['white'],
    };
    return colorMap[sbColor ?? 'primary-highlight'];
  };

  // Link Handling
  const resolvedHref = useMemo(() => getSbLink(link as StoryblokMultilink), [link]);
  const [href, setHref] = useState(resolvedHref);
  const { isEditor } = useStoryblokEditor();

  useEffect(() => {
    setHref(isEditor ? '#' : resolvedHref);
  }, [isEditor, resolvedHref]);

  const isExternal = link?.linktype === 'url' && href !== '#';

  // Styles Handling
  const variant = useUIButtonVariant(style);
  const backgroundColorClass =
    variant === 'transparent' ? 'transparent' : background_color ? String(background_color) : 'primary-highlight'; // fallback
  const colorClass = getColorClass(backgroundColorClass); // ✅ Use blok.color for SCSS mapping

  return (
    <Button
      {...storyblokEditable}
      disabled={href === '#'}
      size={useUISize(size)}
      color={useUIColor(text_color)}
      variant={variant}
      className={colorClass}
      component={Link}
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {label}
    </Button>
  );
};

export default SbButton;
