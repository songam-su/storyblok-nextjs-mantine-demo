/* eslint-disable @next/next/no-img-element */

import Image from 'next/image';
import type { CSSProperties } from 'react';

export type SbImageProps = {
  src: string;
  alt: string;

  // Match the common subset of next/image props we use.
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
};

function isSvgSrc(src: string) {
  return /\.svg(\?.*)?$/i.test(src);
}

export default function SbImage(props: SbImageProps) {
  const { src, alt, fill, sizes, width, height, priority, className, style } = props;

  // SVGs are best served directly to the browser (no Next image pipeline).
  if (isSvgSrc(src)) {
    if (fill) {
      return (
        <img
          src={src}
          alt={alt}
          className={className}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            ...style,
          }}
        />
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        style={{ objectFit: 'contain', ...style }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      fill={fill}
      sizes={sizes}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      priority={priority}
      style={style}
    />
  );
}
