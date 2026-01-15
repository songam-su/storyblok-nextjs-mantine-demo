'use client';

import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import { StoryblokMultilink } from '@/lib/storyblok/resources/types/storyblok';
import { Button as ButtonProps } from '@/lib/storyblok/resources/types/storyblok-components';
import { getSbLink } from '@/lib/storyblok/utils/getSbLink';
import {
  getStoryblokColorClass,
  getStoryblokTextColorClass,
} from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { ButtonVariant, Button as MantineButton } from '@mantine/core';
import { storyblokEditable as createEditable } from '@storyblok/react';
import classNames from 'classnames';
import Link from 'next/link';
import React, { useCallback } from 'react';
import styles from './Button.module.scss';
import { getStoryblokButtonMantineSize } from './utils/storyblokButtonSize';

const STORYBLOK_BUTTON_VARIANT_MAP: Record<'default' | 'ghost', ButtonVariant> = {
  default: 'filled',
  ghost: 'subtle',
};

const getStoryblokButtonVariant = (style?: 'default' | 'ghost'): ButtonVariant =>
  STORYBLOK_BUTTON_VARIANT_MAP[style ?? 'default'];

type StoryblokButtonExtras = {
  submit?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

const Button: React.FC<SbComponentProps<ButtonProps> & StoryblokButtonExtras> = (props) => {
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
  const editableAttributes = isEditor ? (storyblokEditable ?? createEditable(blok as any)) : undefined;

  const isSubmit = props.submit === true;
  const isNavigableLink = !isEditor && !isSubmit && Boolean(href && href !== '#');

  const isDisabled =
    typeof props.disabled === 'boolean' ? props.disabled : !isEditor && !isSubmit && (!href || href === '#');

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
      disabled={isDisabled}
      loading={props.loading}
      size={getStoryblokButtonMantineSize(size)}
      variant={variant}
      data-sb-bg-color={backgroundColorKey}
      data-sb-text-color={textColorKey}
      component={isNavigableLink ? (Link as any) : 'button'}
      {...(isNavigableLink ? { href: href || '#' } : { type: isSubmit ? 'submit' : 'button' })}
      onClick={handleClick}
      target={isNavigableLink && link?.linktype === 'url' ? '_blank' : undefined}
      rel={isNavigableLink && link?.linktype === 'url' ? 'noopener noreferrer' : undefined}
    >
      {label}
    </MantineButton>
  );
};

export default Button;
