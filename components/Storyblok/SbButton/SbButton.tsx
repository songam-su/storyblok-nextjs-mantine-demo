import { MantineColor, MantineSize } from '@mantine/core';
import { Button, ButtonVariant } from '@mantine/core/lib/components/Button';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { StoryblokMultilink } from '../../../src/lib/storyblok/resources/types/storyblok';
import { Button as SbButtonProps } from '../../../src/lib/storyblok/resources/types/storyblok-components';
import { SbComponentProps } from '../../../src/lib/storyblok/types/SbComponentProps';

const SbButton: React.FC<SbComponentProps<SbButtonProps>> = (props) => {
  const { blok, storyblokEditable } = props;
  const { style, /*background_color,*/ text_color, size, link, label } = blok;

  const getMultilinkHref = (
    link: Exclude<StoryblokMultilink, { linktype?: 'email' } | { linktype?: 'asset' }>
  ): string => {
    if (!link) return '#';

    switch (link.linktype) {
      case 'story':
        // Internal Storyblok story
        return `/${link.cached_url || ''}`;
      case 'url':
        // External URL
        return link.url || '#';
      default:
        return '#';
    }
  };

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

  const useUIButtonVariant = (sbStyle: 'default' | 'ghost' | undefined): ButtonVariant => {
    const variantMap = useMemo<Record<'default' | 'ghost', ButtonVariant>>(
      () => ({
        default: 'filled',
        ghost: 'transparent', // Mantine's closest to ghost
      }),
      []
    );

    return variantMap[sbStyle ?? 'default'];
  };

  const href = getMultilinkHref(link);
  const variant = useUIButtonVariant(style);
  const backgroundColorClass =
    variant === 'transparent' ? 'transparent' : blok.color ? blok.color : 'primary-highlight'; // fallback

  return (
    <Button
      {...storyblokEditable}
      disabled={href === '#'}
      component={Link}
      href={href}
      size={useUISize(size)}
      color={useUIColor(text_color)}
      variant={variant}
      classNames={backgroundColorClass}
      // autoContrast={variant === 'filled'} // replaced by classNames usage
    >
      {label}
    </Button>
  );
};

export default SbButton;
