import Banner from '@/components/Storyblok/Banner/Banner';
import { storyblokEditable } from '@storyblok/react';
import type { BannerReference as BannerReferenceBlok, Banner as BannerBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import styles from './BannerReference.module.scss';

// Renders referenced Banner stories. Falls back to nothing if no valid banners.
const BannerReference = ({ blok }: SbComponentProps<BannerReferenceBlok>) => {
  const editable = storyblokEditable(blok as any);
  const banners = (blok.banners || [])
    .map((item) => (typeof item === 'string' ? null : (item as any)?.content as BannerBlok | undefined))
    .filter((b): b is BannerBlok => Boolean(b && b.component === 'banner'));

  if (banners.length === 0) return null;

  return (
    <div {...editable} className={styles.wrapper}>
      {banners.map((banner) => (
        <div key={banner._uid} className={styles.item}>
          <Banner blok={banner} _uid={banner._uid} component={banner.component} />
        </div>
      ))}
    </div>
  );
};

export default BannerReference;
