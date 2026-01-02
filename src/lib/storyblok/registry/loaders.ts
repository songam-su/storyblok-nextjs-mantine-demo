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
  banner: () => import('@/components/Storyblok/Banner/Banner'),
  button: () => import('@/components/Storyblok/Button/Button'),
  'faq-entry': () => import('@/components/Storyblok/FaqEntry/FaqEntry'),
  'faq-section': () => import('@/components/Storyblok/FaqSection/FaqSection'),
  'logo-section': () => import('@/components/Storyblok/LogoSection/LogoSection'),
  'headline-segment': () => import('@/components/Storyblok/HeadlineSegment/HeadlineSegment'),
  'hero-section': () => import('@/components/Storyblok/HeroSection/HeroSection'),
  'grid-section': () => import('@/components/Storyblok/GridSection/GridSection'),
  'grid-card': () => import('@/components/Storyblok/GridCard/GridCard'),
  'text-section': () => import('@/components/Storyblok/TextSection/TextSection'),
  'two-columns-section': () => import('@/components/Storyblok/TwoColumnsSection/TwoColumnsSection'),
  'image-text-section': () => import('@/components/Storyblok/ImageTextSection/ImageTextSection'),
  'nav-item': () => import('@/components/Storyblok/NavItem/NavItem'),

  // Components not implemented yet → fallback to placeholder
  'article-overview-page': fallback,
  'article-page': fallback,
  'banner-reference': fallback,
  category: fallback,
  'contact-form-section': fallback,
  'featured-articles-section': fallback,
  'form-section': fallback,
  'image-card': fallback,
  'latest-articles-section': fallback,
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
} satisfies StoryblokComponentRegistry;
