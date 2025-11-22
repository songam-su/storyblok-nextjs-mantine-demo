// pages/[...slug].tsx
import { StoryblokComponent, useStoryblok } from '@storyblok/react';
import { GetStaticPaths, GetStaticProps } from 'next';

export default function StoryblokPage({ slug }: { slug: string }) {
  const story = useStoryblok(slug, { version: 'draft' });

  if (!story) return <h1>Loading... {slug}</h1>;

  return (
    <>
      {story.content.body.map((blok: any) => (
        <StoryblokComponent blok={blok} key={blok._uid} />
      ))}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: true,
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = (params?.slug as string[])?.join('/') || 'home';
  return { props: { slug } };
};
