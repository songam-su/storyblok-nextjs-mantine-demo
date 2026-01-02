'use client';

import Link from 'next/link';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import { useCallback } from 'react';
import { getSbLink } from '@/lib/storyblok/utils/getSbLink';
import type { NavItem as NavItemBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import styles from './NavItem.module.scss';

const NavItem = ({ blok }: SbComponentProps<NavItemBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;
  const href = getSbLink(blok.link);
  const label = blok.label || href || 'Link';

  const handleEditorClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (isEditor) {
        event.preventDefault();
      }
    },
    [isEditor]
  );

  if (!href || href === '#') {
    return (
      <span {...editable} className={classNames(styles.navItem, styles.placeholder)}>
        {label}
      </span>
    );
  }

  return (
    <Link {...editable} href={href} className={styles.navItem} onClick={handleEditorClick}>
      {label}
    </Link>
  );
};

export default NavItem;
