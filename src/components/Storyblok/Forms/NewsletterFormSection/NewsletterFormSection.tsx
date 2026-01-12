'use client';

import SectionHeader, { hasSectionHeaderContent } from '@/components/Storyblok/SectionHeader/SectionHeader';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type { NewsletterFormSection as NewsletterFormSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import {
  getStoryblokColorClass,
  getStoryblokTextColorClass,
} from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { Button as MantineButton, Text, TextInput } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import { useCallback } from 'react';
import styles from './NewsletterFormSection.module.scss';

const NewsletterFormSection = ({ blok }: SbComponentProps<NewsletterFormSectionBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;

  const primaryButton = Array.isArray(blok.button) ? blok.button.find(Boolean) : undefined;
  const submitLabel =
    typeof primaryButton?.label === 'string' && primaryButton.label.trim() ? primaryButton.label : 'Subscribe';
  const submitBgKey = typeof primaryButton?.background_color === 'string' ? primaryButton.background_color : undefined;
  const submitTextKey = typeof primaryButton?.text_color === 'string' ? primaryButton.text_color : undefined;

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Placeholder submit handler: wire up to API when available
  }, []);

  const hasHeader = hasSectionHeaderContent(blok.headline, blok.lead);

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

            <Text className={styles.helper} size="sm">
              Get instant updates in your inbox.
            </Text>
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
            />

            <MantineButton
              type="submit"
              className={classNames(
                styles.submitButton,
                submitBgKey ? getStoryblokColorClass(submitBgKey) : undefined,
                submitTextKey ? getStoryblokTextColorClass(submitTextKey) : undefined
              )}
            >
              {submitLabel}
            </MantineButton>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewsletterFormSection;
