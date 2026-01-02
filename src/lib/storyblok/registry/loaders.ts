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
  default: (_props: SbComponentProps<any>) => null,
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
  'article-overview-page': () => import('@/components/Storyblok/ArticleOverviewPage/ArticleOverviewPage'),
  'article-page': () => import('@/components/Storyblok/ArticlePage/ArticlePage'),
  'featured-articles-section': () => import('@/components/Storyblok/FeaturedArticlesSection/FeaturedArticlesSection'),
  'price-card': () => import('@/components/Storyblok/PriceCard/PriceCard'),
  'products-section': () => import('@/components/Storyblok/ProductsSection/ProductsSection'),
  'image-card': () => import('@/components/Storyblok/ImageCard/ImageCard'),

  // Components not implemented yet → fallback to placeholder
  'banner-reference': () => import('@/components/Storyblok/BannerReference/BannerReference'),
  category: () => import('@/components/Storyblok/Category/Category'),
  'contact-form-section': fallback,
  'form-section': fallback,
  'latest-articles-section': fallback,
  'newsletter-form-section': fallback,
  'personalized-section': fallback,
  'richtext-youtube': () => import('@/components/Storyblok/RichtextYoutube/RichtextYoutube'),
  'site-config': fallback,
  'tabbed-content-entry': fallback,
  'tabbed-content-section': fallback,
  testimonial: fallback,
  'testimonials-section': fallback,
} satisfies StoryblokComponentRegistry;
