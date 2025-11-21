import {StoryblokStory} from 'storyblok-generate-ts'

export interface ArticleOverviewPageStoryblok {
  meta_title?: string;
  meta_description?: string;
  headline?: string;
  _uid: string;
  component: "article-overview-page";
  [k: string]: any;
}

export interface AssetStoryblok {
  _uid?: string;
  id: number | null;
  alt: string | null;
  name: string;
  focus: string | null;
  source: string | null;
  title: string | null;
  filename: string;
  copyright: string | null;
  fieldtype?: string;
  meta_data?: null | {
    [k: string]: any;
  };
  is_external_url?: boolean;
  [k: string]: any;
}

export interface RichtextStoryblok {
  type: string;
  content?: RichtextStoryblok[];
  marks?: RichtextStoryblok[];
  attrs?: any;
  text?: string;
  [k: string]: any;
}

export interface ArticlePageStoryblok {
  headline?: string;
  image?: AssetStoryblok;
  text?: RichtextStoryblok;
  call_to_action?: (StoryblokStory<BannerStoryblok> | string)[];
  categories?: (StoryblokStory<CategoryStoryblok> | string)[];
  meta_title?: string;
  meta_description?: string;
  _uid: string;
  component: "article-page";
  [k: string]: any;
}

export interface BannerStoryblok {
  background_image?: AssetStoryblok;
  background_image_cover: boolean;
  background_image_alignment?: "left" | "center" | "right";
  background_image_width?: "100" | "75" | "50";
  background_video?: AssetStoryblok;
  background_color?: number | string;
  headline?: HeadlineSegmentStoryblok[];
  lead?: string;
  buttons?: ButtonStoryblok[];
  text_alignment?: "center" | "left";
  _uid: string;
  component: "banner";
  [k: string]: any;
}

export interface BannerReferenceStoryblok {
  banners?: (StoryblokStory<BannerStoryblok> | string)[];
  _uid: string;
  component: "banner-reference";
  [k: string]: any;
}

export type MultilinkStoryblok =
  | {
      id?: string;
      cached_url?: string;
      anchor?: string;
      linktype?: "story";
      target?: "_self" | "_blank";
      [k: string]: any;
    }
  | {
      url?: string;
      cached_url?: string;
      anchor?: string;
      linktype?: "asset" | "url";
      target?: "_self" | "_blank";
      [k: string]: any;
    }
  | {
      email?: string;
      linktype?: "email";
      target?: "_self" | "_blank";
      [k: string]: any;
    };

export interface ButtonStoryblok {
  style?: "default" | "ghost";
  background_color?: number | string;
  text_color?: "white" | "primary-dark";
  size?: "small" | "medium" | "large";
  link: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  label?: string;
  _uid: string;
  component: "button";
  [k: string]: any;
}

export interface CategoryStoryblok {
  headline?: string;
  icon?: AssetStoryblok;
  meta_title?: string;
  meta_description?: string;
  _uid: string;
  component: "category";
  [k: string]: any;
}

export interface ContactFormSectionStoryblok {
  headline?: HeadlineSegmentStoryblok[];
  text?: RichtextStoryblok;
  button?: ButtonStoryblok[];
  image?: AssetStoryblok;
  quote?: string;
  name?: string;
  position?: string;
  _uid: string;
  component: "contact-form-section";
  [k: string]: any;
}

export interface DefaultPageStoryblok {
  meta_title?: string;
  meta_description?: string;
  body?: (
    | BannerStoryblok
    | BannerReferenceStoryblok
    | FaqSectionStoryblok
    | FeaturedArticlesSectionStoryblok
    | FormSectionStoryblok
    | GridSectionStoryblok
    | HeroSectionStoryblok
    | ImageTextSectionStoryblok
    | LatestArticlesSectionStoryblok
    | LogoSectionStoryblok
    | PersonalizedSectionStoryblok
    | ProductsSectionStoryblok
    | TabbedContentSectionStoryblok
    | TestimonialsSectionStoryblok
    | TextSectionStoryblok
    | TwoColumnsSectionStoryblok
  )[];
  _uid: string;
  component: "default-page";
  [k: string]: any;
}

export interface FaqEntryStoryblok {
  question?: string;
  answer?: RichtextStoryblok;
  _uid: string;
  component: "faq-entry";
  [k: string]: any;
}

export interface FaqSectionStoryblok {
  headline?: HeadlineSegmentStoryblok[];
  lead?: string;
  faq_entries?: FaqEntryStoryblok[];
  _uid: string;
  component: "faq-section";
  [k: string]: any;
}

export interface FeaturedArticlesSectionStoryblok {
  headline?: HeadlineSegmentStoryblok[];
  lead?: string;
  articles?: (StoryblokStory<ArticlePageStoryblok> | string)[];
  cols?: "2" | "3" | "4";
  background_color?: number | string;
  _uid: string;
  component: "featured-articles-section";
  [k: string]: any;
}

export interface FormSectionStoryblok {
  headline?: HeadlineSegmentStoryblok[];
  form?: "contact" | "newsletter";
  button?: ButtonStoryblok[];
  _uid: string;
  component: "form-section";
  [k: string]: any;
}

export interface GridCardStoryblok {
  bold_text?: string;
  label?: string;
  text?: string;
  button?: ButtonStoryblok[];
  row_span?: "1" | "2";
  border: boolean;
  background_image?: AssetStoryblok;
  icon_width?: "48" | "80" | "160" | "200";
  icon?: AssetStoryblok;
  _uid: string;
  component: "grid-card";
  [k: string]: any;
}

export interface GridSectionStoryblok {
  cards?: (GridCardStoryblok | PriceCardStoryblok | ImageCardStoryblok)[];
  cols?: "2" | "3" | "4";
  headline?: HeadlineSegmentStoryblok[];
  lead?: string;
  background_color?: number | string;
  button?: ButtonStoryblok[];
  _uid: string;
  component: "grid-section";
  [k: string]: any;
}

export interface HeadlineSegmentStoryblok {
  text?: string;
  highlight?: "none" | "color_1" | "color_2" | "color_3";
  _uid: string;
  component: "headline-segment";
  [k: string]: any;
}

export interface HeroSectionStoryblok {
  layout?: "stacked" | "split";
  background_color?: number | string;
  secondary_background_color?:
    | ""
    | "medium"
    | '["#E4DDB9", "#A59441", "#9D86F7", "#8D60FF", "#F5F5F7", "#FFFFFF"]'
    | "#A59441";
  text_alignment?: "left" | "center";
  image_decoration: boolean;
  eyebrow?: string;
  headline?: HeadlineSegmentStoryblok[];
  text?: string;
  buttons?: ButtonStoryblok[];
  image?: AssetStoryblok;
  preserve_image_aspect_ratio: boolean;
  _uid: string;
  component: "hero-section";
  [k: string]: any;
}

export interface ImageCardStoryblok {
  image?: AssetStoryblok;
  label?: string;
  text?: string;
  background_color?: "" | "medium" | "#fbe8d5" | '["#d8d4f9", "#fbe8d5", "#e9e8d2", "#e3f0d5", "#f8d7d4", "#d9e4f1"]';
  _uid: string;
  component: "image-card";
  [k: string]: any;
}

export interface ImageTextSectionStoryblok {
  background_color?: number | string;
  reverse_mobile_layout: boolean;
  reverse_desktop_layout: boolean;
  eyebrow?: string;
  headline?: HeadlineSegmentStoryblok[];
  text?: RichtextStoryblok;
  buttons?: ButtonStoryblok[];
  image?: AssetStoryblok;
  preserve_image_aspect_ratio: boolean;
  _uid: string;
  component: "image-text-section";
  [k: string]: any;
}

export interface LatestArticlesSectionStoryblok {
  headline?: HeadlineSegmentStoryblok[];
  lead?: string;
  _uid: string;
  component: "latest-articles-section";
  [k: string]: any;
}

export type MultiassetStoryblok = {
  alt?: string;
  copyright?: string;
  id: number;
  filename: string;
  name: string;
  title?: string;
  [k: string]: any;
}[];

export interface LogoSectionStoryblok {
  lead?: string;
  logos?: MultiassetStoryblok;
  _uid: string;
  component: "logo-section";
  [k: string]: any;
}

export interface NavItemStoryblok {
  link: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  label?: string;
  _uid: string;
  component: "nav-item";
  [k: string]: any;
}

export interface NewsletterFormSectionStoryblok {
  headline?: HeadlineSegmentStoryblok[];
  button?: ButtonStoryblok[];
  _uid: string;
  component: "newsletter-form-section";
  [k: string]: any;
}

export interface PersonalizedSectionStoryblok {
  preview?: "new_visitor" | "returning_visitor";
  returning_visitor?: any;
  returning_visitor_blocks?: (
    | BannerStoryblok
    | BannerReferenceStoryblok
    | FaqSectionStoryblok
    | FeaturedArticlesSectionStoryblok
    | FormSectionStoryblok
    | GridSectionStoryblok
    | HeroSectionStoryblok
    | ImageTextSectionStoryblok
    | LatestArticlesSectionStoryblok
    | LogoSectionStoryblok
    | PersonalizedSectionStoryblok
    | ProductsSectionStoryblok
    | TabbedContentSectionStoryblok
    | TestimonialsSectionStoryblok
    | TextSectionStoryblok
    | TwoColumnsSectionStoryblok
  )[];
  new_visitor?: any;
  new_visitor_blocks?: (
    | BannerStoryblok
    | BannerReferenceStoryblok
    | FaqSectionStoryblok
    | FeaturedArticlesSectionStoryblok
    | FormSectionStoryblok
    | GridSectionStoryblok
    | HeroSectionStoryblok
    | ImageTextSectionStoryblok
    | LatestArticlesSectionStoryblok
    | LogoSectionStoryblok
    | PersonalizedSectionStoryblok
    | ProductsSectionStoryblok
    | TabbedContentSectionStoryblok
    | TestimonialsSectionStoryblok
    | TextSectionStoryblok
    | TwoColumnsSectionStoryblok
  )[];
  _uid: string;
  component: "personalized-section";
  [k: string]: any;
}

export interface PriceCardStoryblok {
  most_popular: boolean;
  headline?: string;
  text_1?: RichtextStoryblok;
  price?: string;
  button?: ButtonStoryblok[];
  text_2?: RichtextStoryblok;
  _uid: string;
  component: "price-card";
  [k: string]: any;
}

export interface ProductsSectionStoryblok {
  headline?: HeadlineSegmentStoryblok[];
  lead?: string;
  _uid: string;
  component: "products-section";
  [k: string]: any;
}

export interface RichtextYoutubeStoryblok {
  video_id?: string;
  _uid: string;
  component: "richtext-youtube";
  [k: string]: any;
}

export interface SiteConfigStoryblok {
  header_light: boolean;
  disable_rounded_corners: boolean;
  footer_light: boolean;
  footer_decoration: boolean;
  use_custom_colors: boolean;
  colors?: any;
  colored_headlines: boolean;
  use_custom_fonts: boolean;
  custom_font_display?: number | string;
  custom_font_body?: number | string;
  x?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  footer_headline?: HeadlineSegmentStoryblok[];
  footer_about?: RichtextStoryblok;
  footer_nav_1_headline?: string;
  footer_nav_1?: NavItemStoryblok[];
  footer_nav_2_headline?: string;
  footer_nav_2?: NavItemStoryblok[];
  footer_nav_3_headline?: string;
  footer_nav_3?: NavItemStoryblok[];
  header_logo?: AssetStoryblok;
  header_nav?: NavItemStoryblok[];
  header_buttons?: ButtonStoryblok[];
  instagram?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  youtube?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  facebook?: Exclude<MultilinkStoryblok, {linktype?: "email"} | {linktype?: "asset"}>;
  _uid: string;
  component: "site-config";
  [k: string]: any;
}

export interface TabbedContentEntryStoryblok {
  image?: AssetStoryblok;
  headline?: string;
  description?: RichtextStoryblok;
  button?: ButtonStoryblok[];
  _uid: string;
  component: "tabbed-content-entry";
  [k: string]: any;
}

export interface TabbedContentSectionStoryblok {
  headline?: HeadlineSegmentStoryblok[];
  lead?: string;
  entries?: TabbedContentEntryStoryblok[];
  _uid: string;
  component: "tabbed-content-section";
  [k: string]: any;
}

export interface TestimonialStoryblok {
  quote?: string;
  photo?: AssetStoryblok;
  name?: string;
  role?: string;
  _uid: string;
  component: "testimonial";
  [k: string]: any;
}

export interface TestimonialsSectionStoryblok {
  headline?: HeadlineSegmentStoryblok[];
  lead?: string;
  testimonials?: (StoryblokStory<TestimonialStoryblok> | StoryblokStory<TestimonialStoryblok> | string)[];
  _uid: string;
  component: "testimonials-section";
  [k: string]: any;
}

export interface TextSectionStoryblok {
  eyebrow?: string;
  text_alignment?: "left" | "center";
  headline?: HeadlineSegmentStoryblok[];
  text?: RichtextStoryblok;
  buttons?: ButtonStoryblok[];
  background_color?: number | string;
  _uid: string;
  component: "text-section";
  [k: string]: any;
}

export interface TwoColumnsSectionStoryblok {
  column_1_headline?: HeadlineSegmentStoryblok[];
  column_1_text_1?: RichtextStoryblok;
  column_1_text_2?: RichtextStoryblok;
  column_1_button?: ButtonStoryblok[];
  column_1_image?: AssetStoryblok;
  column_1_background_color?: "" | "medium" | "#BCE2FF" | '["#f4f2ea", "#d8d4f9", "#BCE2FF"]';
  column_2_headline?: HeadlineSegmentStoryblok[];
  column_2_text_1?: RichtextStoryblok;
  column_2_button?: ButtonStoryblok[];
  column_2_background_color?: "" | "medium" | "#d8d4f9" | '["#f4f2ea", "#d8d4f9", "#BCE2FF"]';
  column_1_decoration_color?: "" | "medium" | "#71b3f9" | '["#dfdbbb", "#9987f0", "#71b3f9"]';
  column_2_decoration_color?: "" | "medium" | "#9987f0" | '["#dfdbbb", "#9987f0", "#71b3f9"]';
  _uid: string;
  component: "two-columns-section";
  [k: string]: any;
}
