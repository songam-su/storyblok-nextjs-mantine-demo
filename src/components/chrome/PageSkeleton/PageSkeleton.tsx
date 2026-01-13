'use client';

import styles from './PageSkeleton.module.scss';

type PageSkeletonProps = {
  variant?: 'default' | 'articles';
};

export default function PageSkeleton({ variant = 'default' }: PageSkeletonProps) {
  return (
    <div className={styles.skeleton} data-variant={variant} aria-hidden="true">
      <div className={styles.hero} />
      <div className={styles.content}>
        <div className={styles.line} style={{ width: '46%' }} />
        <div className={styles.line} style={{ width: '72%' }} />
        <div className={styles.line} style={{ width: '64%' }} />

        <div className={styles.grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.card} />
          ))}
        </div>
      </div>
    </div>
  );
}
