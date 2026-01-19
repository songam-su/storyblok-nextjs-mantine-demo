'use client';

import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type { NavItem as NavItemBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import { getSbLink } from '@/lib/storyblok/utils/getSbLink';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';
import styles from './NavItem.module.scss';

const NavItem = ({ blok }: SbComponentProps<NavItemBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const pathname = usePathname();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;
  const href = getSbLink(blok.link);
  const label = blok.label || href || 'Link';

  const normalizePath = (path?: string | null) => {
    if (!path) return '';
    const withoutQuery = path.split('?')[0] ?? '';
    const withoutHash = withoutQuery.split('#')[0] ?? '';
    const trimmed = withoutHash.replace(/\/+$/, '');

    // Preview routes render under /sb-preview/* but should still highlight
    // the corresponding canonical path.
    if (trimmed === '/sb-preview' || trimmed.startsWith('/sb-preview/')) {
      const rest = trimmed.replace(/^\/sb-preview/, '') || '/';
      // In preview, "home" represents the canonical "/".
      return rest === '/home' ? '/' : rest;
    }

    return trimmed || '/';
  };

  const normalizedHref = normalizePath(href);
  const normalizedPathname = normalizePath(pathname);
  const isActive =
    Boolean(normalizedHref) &&
    (normalizedPathname === normalizedHref ||
      (normalizedHref !== '/' && normalizedPathname.startsWith(`${normalizedHref}/`)));

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
      <span {...editable} className={classNames(styles.navItem, styles.placeholder)} data-label={label}>
        <span className={styles.label}>{label}</span>
      </span>
    );
  }

  return (
    <Link
      {...editable}
      href={href}
      className={styles.navItem}
      data-label={label}
      aria-current={isActive ? 'page' : undefined}
      onClick={handleEditorClick}
    >
      <span className={styles.label}>{label}</span>
    </Link>
  );
};

export default NavItem;
