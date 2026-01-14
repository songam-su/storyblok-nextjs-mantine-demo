'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';

function isModifiedClick(event: MouseEvent): boolean {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

export default function DisableNavigationInVisualEditor() {
  const { isVisualEditor } = useStoryblokEditor();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isPreviewBrowsing = pathname ? pathname.toLowerCase().startsWith('/sb-preview') : false;

    if (!isVisualEditor && !isPreviewBrowsing) return;

    const onClickCapture = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return; // left-click only
      if (isModifiedClick(event)) return;

      const target = event.target as Element | null;
      if (!target) return;

      const anchor = target.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;

      // Let the browser handle new-tab/window, downloads, etc.
      if (anchor.target && anchor.target !== '_self') return;
      if (anchor.hasAttribute('download')) return;

      // Allow explicit opt-out.
      if (anchor.closest('[data-allow-navigation="true"]')) return;

      const href = anchor.getAttribute('href') ?? '';
      if (!href) return;

      // Ignore non-navigational / special links.
      if (href.startsWith('#')) return;
      if (/^(mailto:|tel:|sms:|javascript:)/i.test(href)) return;

      // Prevent navigating away inside the Storyblok iframe.
      if (isVisualEditor) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      // Outside of the Visual Editor: keep navigation inside /sb-preview/*
      // so users can browse draft content without jumping to published routes.
      if (!isPreviewBrowsing) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) return;

      const normalizedPathname = url.pathname.toLowerCase();
      if (normalizedPathname.startsWith('/sb-preview')) return;

      const nextPathname = normalizedPathname === '/' ? '/sb-preview/home' : `/sb-preview${normalizedPathname}`;
      const nextHref = `${nextPathname}${url.search}${url.hash}`;

      event.preventDefault();
      event.stopPropagation();
      router.push(nextHref);
    };

    document.addEventListener('click', onClickCapture, { capture: true });

    return () => {
      document.removeEventListener('click', onClickCapture, { capture: true } as any);
    };
  }, [isVisualEditor, pathname, router]);

  return null;
}
