'use client';

import Button from '@/components/Storyblok/Button/Button';
import SectionHeader, { hasSectionHeaderContent } from '@/components/Storyblok/SectionHeader/SectionHeader';
import SbImage from '@/components/ui/SbImage/SbImage';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type { ContactFormSection as ContactFormSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import { getSbLink } from '@/lib/storyblok/utils/getSbLink';
import getSbImageData from '@/lib/storyblok/utils/image';
import { renderSbRichText } from '@/lib/storyblok/utils/richtext/renderSbRichText';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { Button as MantineButton, Select, Stack, Text, TextInput, Textarea } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import styles from './ContactFormSection.module.scss';

const CONTACT_INTENT_OPTIONS = [
  'Hire you for a project',
  'Discuss a full-time role',
  'Get consultation or advice',
  'Explore collaboration',
  'Connect for networking',
  'Other',
] as const;

const ContactFormSection = ({ blok }: SbComponentProps<ContactFormSectionBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const normalizeQuote = (value?: string | null) => {
    const trimmed = typeof value === 'string' ? value.trim() : '';
    if (!trimmed) return '';

    const quotePairs: Array<[string, string]> = [
      ['“', '”'],
      ['"', '"'],
      ['‘', '’'],
      ["'", "'"],
    ];

    for (const [open, close] of quotePairs) {
      if (trimmed.startsWith(open) && trimmed.endsWith(close) && trimmed.length > open.length + close.length) {
        return trimmed.slice(open.length, -close.length).trim();
      }
    }

    return trimmed;
  };

  const hasButtons = Array.isArray(blok.button) && blok.button.length > 0;

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setErrorMessage(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      intent: String(data.get('intent') ?? '').trim(),
      subject: String(data.get('subject') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
    };

    try {
      const res = await fetch('/api/forms/contact', {
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
  }, []);

  const renderButtons = () => {
    if (hasButtons) {
      return (
        <Stack gap="xs">
          {blok.button!.map((btn) => {
            if (!btn) return null;

            const href = getSbLink(btn.link as any);
            const isNavigableLink = !isEditor && Boolean(href && href !== '#');

            return (
              <Button
                key={btn._uid}
                blok={btn}
                _uid={btn._uid}
                component={btn.component}
                storyblokEditable={isEditor ? storyblokEditable(btn as any) : undefined}
                submit={!isNavigableLink}
                disabled={isSubmitting}
                loading={!isNavigableLink && isSubmitting}
              />
            );
          })}
        </Stack>
      );
    }

    return (
      <MantineButton type="submit" variant="filled" disabled={isSubmitting} loading={isSubmitting}>
        Send message
      </MantineButton>
    );
  };

  const hasSectionHeader = hasSectionHeaderContent(blok.headline, blok.lead);
  const hasHeader = hasSectionHeader || Boolean(blok.text);

  const imageData = getSbImageData(blok.image || null);
  const hasImage = Boolean(imageData?.src);
  const quoteText = normalizeQuote(blok.quote);
  const hasQuote = quoteText.length > 0;
  const hasName = typeof blok.name === 'string' && blok.name.trim().length > 0;
  const hasPosition = typeof blok.position === 'string' && blok.position.trim().length > 0;
  const hasAttribution = hasName || hasPosition;
  const hasAside = hasImage || hasQuote || hasAttribution;

  const textInputClassNames = {
    label: styles.inputLabel,
  };

  const textareaClassNames = {
    label: styles.inputLabel,
    input: styles.textareaInput,
  };

  const intentSelectClassNames = {
    ...textInputClassNames,
    dropdown: styles.intentSelectDropdown,
    options: styles.intentSelectOptions,
    option: styles.intentSelectOption,
  };

  const isSubmitting = status === 'submitting';

  return (
    <section className={styles.section} {...editable}>
      <div className={styles.inner}>
        <div className={styles.formColumn}>
          <Stack gap="var(--sb-section-stack-gap)">
            {hasHeader && (
              <Stack gap="md" className={styles.header}>
                {hasSectionHeader && (
                  <SectionHeader
                    headline={blok.headline}
                    lead={typeof blok.lead === 'string' ? blok.lead : undefined}
                  />
                )}
                {blok.text ? <div className={styles.richtext}>{renderSbRichText(blok.text)}</div> : null}
              </Stack>
            )}

            <form className={styles.formCard} onSubmit={handleSubmit} data-lpignore="true" data-1p-ignore="true">
              <Stack gap="md">
                <Text c="dimmed">Tell us about your request.</Text>
                <TextInput
                  classNames={textInputClassNames}
                  label="Name"
                  name="name"
                  required
                  placeholder="Your name"
                  autoComplete="name"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  disabled={isSubmitting}
                />
                <TextInput
                  classNames={textInputClassNames}
                  label="Email"
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  disabled={isSubmitting}
                />
                <Select
                  classNames={intentSelectClassNames}
                  label="I’d like to…"
                  name="intent"
                  placeholder="Select an option"
                  data={[...CONTACT_INTENT_OPTIONS]}
                  required
                  disabled={isSubmitting}
                />
                <TextInput
                  classNames={textInputClassNames}
                  label="Subject"
                  name="subject"
                  placeholder="How can we help?"
                  disabled={isSubmitting}
                />
                <Textarea
                  classNames={textareaClassNames}
                  label="Message"
                  name="message"
                  minRows={4}
                  placeholder="Share a bit more detail"
                  disabled={isSubmitting}
                />
                <div className={styles.actions}>{renderButtons()}</div>
                {status === 'success' ? (
                  <Text c="secondary.6" fw={400} size="lg" ta="center" role="status">
                    Thanks — your message was sent.
                  </Text>
                ) : null}
                {status === 'error' ? (
                  <Text c="tomatoJam.9" fw={400} size="lg" ta="center" role="alert">
                    {errorMessage || 'Unable to send right now. Please try again.'}
                  </Text>
                ) : null}
              </Stack>
            </form>
          </Stack>
        </div>

        {hasAside ? (
          <aside className={classNames(styles.aside, hasImage ? styles.asideWithImage : styles.asideNoImage)}>
            {hasImage ? (
              <div className={styles.asideImage} aria-hidden="true">
                <SbImage
                  src={imageData!.src}
                  alt={imageData!.alt || ''}
                  fill
                  sizes="(min-width: 62em) 50vw, 100vw"
                  style={{
                    objectFit: 'cover',
                    objectPosition: imageData?.objectPosition ?? '50% 50%',
                  }}
                  priority={false}
                />
              </div>
            ) : null}

            <div className={styles.asideContent}>
              {hasQuote ? <Text className={styles.quote}>“{quoteText}”</Text> : null}

              {hasAttribution ? (
                <div className={styles.attribution}>
                  {hasName ? <Text className={styles.name}>{blok.name}</Text> : null}
                  {hasPosition ? <Text className={styles.position}>{blok.position}</Text> : null}
                </div>
              ) : null}
            </div>
          </aside>
        ) : null}
      </div>
    </section>
  );
};

export default ContactFormSection;
