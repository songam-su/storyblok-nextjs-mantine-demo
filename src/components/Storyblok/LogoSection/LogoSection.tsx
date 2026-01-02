'use client';

import React from 'react';
import { storyblokEditable } from '@storyblok/react';
import Image from 'next/image';

import { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import { LogoSection as LogoSectionBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import getSbImageData from '@/lib/storyblok/utils/image';
import { useStoryblokEditor } from '@/lib/storyblok/context/StoryblokEditorContext';
import styles from './LogoSection.module.scss';

const LogoSection: React.FC<SbComponentProps<LogoSectionBlok>> = ({ blok }) => {
  const { isEditor } = useStoryblokEditor();
  const editable = isEditor ? storyblokEditable(blok as any) : undefined;
  const assets = Array.isArray(blok.logos) ? blok.logos : [];

  const logos = assets
    .map((asset) => ({ asset, data: getSbImageData(asset) }))
    .filter((entry) => Boolean(entry.data?.src));

  if (!logos.length && !blok.lead) {
    return null;
  }

  return (
    <section className={styles.section} {...editable}>
      {blok.lead && <p className={styles.lead}>{blok.lead}</p>}

      {logos.length > 0 && (
        <div className={styles.grid}>
          {logos.map(({ asset, data }, index) => (
            <div className={styles.logo} key={asset?.id ?? index}>
              <Image
                src={data!.src}
                alt={data!.alt || ''}
                width={data?.width || 240}
                height={data?.height || 120}
                sizes="160px"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '64px',
                  objectFit: 'contain',
                  ...(data?.objectPosition ? { objectPosition: data.objectPosition } : {}),
                }}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default LogoSection;
