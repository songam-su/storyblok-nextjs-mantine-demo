'use client';

import Button from '@/components/Storyblok/Button/Button';
import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type { NewsletterFormSection as NewsletterFormSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { Button as MantineButton, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import { useCallback } from 'react';
import styles from './NewsletterFormSection.module.scss';

const NewsletterFormSection = ({ blok }: SbComponentProps<NewsletterFormSectionBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;

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

    return (
      <MantineButton type="submit" variant="filled">
        Subscribe
      </MantineButton>
    );
  };

  const hasHeader = Boolean(blok.headline?.length || (typeof blok.lead === 'string' && blok.lead.trim().length > 0));

  return (
    <section className={styles.section} {...editable}>
      <div className={styles.wrapper}>
        {hasHeader && (
          <Stack gap="xs" className={styles.headline}>
            {blok.headline?.length ? (
              <Title order={2} size="h2" fw={800}>
                {renderHeadlineSegments(blok.headline)}
              </Title>
            ) : null}
            {typeof blok.lead === 'string' && blok.lead.trim().length > 0 && (
              <Text className={styles.lead} size="md">
                {blok.lead}
              </Text>
            )}
          </Stack>
        )}

        <Paper
          className={styles.formCard}
          withBorder={false}
          shadow="sm"
          component="form"
          onSubmit={handleSubmit}
          data-lpignore="true"
          data-1p-ignore="true"
        >
          <Stack gap="md">
            <Text className={styles.helper} size="sm">
              Get updates in your inbox.
            </Text>
            <TextInput
              className={styles.input}
              label="Email"
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
              data-lpignore="true"
              data-1p-ignore="true"
            />
            {renderButtons()}
          </Stack>
        </Paper>
      </div>
    </section>
  );
};

export default NewsletterFormSection;
