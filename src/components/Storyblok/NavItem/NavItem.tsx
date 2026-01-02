'use client';

import Link from 'next/link';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import { getSbLink } from '@/lib/storyblok/utils/getSbLink';
import type { NavItem as NavItemBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import styles from './NavItem.module.scss';

const NavItem = ({ blok }: SbComponentProps<NavItemBlok>) => {
  const editable = storyblokEditable(blok as any);
  const href = getSbLink(blok.link);
  const label = blok.label || href || 'Link';

  if (!href || href === '#') {
    return (
      <span {...editable} className={classNames(styles.navItem, styles.placeholder)}>
        {label}
      </span>
    );
  }

  return (
    <Link {...editable} href={href} className={styles.navItem}>
      {label}
    </Link>
  );
};

export default NavItem;
