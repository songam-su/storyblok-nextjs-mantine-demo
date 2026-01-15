'use client';

import Button from '@/components/Storyblok/Button/Button';
import SectionHeader, { hasSectionHeaderContent } from '@/components/Storyblok/SectionHeader/SectionHeader';
import { DEMO_FORM_DISABLED_MESSAGE, DISABLE_FORM_SUBMIT } from '@/lib/site/demoFlags';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type { FormSection as FormSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { Button as MantineButton, Paper, Select, Stack, Text, TextInput, Textarea } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import { useCallback, useState } from 'react';
import styles from './FormSection.module.scss';

const CONTACT_INTENT_OPTIONS = [
  'Hire you for a project',
  'Discuss a full-time role',
  'Get consultation or advice',
  'Explore collaboration',
  'Connect for networking',
  'Other',
] as const;

const FormSection = ({ blok }: SbComponentProps<FormSectionBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;

  const formType = blok.form ?? 'contact';
  const hasButtons = Array.isArray(blok.button) && blok.button.length > 0;

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (DISABLE_FORM_SUBMIT) {
        setStatus('error');
        setErrorMessage(DEMO_FORM_DISABLED_MESSAGE);
        return;
      }

      setStatus('submitting');
      setErrorMessage(null);

      const form = event.currentTarget;
      const data = new FormData(form);

      const endpoint = formType === 'newsletter' ? '/api/forms/newsletter' : '/api/forms/contact';
      const payload =
        formType === 'newsletter'
          ? { email: String(data.get('email') ?? '').trim() }
          : {
              name: String(data.get('name') ?? '').trim(),
              email: String(data.get('email') ?? '').trim(),
              intent: String(data.get('intent') ?? '').trim(),
              message: String(data.get('message') ?? '').trim(),
            };

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as { message?: string; error?: string } | null;
          throw new Error(body?.message || body?.error || `Request failed (${res.status})`);
        }

        form.reset();
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
      }
    },
    [formType]
  );

  const isSubmitting = status === 'submitting';

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
      <MantineButton
        type="submit"
        variant="filled"
        disabled={DISABLE_FORM_SUBMIT || isSubmitting}
        loading={isSubmitting}
      >
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
        <Select
          label="I’d like to…"
          name="intent"
          placeholder="Select an option"
          data={[...CONTACT_INTENT_OPTIONS]}
          classNames={{
            dropdown: styles.contactSelectDropdown,
            options: styles.contactSelectOptions,
            option: styles.contactSelectOption,
          }}
          required
          disabled={isSubmitting}
        />
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
            {status === 'success' ? (
              <Text c="dimmed" size="sm" role="status">
                {formType === 'newsletter' ? 'Thanks — we received your email.' : 'Thanks — your message was sent.'}
              </Text>
            ) : null}
            {status === 'error' ? (
              <Text c="dimmed" size="sm" role="alert">
                {errorMessage || 'Unable to submit right now. Please try again.'}
              </Text>
            ) : null}
            {renderFields()}
          </Stack>
        </Paper>
      </Stack>
    </section>
  );
};

export default FormSection;
