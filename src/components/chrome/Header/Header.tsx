'use client';

import Button from '@/components/Storyblok/Button/Button';
import NavItem from '@/components/Storyblok/NavItem/NavItem';
import { useSiteConfig } from '@/lib/storyblok/context/SiteConfigContext';
import type {
  Button as ButtonBlok,
  NavItem as NavItemBlok,
} from '@/lib/storyblok/resources/types/storyblok-components';
import { Burger, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classNames from 'classnames';
import Image from 'next/image';
import styles from './Header.module.scss';

const normalizeNav = (items?: NavItemBlok[]) => (Array.isArray(items) ? items.filter(Boolean) : []);
const normalizeButtons = (items?: ButtonBlok[]) => (Array.isArray(items) ? items.filter(Boolean) : []);

const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
    <path
      d="M12 17.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 2.5v2.25M12 19.25v2.25M4.22 4.22l1.6 1.6M18.18 18.18l1.6 1.6M2.5 12h2.25M19.25 12h2.25M4.22 19.78l1.6-1.6M18.18 5.82l1.6-1.6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
    <path
      d="M21 13.2A7.8 7.8 0 0 1 10.8 3a6.9 6.9 0 1 0 10.2 10.2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Header = () => {
  const { config, colorScheme, toggleColorScheme } = useSiteConfig();
  const raw = config?.raw;
  const [mobileMenuOpened, mobileMenu] = useDisclosure(false);

  if (!raw) return null;

  const navItems = normalizeNav((raw as any)?.header_nav);
  const buttons = normalizeButtons((raw as any)?.header_buttons);
  const logo = (raw as any)?.header_logo;
  const isLight = Boolean((raw as any)?.header_light);

  if (!navItems.length && !buttons.length && !logo) return null;

  const nextScheme = colorScheme === 'dark' ? 'light' : 'dark';

  const logoSrc = typeof logo?.filename === 'string' ? logo.filename : undefined;
  const logoAlt = typeof logo?.alt === 'string' ? logo.alt : undefined;
  const isDefaultBrandLogo = Boolean(logoSrc && /brand-new-day-logo\.svg(\?.*)?$/i.test(logoSrc));
  const resolvedLogoSrc =
    colorScheme === 'dark' && isDefaultBrandLogo ? '/assets/logos/brand-new-day-logo-dark.svg' : logoSrc;

  return (
    <header className={classNames(styles.header, isLight && styles.isLight)}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          {resolvedLogoSrc ? (
            <span className={styles.logo}>
              <Image src={resolvedLogoSrc} alt={logoAlt || 'Logo'} width={140} height={38} />
            </span>
          ) : (
            <span className={styles.placeholder}>Logo</span>
          )}
        </div>

        {navItems.length ? (
          <nav className={styles.nav}>
            <div className={styles.navList}>
              {navItems.map((item) => (
                <NavItem
                  key={item._uid}
                  blok={{ ...item, component: 'nav-item' }}
                  _uid={item._uid}
                  component="nav-item"
                />
              ))}
            </div>
          </nav>
        ) : null}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleColorScheme}
            aria-label={`Switch to ${nextScheme} mode`}
            title={`Switch to ${nextScheme} mode`}
          >
            {colorScheme === 'dark' ? (
              <SunIcon className={styles.themeIcon} />
            ) : (
              <MoonIcon className={styles.themeIcon} />
            )}
          </button>

          {buttons.length
            ? buttons.map((btn) => (
                <Button key={btn._uid} blok={{ ...btn, component: 'button' }} _uid={btn._uid} component="button" />
              ))
            : null}
        </div>

        {(navItems.length || buttons.length) && (
          <div className={styles.mobileMenuControl}>
            <Burger
              opened={mobileMenuOpened}
              onClick={mobileMenu.toggle}
              aria-label={mobileMenuOpened ? 'Close navigation menu' : 'Open navigation menu'}
            />
          </div>
        )}
      </div>

      <Drawer
        opened={mobileMenuOpened}
        onClose={mobileMenu.close}
        position="right"
        size="xs"
        title={
          resolvedLogoSrc ? (
            <span className={styles.drawerBrand}>
              <Image src={resolvedLogoSrc} alt={logoAlt || 'Logo'} width={140} height={38} />
            </span>
          ) : (
            'Menu'
          )
        }
        classNames={{
          header: styles.drawerHeader,
          body: styles.drawerBody,
          content: styles.drawerContent,
        }}
      >
        <div className={styles.drawerUtilities}>
          <button
            type="button"
            className={styles.drawerThemeToggle}
            onClick={toggleColorScheme}
            aria-label={`Switch to ${nextScheme} mode`}
          >
            {colorScheme === 'dark' ? (
              <SunIcon className={styles.themeIcon} />
            ) : (
              <MoonIcon className={styles.themeIcon} />
            )}
            <span className={styles.drawerThemeToggleLabel}>{colorScheme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>
        </div>

        {navItems.length ? (
          <nav className={styles.mobileNav} aria-label="Mobile navigation">
            <div className={styles.mobileNavList} onClick={mobileMenu.close}>
              {navItems.map((item) => (
                <NavItem
                  key={item._uid}
                  blok={{ ...item, component: 'nav-item' }}
                  _uid={item._uid}
                  component="nav-item"
                />
              ))}
            </div>
          </nav>
        ) : null}

        {buttons.length ? (
          <div className={styles.mobileActions} onClick={mobileMenu.close}>
            {buttons.map((btn) => (
              <Button key={btn._uid} blok={{ ...btn, component: 'button' }} _uid={btn._uid} component="button" />
            ))}
          </div>
        ) : null}
      </Drawer>
    </header>
  );
};

export default Header;
