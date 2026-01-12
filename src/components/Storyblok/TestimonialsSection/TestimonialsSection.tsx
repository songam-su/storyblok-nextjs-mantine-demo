'use client';

import Testimonial from '@/components/Storyblok/Testimonial/Testimonial';
import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type {
  Testimonial as TestimonialBlok,
  TestimonialsSection as TestimonialsSectionBlok,
} from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { SimpleGrid, Stack, Text, Title } from '@mantine/core';
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
  const hasHeader = Boolean(blok.headline?.length || blok.lead);
  const hasTestimonials = testimonials.length > 0;

  if (!hasHeader && !hasTestimonials) return null;

  return (
    <section className={styles.section} {...editable}>
      <div className={styles.inner}>
        <Stack gap="md" className={styles.header}>
          {blok.headline?.length ? (
            <Title order={2} fw={800} size="h2">
              {renderHeadlineSegments(blok.headline)}
            </Title>
          ) : null}

          {blok.lead && (
            <Text size="lg" className={styles.lead}>
              {blok.lead}
            </Text>
          )}
        </Stack>

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
      </div>
    </section>
  );
};

export default TestimonialsSection;
