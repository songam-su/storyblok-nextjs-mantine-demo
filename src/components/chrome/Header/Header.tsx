'use client';

import Image from 'next/image';
import classNames from 'classnames';
import NavItem from '@/components/Storyblok/NavItem/NavItem';
import Button from '@/components/Storyblok/Button/Button';
import { useSiteConfig } from '@/lib/storyblok/context/SiteConfigContext';
import type { NavItem as NavItemBlok, Button as ButtonBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import styles from './Header.module.scss';

const normalizeNav = (items?: NavItemBlok[]) => (Array.isArray(items) ? items.filter(Boolean) : []);
const normalizeButtons = (items?: ButtonBlok[]) => (Array.isArray(items) ? items.filter(Boolean) : []);

const Header = () => {
  const { config } = useSiteConfig();
  const raw = config?.raw;

  if (!raw) return null;

  const navItems = normalizeNav((raw as any)?.header_nav);
  const buttons = normalizeButtons((raw as any)?.header_buttons);
  const logo = (raw as any)?.header_logo;
  const isLight = Boolean((raw as any)?.header_light);

  if (!navItems.length && !buttons.length && !logo) return null;

  return (
    <header className={classNames(styles.header, isLight && styles.isLight)}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          {logo?.filename ? (
            <span className={styles.logo}>
              <Image src={logo.filename} alt={logo.alt || 'Logo'} width={140} height={38} />
            </span>
          ) : (
            <span className={styles.placeholder}>Logo</span>
          )}
        </div>

        {navItems.length ? (
          <nav className={styles.nav}>
            <div className={styles.navList}>
              {navItems.map((item) => (
                <NavItem key={item._uid} blok={{ ...item, component: 'nav-item' }} _uid={item._uid} component="nav-item" />
              ))}
            </div>
          </nav>
        ) : null}

        {buttons.length ? (
          <div className={styles.actions}>
            {buttons.map((btn) => (
              <Button key={btn._uid} blok={{ ...btn, component: 'button' }} _uid={btn._uid} component="button" />
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
