'use client';

import { Button, ButtonVariant, MantineSize } from '@mantine/core';
import Link from 'next/link';
import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import styles from './SbButton.module.scss';
import { StoryblokMultilink } from '@/lib/storyblok/resources/types/storyblok';
import { Button as SbButtonProps } from '@/lib/storyblok/resources/types/storyblok-components';
import { getSbLink } from '@/lib/storyblok/utils/getSbLink';
import { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import { storyblokEditable as createEditable } from '@storyblok/react';

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

  // Map Storyblok style to Mantine Button variant
  const useUIButtonVariant = (sbStyle: 'default' | 'ghost' | undefined): ButtonVariant => {
    const variantMap = useMemo<Record<'default' | 'ghost', ButtonVariant>>(
      () => ({
        default: 'filled',
        ghost: 'subtle',
      }),
      []
    );

    return variantMap[sbStyle ?? 'default'];
  };

  const variant = useUIButtonVariant(style);

  const buttonClasses = classNames(
    styles.button,
    background_color && styles[background_color],
    text_color && styles[`text-${text_color}`],
    variant === 'subtle' && styles['is-ghost']
  );

  const href = useMemo(() => getSbLink(link as StoryblokMultilink), [link]);
  const { isEditor } = useStoryblokEditor();
  const editableAttributes = storyblokEditable ?? createEditable(blok as any);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (isEditor) {
        event.preventDefault();
      }
    },
    [isEditor]
  );

  return (
    <Button
      {...editableAttributes}
      className={buttonClasses}
      disabled={!href || href === '#'}
      size={useUISize(size)}
      variant={variant}
      component={Link}
      href={href || '#'}
      onClick={handleClick}
      target={!isEditor && link?.linktype === 'url' && href && href !== '#' ? '_blank' : undefined}
      rel={!isEditor && link?.linktype === 'url' && href && href !== '#' ? 'noopener noreferrer' : undefined}
    >
      {label}
    </Button>
  );
};

export default SbButton;
