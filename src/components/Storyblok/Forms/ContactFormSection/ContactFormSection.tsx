'use client';

import { useCallback } from 'react';
import { Button as MantineButton, Paper, Stack, Text, TextInput, Textarea, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import Button from '@/components/Storyblok/Button/Button';
import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import type { ContactFormSection as ContactFormSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import styles from './ContactFormSection.module.scss';

const ContactFormSection = ({ blok }: SbComponentProps<ContactFormSectionBlok>) => {
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
        Send message
      </MantineButton>
    );
  };

  const hasHeader = Boolean(blok.headline?.length || blok.lead);

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

        <Paper className={styles.formCard} withBorder={false} shadow="sm" component="form" onSubmit={handleSubmit}>
          <Stack gap="md">
            <Text c="dimmed" size="sm">
              Tell us about your request.
            </Text>
            <TextInput label="Name" name="name" required placeholder="Your name" />
            <TextInput label="Email" type="email" name="email" required placeholder="you@example.com" />
            <TextInput label="Subject" name="subject" placeholder="How can we help?" />
            <Textarea label="Message" name="message" minRows={4} placeholder="Share a bit more detail" />
            {renderButtons()}
          </Stack>
        </Paper>
      </div>
    </section>
  );
};

export default ContactFormSection;
