import classNames from 'classnames';
import { storyblokEditable } from '@storyblok/react';
import type { RichtextYoutube as RichtextYoutubeBlok } from '@/lib/storyblok/resources/types/storyblok-components';
import type { SbComponentProps } from '@/types/storyblok/SbComponentProps';
import styles from './RichtextYoutube.module.scss';

const RichtextYoutube = ({ blok }: SbComponentProps<RichtextYoutubeBlok>) => {
  const editable = storyblokEditable(blok as any);
  const videoId = blok.video_id?.trim();

  if (!videoId) return null;

  const src = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div {...editable} className={classNames(styles.wrapper)}>
      <div className={styles.frame}>
        <iframe
          src={src}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default RichtextYoutube;
