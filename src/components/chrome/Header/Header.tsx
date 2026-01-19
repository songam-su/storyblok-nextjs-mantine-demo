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
import Link from 'next/link';
import type { SVGProps } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Header.module.scss';

const normalizeNav = (items?: NavItemBlok[]) => (Array.isArray(items) ? items.filter(Boolean) : []);
const normalizeButtons = (items?: ButtonBlok[]) => (Array.isArray(items) ? items.filter(Boolean) : []);

const SunIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
    <path
      className={styles.sunCore}
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

const MoonIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
    <path d="M21 13.2A7.8 7.8 0 0 1 10.8 3a6.9 6.9 0 1 0 10.2 10.2Z" fill="currentColor" />
    <path
      d="M21 13.2A7.8 7.8 0 0 1 10.8 3a6.9 6.9 0 1 0 10.2 10.2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AutoThemeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
    <path
      d="M12 2.75l1.05 3.35a1 1 0 0 0 .65.65l3.35 1.05-3.35 1.05a1 1 0 0 0-.65.65L12 12.85l-1.05-3.35a1 1 0 0 0-.65-.65L6.95 7.8l3.35-1.05a1 1 0 0 0 .65-.65L12 2.75Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M18.25 13.25l.6 1.9a1 1 0 0 0 .65.65l1.9.6-1.9.6a1 1 0 0 0-.65.65l-.6 1.9-.6-1.9a1 1 0 0 0-.65-.65l-1.9-.6 1.9-.6a1 1 0 0 0 .65-.65l.6-1.9Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      opacity="0.75"
    />
  </svg>
);

const Header = () => {
  const { config, colorScheme, hasInitializedColorScheme, toggleColorScheme } = useSiteConfig();
  const raw = config?.raw;
  const [mobileMenuOpened, mobileMenu] = useDisclosure(false);

  const [isIconSwitching, setIsIconSwitching] = useState(false);
  const [displayedScheme, setDisplayedScheme] = useState<'light' | 'dark'>(colorScheme);
  const hasRunInitTransition = useRef(false);
  const ICON_FADE_MS = 520;
  const ICON_GAP_MS = 55;
  const ICON_SWITCH_HOLD_MS = ICON_FADE_MS + ICON_GAP_MS;

  const endIconSwitchingWhenReady = useCallback(
    (targetScheme?: 'light' | 'dark') => {
      const start = window.performance?.now?.() ?? Date.now();
      const maxWaitMs = 1500;
      let swappedLabel = false;

      const tick = () => {
        const now = window.performance?.now?.() ?? Date.now();
        const elapsed = now - start;
        const rootScheme = document.documentElement.getAttribute('data-mantine-color-scheme');
        const schemeMatches = targetScheme ? rootScheme === targetScheme : true;

        // After the fade-out completes, swap the displayed label while hidden.
        // This makes the new values appear only on the fade-in.
        if (!swappedLabel && targetScheme && elapsed >= ICON_FADE_MS && schemeMatches) {
          swappedLabel = true;
          setDisplayedScheme(targetScheme);
        }

        // Hold for at least the icon fade+gap so we never show overlapping glyphs.
        if (elapsed >= ICON_SWITCH_HOLD_MS && schemeMatches) {
          setIsIconSwitching(false);
          return;
        }

        if (elapsed >= maxWaitMs) {
          setIsIconSwitching(false);
          return;
        }

        window.requestAnimationFrame(tick);
      };

      window.requestAnimationFrame(tick);
    },
    [ICON_FADE_MS, ICON_SWITCH_HOLD_MS]
  );

  // Keep the displayed scheme in sync when we are not actively animating.
  useEffect(() => {
    if (isIconSwitching) return;
    setDisplayedScheme(colorScheme);
  }, [colorScheme, isIconSwitching]);

  useEffect(() => {
    if (!hasInitializedColorScheme || hasRunInitTransition.current) return;
    hasRunInitTransition.current = true;

    // Ensure the first transition (sparkle -> final icon) has no overlap.
    setIsIconSwitching(true);
    endIconSwitchingWhenReady();
  }, [endIconSwitchingWhenReady, hasInitializedColorScheme]);

  const handleToggleColorScheme = useCallback(() => {
    if (isIconSwitching) return;
    const targetScheme: 'light' | 'dark' = colorScheme === 'dark' ? 'light' : 'dark';
    setIsIconSwitching(true);
    toggleColorScheme();
    // Keep the label/icon hidden until the root scheme actually updates.
    // This prevents a brief flash where stale text/icon becomes visible mid-transition.
    endIconSwitchingWhenReady(targetScheme);
  }, [colorScheme, endIconSwitchingWhenReady, isIconSwitching, toggleColorScheme]);

  if (!raw) return null;

  const navItems = normalizeNav((raw as any)?.header_nav);
  const buttons = normalizeButtons((raw as any)?.header_buttons);
  const logo = (raw as any)?.header_logo;
  const logoDark = (raw as any)?.header_logo_dark;
  const isLight = Boolean((raw as any)?.header_light);

  if (!navItems.length && !buttons.length && !logo && !logoDark) return null;

  const nextScheme = colorScheme === 'dark' ? 'light' : 'dark';

  const logoSrc = typeof logo?.filename === 'string' ? logo.filename : undefined;
  const logoAlt = typeof logo?.alt === 'string' ? logo.alt : undefined;

  const logoDarkSrc = typeof logoDark?.filename === 'string' ? logoDark.filename : undefined;
  const logoDarkAlt = typeof logoDark?.alt === 'string' ? logoDark.alt : undefined;

  const isDefaultBrandLogo = Boolean(logoSrc && /andrew-caperton-avatar\.svg(\?.*)?$/i.test(logoSrc));

  const resolvedLogoSrc =
    colorScheme === 'dark'
      ? logoDarkSrc || (isDefaultBrandLogo ? '/assets/logos/andrew-caperton-avatar.svg' : logoSrc)
      : isDefaultBrandLogo
        ? '/assets/logos/andrew-caperton-avatar.svg'
        : logoSrc;

  const resolvedLogoAlt = (colorScheme === 'dark' ? logoDarkAlt : undefined) || logoAlt;

  return (
    <header className={classNames(styles.header, isLight && styles.isLight)}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          {resolvedLogoSrc ? (
            <span className={styles.logo}>
              <Image src={resolvedLogoSrc} alt={resolvedLogoAlt || 'Logo'} width={140} height={38} priority />
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
            onClick={handleToggleColorScheme}
            aria-label={hasInitializedColorScheme ? `Switch to ${nextScheme} mode` : 'Toggle color scheme'}
            title={hasInitializedColorScheme ? `Switch to ${nextScheme} mode` : 'Toggle color scheme'}
          >
            <span
              className={styles.themeIconStack}
              data-ready={hasInitializedColorScheme ? 'true' : 'false'}
              data-switching={isIconSwitching ? 'true' : 'false'}
              data-scheme={colorScheme}
            >
              <AutoThemeIcon className={classNames(styles.themeIcon, styles.themeIconAuto)} />
              <SunIcon className={classNames(styles.themeIcon, styles.themeIconFinal, styles.themeIconSun)} />
              <MoonIcon className={classNames(styles.themeIcon, styles.themeIconFinal, styles.themeIconMoon)} />
            </span>
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
            <Link href="/" className={styles.logoLink} aria-label="Go to homepage" onClick={mobileMenu.close}>
              <span className={styles.drawerSrTitle}>Menu</span>
              <span className={styles.drawerBrand}>
                <Image src={resolvedLogoSrc} alt={resolvedLogoAlt || 'Logo'} width={140} height={38} priority />
              </span>
            </Link>
          ) : (
            <span className={styles.drawerSrTitle}>Menu</span>
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
            onClick={handleToggleColorScheme}
            aria-label={hasInitializedColorScheme ? `Switch to ${nextScheme} mode` : 'Toggle color scheme'}
          >
            <span
              className={styles.themeIconStack}
              data-ready={hasInitializedColorScheme ? 'true' : 'false'}
              data-switching={isIconSwitching ? 'true' : 'false'}
              data-scheme={colorScheme}
            >
              <AutoThemeIcon className={classNames(styles.themeIcon, styles.themeIconAuto)} />
              <SunIcon className={classNames(styles.themeIcon, styles.themeIconFinal, styles.themeIconSun)} />
              <MoonIcon className={classNames(styles.themeIcon, styles.themeIconFinal, styles.themeIconMoon)} />
            </span>
            <span className={styles.drawerThemeToggleLabel}>
              {displayedScheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
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
