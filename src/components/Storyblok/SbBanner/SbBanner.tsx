'use client';
//SbBanner.tsx
import React from 'react';
import { Banner as SbBannerProps } from '../../../lib/storyblok/resources/types/storyblok-components';
import { SbComponentProps } from '../../../types/storyblok/SbComponentProps';
import SbButton from '../SbButton/SbButton';

const SbBanner: React.FC<SbComponentProps<SbBannerProps>> = (props) => {
  const { blok, storyblokEditable } = props;

  const buttonBlok = blok.buttons?.[0];

  // const { style, /*background_color,*/ text_color, size, link, label } = blok;

  // const getMultilinkHref = (
  //   link: Exclude<StoryblokMultilink, { linktype?: 'email' } | { linktype?: 'asset' }>
  // ): string => {
  //   if (!link) return '#';

  //   switch (link.linktype) {
  //     case 'story':
  //       // Internal Storyblok story
  //       return `/${link.cached_url || ''}`;
  //     case 'url':
  //       // External URL
  //       return link.url || '#';
  //     default:
  //       return '#';
  //   }
  // };

  // const useUISize = (
  //   sbSize?: 'small' | 'medium' | 'large'
  // ):
  //   | MantineSize
  //   | 'compact-xs'
  //   | 'compact-sm'
  //   | 'compact-md'
  //   | 'compact-lg'
  //   | 'compact-xl'
  //   | (string & {})
  //   | undefined => {
  //   const sizeMap = useMemo<Record<'small' | 'medium' | 'large', MantineSize>>(
  //     () => ({
  //       small: 'sm',
  //       medium: 'md',
  //       large: 'lg',
  //     }),
  //     []
  //   );

  //   return sizeMap[sbSize ?? 'medium'];
  // };

  // const useUIColor = (sbColor?: 'primary-dark' | 'white'): MantineColor => {
  //   const colorMap = useMemo<Record<'primary-dark' | 'white', MantineColor>>(
  //     () => ({
  //       'primary-dark': 'dark',
  //       white: 'cyan', // or 'white' if you want actual white
  //     }),
  //     []
  //   );

  //   return colorMap[sbColor ?? 'primary-dark'];
  // };

  // const useUIBannerVariant = (sbStyle: 'default' | 'ghost' | undefined): BannerVariant => {
  //   const variantMap = useMemo<Record<'default' | 'ghost', BannerVariant>>(
  //     () => ({
  //       default: 'filled',
  //       ghost: 'transparent', // Mantine's closest to ghost
  //     }),
  //     []
  //   );

  //   return variantMap[sbStyle ?? 'default'];
  // };

  // const href = getMultilinkHref(link);
  // const variant = useUIBannerVariant(style);
  // const backgroundColorClass =
  //   variant === 'transparent' ? 'transparent' : blok.color ? blok.color : 'primary-highlight'; // fallback

  if (!buttonBlok) return <h1>NO BUTTON</h1>;

  return (
    <SbButton blok={buttonBlok} _uid={blok._uid} component={blok.component} />
    // <Banner
    //   {...storyblokEditable}
    //   disabled={href === '#'}
    //   component={Link}
    //   href={href}
    //   size={useUISize(size)}
    //   color={useUIColor(text_color)}
    //   variant={variant}
    //   classNames={backgroundColorClass}
    //   // autoContrast={variant === 'filled'} // replaced by classNames usage
    // >
    //   {label}
    // </Banner>
  );
};

export default SbBanner;
