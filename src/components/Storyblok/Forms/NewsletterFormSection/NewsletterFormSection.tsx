'use client';

import SectionHeader, { hasSectionHeaderContent } from '@/components/Storyblok/SectionHeader/SectionHeader';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type { NewsletterFormSection as NewsletterFormSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import { getStoryblokColorClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { CloseButton, Button as MantineButton, Text, TextInput } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import styles from './NewsletterFormSection.module.scss';

const NewsletterFormSection = ({ blok }: SbComponentProps<NewsletterFormSectionBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const clearEmail = () => setEmail('');

  const primaryButton = Array.isArray(blok.button) ? blok.button.find(Boolean) : undefined;
  const submitLabel =
    typeof primaryButton?.label === 'string' && primaryButton.label.trim() ? primaryButton.label : 'Subscribe';
  const submitBgKey = typeof primaryButton?.background_color === 'string' ? primaryButton.background_color : undefined;

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!email.trim()) return;

      setStatus('submitting');
      setErrorMessage(null);

      try {
        const res = await fetch('/api/forms/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as { message?: string; error?: string } | null;
          throw new Error(data?.message || data?.error || `Request failed (${res.status})`);
        }

        clearEmail();
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
      }
    },
    [email]
  );

  const hasHeader = hasSectionHeaderContent(blok.headline, blok.lead);
  const isSubmitting = status === 'submitting';

  return (
    <section className={classNames('edge-to-edge', styles.section)} {...editable}>
      <div className={styles.wrapper}>
        <form className={styles.banner} onSubmit={handleSubmit} data-lpignore="true" data-1p-ignore="true">
          <div className={styles.content}>
            {hasHeader && (
              <SectionHeader
                headline={blok.headline}
                lead={typeof blok.lead === 'string' ? blok.lead : undefined}
                align="center"
                titleOrder={3}
                titleSize="h2"
                className={styles.header}
              />
            )}

            <Text className={styles.helper}>Get instant updates in your inbox.</Text>
          </div>

          <div className={styles.formRow}>
            <TextInput
              className={styles.emailField}
              classNames={{
                label: styles.emailLabel,
                input: styles.emailInput,
              }}
              label="Email"
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              autoComplete="email"
              data-lpignore="true"
              data-1p-ignore="true"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              disabled={isSubmitting}
              rightSection={
                <div className={styles.emailRightSection}>
                  {email ? (
                    <CloseButton
                      variant="transparent"
                      aria-label="Clear email"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={clearEmail}
                      disabled={isSubmitting}
                    />
                  ) : null}
                </div>
              }
              rightSectionPointerEvents="all"
              rightSectionWidth="calc(3.125rem * var(--mantine-scale))"
            />

            <MantineButton
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              className={classNames(styles.submitButton, submitBgKey ? getStoryblokColorClass(submitBgKey) : undefined)}
            >
              {submitLabel}
            </MantineButton>
          </div>

          {status === 'success' ? (
            <Text className={styles.helper} role="status">
              Thanks — we received your request.
            </Text>
          ) : null}

          {status === 'error' ? (
            <Text className={styles.helper} role="alert">
              {errorMessage || 'Unable to submit right now. Please try again.'}
            </Text>
          ) : null}
        </form>
      </div>
    </section>
  );
};

export default NewsletterFormSection;
