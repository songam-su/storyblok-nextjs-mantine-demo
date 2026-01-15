'use client';

import NavItem from '@/components/Storyblok/NavItem/NavItem';
import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import { useSiteConfig } from '@/lib/storyblok/context/SiteConfigContext';
import type { HeadlineSegment, NavItem as NavItemBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import { getSbLink } from '@/lib/storyblok/utils/getSbLink';
import { renderSbRichText } from '@/lib/storyblok/utils/richtext/renderSbRichText';
import styles from './Footer.module.scss';

const normalizeNav = (items?: NavItemBlok[]) => (Array.isArray(items) ? items.filter(Boolean) : []);
const normalizeHeadline = (items?: HeadlineSegment[]) => (Array.isArray(items) ? items.filter(Boolean) : []);

const Footer = () => {
  const { config } = useSiteConfig();
  const raw = config?.raw;

  if (!raw) return null;

  const footerHeadline = normalizeHeadline((raw as any)?.footer_headline);
  const about = (raw as any)?.footer_about;

  const nav1 = normalizeNav((raw as any)?.footer_nav_1);
  const nav2 = normalizeNav((raw as any)?.footer_nav_2);
  const nav3 = normalizeNav((raw as any)?.footer_nav_3);

  const social = [
    { key: 'twitter', href: getSbLink((raw as any)?.twitter), label: 'Twitter' },
    { key: 'instagram', href: getSbLink((raw as any)?.instagram), label: 'Instagram' },
    { key: 'youtube', href: getSbLink((raw as any)?.youtube), label: 'YouTube' },
    { key: 'facebook', href: getSbLink((raw as any)?.facebook), label: 'Facebook' },
  ].filter((item) => item.href && item.href !== '#');

  if (!footerHeadline.length && !about && !nav1.length && !nav2.length && !nav3.length && !social.length) {
    return null;
  }

  const isLight = Boolean((raw as any)?.footer_light);

  return (
    <footer className={isLight ? `${styles.footer} ${styles.isLight}` : styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          {(footerHeadline.length || about) && (
            <div className={styles.content}>
              {footerHeadline.length ? (
                <div className={styles.headline}>{renderHeadlineSegments(footerHeadline)}</div>
              ) : null}
              {about ? <div className={styles.about}>{renderSbRichText(about)}</div> : null}
            </div>
          )}

          <div className={styles.navColumns}>
            {nav1.length ? (
              <div className={styles.navColumn}>
                {(raw as any)?.footer_nav_1_headline && (
                  <div className={styles.navTitle}>{(raw as any)?.footer_nav_1_headline}</div>
                )}
                <div className={styles.navList}>
                  {nav1.map((item) => (
                    <NavItem
                      key={item._uid}
                      blok={{ ...item, component: 'nav-item' }}
                      _uid={item._uid}
                      component="nav-item"
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {nav2.length ? (
              <div className={styles.navColumn}>
                {(raw as any)?.footer_nav_2_headline && (
                  <div className={styles.navTitle}>{(raw as any)?.footer_nav_2_headline}</div>
                )}
                <div className={styles.navList}>
                  {nav2.map((item) => (
                    <NavItem
                      key={item._uid}
                      blok={{ ...item, component: 'nav-item' }}
                      _uid={item._uid}
                      component="nav-item"
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {nav3.length ? (
              <div className={styles.navColumn}>
                {(raw as any)?.footer_nav_3_headline && (
                  <div className={styles.navTitle}>{(raw as any)?.footer_nav_3_headline}</div>
                )}
                <div className={styles.navList}>
                  {nav3.map((item) => (
                    <NavItem
                      key={item._uid}
                      blok={{ ...item, component: 'nav-item' }}
                      _uid={item._uid}
                      component="nav-item"
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* TODO - Fix styles for social links */}
        {/* {social.length ? (
          <div className={styles.social}>
            {social.map((entry) => (
              <Link key={entry.key} href={entry.href!} className={styles.socialLink} target="_blank" rel="noreferrer">
                {entry.label}
              </Link>
            ))}
          </div>
        ) : null} */}
      </div>
    </footer>
  );
};

export default Footer;
