'use client';

import styles from './PageSkeleton.module.scss';

type PageSkeletonProps = {
  mode?: 'page' | 'content';
};

export default function PageSkeleton({ mode = 'page' }: PageSkeletonProps) {
  return (
    <div className={styles.skeleton} data-mode={mode} aria-hidden="true">
      {mode === 'page' ? (
        <div className={styles.header}>
          <div className={styles.logo} />
          <div className={styles.nav}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.navItem} />
            ))}
          </div>
          <div className={styles.headerRight}>
            <div className={styles.iconButton} />
          </div>
        </div>
      ) : null}

      <div className={styles.sectionHeader}>
        <div className={styles.title} style={{ width: '42%' }} />
        <div className={styles.line} style={{ width: '64%' }} />
      </div>

      <div className={styles.controlsRow}>
        <div className={styles.control} />
        <div className={styles.control} />
      </div>

      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={styles.card} />
        ))}
      </div>
    </div>
  );
}
