'use client';

import { Button, ButtonVariant } from '@mantine/core';
import Link from 'next/link';
import React, { useCallback } from 'react';
import classNames from 'classnames';
import styles from './Button.module.scss';
import { StoryblokMultilink } from '@/lib/storyblok/resources/types/storyblok';
import { Button as SbButtonProps } from '@/lib/storyblok/resources/types/storyblok-components';
import { getSbLink } from '@/lib/storyblok/utils/getSbLink';
import { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import { storyblokEditable as createEditable } from '@storyblok/react';
import {
  getStoryblokColorClass,
  getStoryblokTextColorClass,
} from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import { getStoryblokButtonMantineSize } from './utils/storyblokButtonSize';

const STORYBLOK_BUTTON_VARIANT_MAP: Record<'default' | 'ghost', ButtonVariant> = {
  default: 'filled',
  ghost: 'subtle',
};

const getStoryblokButtonVariant = (style?: 'default' | 'ghost'): ButtonVariant =>
  STORYBLOK_BUTTON_VARIANT_MAP[style ?? 'default'];

const SbButton: React.FC<SbComponentProps<SbButtonProps>> = (props) => {
  const { blok, storyblokEditable } = props;
  const { style, background_color, text_color, size, link, label } = blok;
  const backgroundColorKey = typeof background_color === 'string' ? background_color : undefined;
  const variant = getStoryblokButtonVariant(style);
  const isGhost = variant === 'subtle';

  const textColorKey = typeof text_color === 'string' ? text_color : undefined;

  const buttonClasses = classNames(
    styles.button,
    getStoryblokColorClass(backgroundColorKey),
    getStoryblokTextColorClass(text_color),
    isGhost && styles['is-ghost']
  );

  const href = getSbLink(link as StoryblokMultilink);
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
      size={getStoryblokButtonMantineSize(size)}
      variant={variant}
      data-sb-text-color={textColorKey}
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
