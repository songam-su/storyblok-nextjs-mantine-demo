import { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import type { StoryblokBlok } from './StoryblokBlok';

type StoryblokComponentName = StoryblokBlok['component'];
type StoryblokComponentLookup = {
  [K in StoryblokComponentName]: SbComponentProps<Extract<StoryblokBlok, { component: K }>>;
};

type TypedLoader<K extends StoryblokComponentName> = () => Promise<{
  default: React.ComponentType<StoryblokComponentLookup[K]>;
}>;

type TypedRegistry = Partial<{ [K in StoryblokComponentName]: TypedLoader<K> }>;
type UntypedRegistry = Record<string, () => Promise<{ default: React.ComponentType<SbComponentProps<any>> }>>;

export type StoryblokComponentRegistry = UntypedRegistry & TypedRegistry;

const fallback = async () => ({
  default: (props: SbComponentProps<any>) => null,
});

// ✅ Single source of truth for all components
export const registry = {
  // Implemented components
  'default-page': () => import('@/components/Storyblok/DefaultPage/DefaultPage'),
  banner: () => import('@/components/Storyblok/SbBanner/SbBanner'),
  button: () => import('@/components/Storyblok/SbButton/SbButton'),
  'faq-entry': () => import('@/components/Storyblok/FaqEntry/FaqEntry'),
  'faq-section': () => import('@/components/Storyblok/FaqSection/FaqSection'),
  'logo-section': () => import('@/components/Storyblok/LogoSection/LogoSection'),
  'headline-segment': () => import('@/components/Storyblok/HeadlineSegment/HeadlineSegment'),

  // Components not implemented yet → fallback to placeholder
  'article-overview-page': fallback,
  'article-page': fallback,
  'banner-reference': fallback,
  category: fallback,
  'contact-form-section': fallback,
  'featured-articles-section': fallback,
  'form-section': fallback,
  'grid-card': fallback,
  'grid-section': fallback,
  'hero-section': fallback,
  'image-card': fallback,
  'image-text-section': fallback,
  'latest-articles-section': fallback,
  'nav-item': fallback,
  'newsletter-form-section': fallback,
  'personalized-section': fallback,
  'price-card': fallback,
  'products-section': fallback,
  'richtext-youtube': fallback,
  'site-config': fallback,
  'tabbed-content-entry': fallback,
  'tabbed-content-section': fallback,
  testimonial: fallback,
  'testimonials-section': fallback,
  'text-section': fallback,
  'two-columns-section': fallback,
} satisfies StoryblokComponentRegistry;
