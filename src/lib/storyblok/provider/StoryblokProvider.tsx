'use client';

import '@/components/storyblok/registry';

interface StoryblokProviderProps {
    children: React.ReactNode;
}

const StoryblokProvider = ({children}: StoryblokProviderProps) => {
    return children;
}

export default StoryblokProvider;