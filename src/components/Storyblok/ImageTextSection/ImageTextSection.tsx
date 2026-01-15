'use client';

import Button from '@/components/Storyblok/Button/Button';
import { renderHeadlineSegments } from '@/components/Storyblok/utils/renderHeadlineSegments';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import type { ImageTextSection as ImageTextSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import getSbImageData from '@/lib/storyblok/utils/image';
import { renderSbRichText } from '@/lib/storyblok/utils/richtext/renderSbRichText';
import { getStoryblokColorClass } from '@/lib/storyblok/utils/styles/color/storyblokColorUtils';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { Stack, Text, Title } from '@mantine/core';
import { storyblokEditable } from '@storyblok/react';
import classNames from 'classnames';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './ImageTextSection.module.scss';

const ImageTextSection = ({ blok }: SbComponentProps<ImageTextSectionBlok>) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;
  const backgroundClass = getStoryblokColorClass(blok.background_color as string | undefined);
  const reverseDesktop = Boolean(blok.reverse_desktop_layout);
  const reverseMobile = Boolean(blok.reverse_mobile_layout);

  const copyRef = useRef<HTMLDivElement | null>(null);
  const [copyHeight, setCopyHeight] = useState<number | null>(null);

  const imageData = getSbImageData(blok.image || null);
  const hasImage = Boolean(imageData?.src);
  const preserveAspectRatio = Boolean(blok.preserve_image_aspect_ratio);

  const hasBody = Boolean(blok.eyebrow || blok.headline?.length || blok.text || (blok.buttons?.length ?? 0) > 0);

  if (!hasBody && !hasImage) {
    return <section {...editable} className={classNames(styles.section, backgroundClass)} />;
  }

  useEffect(() => {
    const element = copyRef.current;
    if (!element) return;

    const update = () => {
      const nextHeight = element.getBoundingClientRect().height;
      setCopyHeight(Number.isFinite(nextHeight) ? nextHeight : null);
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(element);

    return () => ro.disconnect();
  }, [blok._uid]);

  return (
    <section {...editable} className={classNames(styles.section, backgroundClass)}>
      <Stack
        gap="xl"
        className={classNames(
          styles.inner,
          reverseDesktop && styles.reverseDesktop,
          reverseMobile && styles.reverseMobile
        )}
      >
        {hasBody && (
          <Stack gap="24px" className={styles.copy} ref={copyRef}>
            <div className={styles.headline}>
              {blok.eyebrow && (
                <Text size="sm" className={styles.eyebrow}>
                  {blok.eyebrow}
                </Text>
              )}

              {blok.headline?.length ? <Title order={2}>{renderHeadlineSegments(blok.headline)}</Title> : null}
            </div>

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
                      storyblokEditable={isEditor ? storyblokEditable(btn as any) : undefined}
                    />
                  );
                })}
              </div>
            )}
          </Stack>
        )}

        {hasImage && (
          <div
            className={styles.media}
            style={
              copyHeight
                ? ({ ['--imageText-copy-height' as any]: `${copyHeight}px` } as React.CSSProperties)
                : undefined
            }
          >
            <div className={classNames(styles.frame, preserveAspectRatio && styles.contain)}>
              <Image
                className={styles.img}
                src={imageData!.src}
                alt={imageData!.alt || ''}
                width={imageData?.width || 1200}
                height={imageData?.height || 900}
                sizes="(min-width: 1024px) 600px, 100vw"
                style={{
                  width: '100%',
                  height: '100%',
                  ...(imageData?.objectPosition ? { objectPosition: imageData.objectPosition } : {}),
                }}
              />
            </div>
          </div>
        )}
      </Stack>
    </section>
  );
};

export default ImageTextSection;
