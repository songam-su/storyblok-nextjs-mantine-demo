'use client';

import { Button as MantineButton, ButtonVariant } from '@mantine/core';
import Link from 'next/link';
import React, { useCallback } from 'react';
import classNames from 'classnames';
import styles from './Button.module.scss';
import { StoryblokMultilink } from '@/lib/storyblok/resources/types/storyblok';
import { Button as ButtonProps } from '@/lib/storyblok/resources/types/storyblok-components';
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

const Button: React.FC<SbComponentProps<ButtonProps>> = (props) => {
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

  const isNavigableLink = !isEditor && Boolean(href && href !== '#');

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (isEditor) {
        event.preventDefault();
      }
    },
    [isEditor]
  );

  return (
    <MantineButton
      {...editableAttributes}
      className={buttonClasses}
      disabled={!isEditor && (!href || href === '#')}
      size={getStoryblokButtonMantineSize(size)}
      variant={variant}
      data-sb-text-color={textColorKey}
      component={isNavigableLink ? (Link as any) : 'button'}
      {...(isNavigableLink ? { href: href || '#' } : { type: 'button' })}
      onClick={handleClick}
      target={isNavigableLink && link?.linktype === 'url' ? '_blank' : undefined}
      rel={isNavigableLink && link?.linktype === 'url' ? 'noopener noreferrer' : undefined}
    >
      {label}
    </MantineButton>
  );
};

export default Button;
