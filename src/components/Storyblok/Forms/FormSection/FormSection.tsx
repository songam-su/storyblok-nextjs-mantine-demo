'use client';

import Button from '@/components/Storyblok/Button/Button';
import SectionHeader, { hasSectionHeaderContent } from '@/components/Storyblok/SectionHeader/SectionHeader';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type { FormSection as FormSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { Button as MantineButton, Paper, Stack, Text, TextInput, Textarea } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import { useCallback } from 'react';
import styles from './FormSection.module.scss';

const FormSection = ({ blok }: SbComponentProps<FormSectionBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;

  const formType = blok.form ?? 'contact';
  const hasButtons = Array.isArray(blok.button) && blok.button.length > 0;

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder submit handler: wire up to API when available
  }, []);

  const renderButtons = () => {
    if (hasButtons) {
      return (
        <Stack gap="xs">
          {blok.button!.map((btn) => {
            if (!btn) return null;
            return (
              <Button
                key={btn._uid}
                blok={btn}
                _uid={btn._uid}
                component={btn.component}
                storyblokEditable={isEditor ? storyblokEditable(btn as any) : undefined}
              />
            );
          })}
        </Stack>
      );
    }

    // Fallback button to keep the form actionable
    return (
      <MantineButton type="submit" variant="filled">
        Submit
      </MantineButton>
    );
  };

  const renderFields = () => {
    if (formType === 'newsletter') {
      return (
        <Stack gap="md">
          <TextInput label="Email" type="email" name="email" required placeholder="you@example.com" />
          {renderButtons()}
        </Stack>
      );
    }

    // Default contact form
    return (
      <Stack gap="md">
        <TextInput label="Name" name="name" required placeholder="Your name" />
        <TextInput label="Email" type="email" name="email" required placeholder="you@example.com" />
        <Textarea label="Message" name="message" minRows={4} placeholder="How can we help?" />
        {renderButtons()}
      </Stack>
    );
  };

  const hasHeader = hasSectionHeaderContent(blok.headline, undefined);

  return (
    <section className={styles.section} {...editable}>
      <Stack className={styles.wrapper} gap="var(--sb-section-stack-gap)">
        {hasHeader && <SectionHeader headline={blok.headline} />}

        <Paper className={styles.formCard} withBorder={false} shadow="sm" component="form" onSubmit={handleSubmit}>
          <Stack gap="md">
            <Text c="dimmed" size="sm">
              {formType === 'newsletter' ? 'Subscribe to stay updated.' : 'Send us a note and we will get back to you.'}
            </Text>
            {renderFields()}
          </Stack>
        </Paper>
      </Stack>
    </section>
  );
};

export default FormSection;
