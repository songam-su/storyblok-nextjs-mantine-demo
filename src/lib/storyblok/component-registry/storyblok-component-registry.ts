import { SbComponentProps } from '@/types/storyblok/SbComponentProps';

export interface StoryblokComponentRegistry {
  [key: string]: () => Promise<{
    default: React.ComponentType<SbComponentProps<any>>;
  }>;
}

const fallback = async () => ({
  default: (props: any) => null,
});

// ✅ Single source of truth for all components
export const registry: StoryblokComponentRegistry = {
  // Implemented components
  banner: () => import('@/components/Storyblok/SbBanner/SbBanner'),
  button: () => import('@/components/Storyblok/SbButton/SbButton'),

  // Components not implemented yet → fallback to placeholder
  'article-overview-page': fallback,
  'article-page': fallback,
  'banner-reference': fallback,
  category: fallback,
  'contact-form-section': fallback,
  'default-page': fallback,
  'faq-entry': fallback,
  'faq-section': fallback,
  'featured-articles-section': fallback,
  'form-section': fallback,
  'grid-card': fallback,
  'grid-section': fallback,
  'headline-segment': fallback,
  'hero-section': fallback,
  'image-card': fallback,
  'image-text-section': fallback,
  'latest-articles-section': fallback,
  'logo-section': fallback,
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
};
