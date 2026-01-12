'use client';

import SectionHeader, { hasSectionHeaderContent } from '@/components/Storyblok/SectionHeader/SectionHeader';
import Testimonial from '@/components/Storyblok/Testimonial/Testimonial';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type {
  Testimonial as TestimonialBlok,
  TestimonialsSection as TestimonialsSectionBlok,
} from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { SimpleGrid, Stack } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import styles from './TestimonialsSection.module.scss';

function normalizeTestimonials(testimonials: TestimonialsSectionBlok['testimonials']) {
  if (!Array.isArray(testimonials)) return [] as TestimonialBlok[];

  return testimonials
    .map((entry) => {
      const story = (entry as any)?.content as TestimonialBlok | undefined;
      return story && story.component === 'testimonial' ? story : null;
    })
    .filter(Boolean) as TestimonialBlok[];
}

const TestimonialsSection = ({ blok }: SbComponentProps<TestimonialsSectionBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;

  const testimonials = normalizeTestimonials(blok.testimonials);
  const hasHeader = hasSectionHeaderContent(blok.headline, blok.lead);
  const hasTestimonials = testimonials.length > 0;

  if (!hasHeader && !hasTestimonials) return null;

  return (
    <section className={styles.section} {...editable}>
      <Stack className={styles.inner} gap="var(--sb-section-stack-gap)">
        {hasHeader && (
          <SectionHeader headline={blok.headline} lead={blok.lead} align="center" className={styles.header} />
        )}

        {hasTestimonials && (
          <SimpleGrid
            className={styles.grid}
            cols={{ base: 1, sm: 2, lg: 3 }}
            spacing="lg"
            verticalSpacing="xl"
            mx={{ base: 0, md: '4rem', lg: 0 }}
          >
            {testimonials.map((testimonial) => (
              <Testimonial key={testimonial._uid} blok={testimonial} _uid={testimonial._uid} component="testimonial" />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </section>
  );
};

export default TestimonialsSection;
