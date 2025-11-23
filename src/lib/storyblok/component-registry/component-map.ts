import { FC } from 'react';
import type { StoryblokBlok } from './generated-union';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import SbBanner from '@/components/Storyblok/SbBanner/SbBanner';
import SbButton from '@/components/Storyblok/SbButton/SbButton';

// Strict type for the static map
export type StoryblokComponentMapStrict = {
  [K in StoryblokBlok['component']]: FC<SbComponentProps<Extract<StoryblokBlok, { component: K }>>>;
};

// Simplified version for development (where components have not been created yet for all types)
// export type StoryblokComponentMap = {
//   [key: string]: FC<any>; // Simplify here
// };

// function createStoryblokComponentMap<T extends StoryblokComponentMap>(map: T): T {
//   return map;
// }

// export const Placeholder: FC<any> = () => null;

// Factory to enforce type safety
function createStoryblokComponentMap<T extends StoryblokComponentMapStrict>(map: T): T {
  return map;
}

// Placeholder for unimplemented components
export const Placeholder: FC<any> = () => null;

export const components = createStoryblokComponentMap({
  banner: SbBanner,
  button: SbButton,
  'article-overview-page': Placeholder,
  'article-page': Placeholder,
  'banner-reference': Placeholder,
  category: Placeholder,
  'contact-form-section': Placeholder,
  'default-page': Placeholder,
  'faq-entry': Placeholder,
  'faq-section': Placeholder,
  'featured-articles-section': Placeholder,
  'form-section': Placeholder,
  'grid-card': Placeholder,
  'grid-section': Placeholder,
  'headline-segment': Placeholder,
  'hero-section': Placeholder,
  'image-card': Placeholder,
  'image-text-section': Placeholder,
  'latest-articles-section': Placeholder,
  'logo-section': Placeholder,
  'nav-item': Placeholder,
  'newsletter-form-section': Placeholder,
  'personalized-section': Placeholder,
  'price-card': Placeholder,
  'products-section': Placeholder,
  'richtext-youtube': Placeholder,
  'site-config': Placeholder,
  'tabbed-content-entry': Placeholder,
  'tabbed-content-section': Placeholder,
  testimonial: Placeholder,
  'testimonials-section': Placeholder,
  'text-section': Placeholder,
  'two-columns-section': Placeholder,
});
