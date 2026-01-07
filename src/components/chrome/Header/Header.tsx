'use client';

import Image from 'next/image';
import classNames from 'classnames';
import { Burger, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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
  const [mobileMenuOpened, mobileMenu] = useDisclosure(false);

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
          logo?.filename ? (
            <span className={styles.drawerBrand}>
              <Image src={logo.filename} alt={logo.alt || 'Logo'} width={140} height={38} />
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
        {navItems.length ? (
          <nav className={styles.mobileNav} aria-label="Mobile navigation">
            <div className={styles.mobileNavList} onClick={mobileMenu.close}>
              {navItems.map((item) => (
                <NavItem key={item._uid} blok={{ ...item, component: 'nav-item' }} _uid={item._uid} component="nav-item" />
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
