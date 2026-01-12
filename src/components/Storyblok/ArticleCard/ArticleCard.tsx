'use client';

import { Title } from '@mantine/core';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ArticleCard.module.scss';

export type ArticleCardImage = {
  src: string;
  alt?: string;
};

export type ArticleCardCategory = {
  key: string;
  name: string;
  icon?: {
    src: string;
    alt?: string;
  };
};

type Props = {
  title: string;
  href?: string;
  image?: ArticleCardImage;
  categories?: ArticleCardCategory[];
  onClick?: React.MouseEventHandler<HTMLElement>;
  className?: string;
  imageSizes?: string;
  titleOrder?: 1 | 2 | 3 | 4 | 5 | 6;
};

const ArticleCard = ({
  title,
  href,
  image,
  categories,
  onClick,
  className,
  imageSizes = '(min-width: 75em) 25vw, (min-width: 62em) 33vw, (min-width: 48em) 50vw, 100vw',
  titleOrder = 3,
}: Props) => {
  const hasImage = Boolean(image?.src);
  const hasCategories = Array.isArray(categories) && categories.length > 0;

  const content = (
    <>
      {hasImage ? (
        <div className={styles.imageWrap}>
          <Image src={image!.src} alt={image?.alt || ''} fill className={styles.image} sizes={imageSizes} />
        </div>
      ) : null}

      <div className={styles.body}>
        {hasCategories ? (
          <div className={styles.categories}>
            {categories!.map((cat) => (
              <span key={cat.key} className={styles.category}>
                {cat.icon?.src ? (
                  <span className={styles.categoryIconWrap} aria-hidden="true">
                    <Image
                      src={cat.icon.src}
                      alt={cat.icon.alt || ''}
                      width={18}
                      height={18}
                      className={styles.categoryIcon}
                    />
                  </span>
                ) : null}
                <span>{cat.name}</span>
              </span>
            ))}
          </div>
        ) : null}

        <Title order={titleOrder} className={styles.title}>
          {title}
        </Title>
      </div>
    </>
  );

  const rootClassName = classNames(styles.card, className);

  if (href) {
    return (
      <Link href={href} className={rootClassName} onClick={onClick as any}>
        {content}
      </Link>
    );
  }

  return (
    <div className={rootClassName} onClick={onClick}>
      {content}
    </div>
  );
};

export default ArticleCard;
