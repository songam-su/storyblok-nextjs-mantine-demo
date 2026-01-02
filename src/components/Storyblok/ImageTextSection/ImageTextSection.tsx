'use client';

import classNames from 'classnames';
import { Stack, Text, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import Image from 'next/image';
import Button from '@/components/Storyblok/Button/Button';
import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import { renderSbRichText } from '@/lib/storyblok/utils/richtext/renderSbRichText';
import getSbImageData from '@/lib/storyblok/utils/image';
import { getStoryblokColorClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { ImageTextSection as ImageTextSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import styles from './ImageTextSection.module.scss';

const ImageTextSection = ({ blok }: SbComponentProps<ImageTextSectionBlok>) => {
  const editable = storyblokEditable(blok as any);
  const backgroundClass = getStoryblokColorClass(blok.background_color as string | undefined);
  const reverseDesktop = Boolean(blok.reverse_desktop_layout);
  const reverseMobile = Boolean(blok.reverse_mobile_layout);

  const imageData = getSbImageData(blok.image || null);
  const hasImage = Boolean(imageData?.src);
  const objectFit = blok.preserve_image_aspect_ratio ? 'contain' : 'cover';

  const hasBody = Boolean(blok.eyebrow || blok.headline?.length || blok.text || (blok.buttons?.length ?? 0) > 0);

  if (!hasBody && !hasImage) {
    return <section {...editable} className={classNames(styles.section, backgroundClass)} />;
  }

  return (
    <section {...editable} className={classNames(styles.section, backgroundClass)}>
      <div
        className={classNames(
          styles.inner,
          reverseDesktop && styles.reverseDesktop,
          reverseMobile && styles.reverseMobile
        )}
      >
        {hasBody && (
          <Stack gap="sm" className={styles.copy}>
            {blok.eyebrow && (
              <Text size="sm" className={styles.eyebrow} c="dimmed">
                {blok.eyebrow}
              </Text>
            )}

            {blok.headline?.length ? (
              <Title order={2} fw={800}>
                {renderHeadlineSegments(blok.headline)}
              </Title>
            ) : null}

            {blok.text && <div className={styles.richtext}>{renderSbRichText(blok.text)}</div>}

            {Array.isArray(blok.buttons) && blok.buttons.length > 0 && (
              <div className={styles.actions}>
                {blok.buttons.map((btn) => {
                  if (!btn) return null;
                  return (
                    <Button
                      key={btn._uid}
                      blok={btn}
                      _uid={btn._uid}
                      component={btn.component}
                      storyblokEditable={storyblokEditable(btn as any)}
                    />
                  );
                })}
              </div>
            )}
          </Stack>
        )}

        {hasImage && (
          <div className={styles.media}>
            <div className={classNames(styles.frame, objectFit === 'contain' && styles.contain)}>
              <Image
                className={styles.img}
                src={imageData!.src}
                alt={imageData!.alt || ''}
                width={imageData?.width || 1200}
                height={imageData?.height || 900}
                sizes="(min-width: 1024px) 600px, 100vw"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit,
                  ...(imageData?.objectPosition ? { objectPosition: imageData.objectPosition } : {}),
                }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageTextSection;
