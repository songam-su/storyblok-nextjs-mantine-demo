import Image from 'next/image';
import classNames from 'classnames';
import { storyblokEditable } from '@storyblok/react';
import type { Category as CategoryBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import styles from './Category.module.scss';

const Category = ({ blok }: SbComponentProps<CategoryBlok>) => {
  const editable = storyblokEditable(blok as any);
  const hasIcon = Boolean(blok.icon?.filename);

  return (
    <div {...editable} className={styles.card}>
      {hasIcon && (
        <div className={styles.iconWrap}>
          <Image
            src={blok.icon!.filename}
            alt={blok.icon!.alt || blok.headline || 'Category icon'}
            width={48}
            height={48}
          />
        </div>
      )}
      {blok.headline && <h3 className={classNames(styles.title)}>{blok.headline}</h3>}
      {blok.meta_description && <p className={styles.meta}>{blok.meta_description}</p>}
    </div>
  );
};

export default Category;
