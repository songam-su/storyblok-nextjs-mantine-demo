// import dynamic from 'next/dynamic';
// import { components, Placeholder } from './component-map';
// import type { StoryblokComponentMap } from './component-map';
// import { FC } from 'react';

// Strictly typed lazy registry (currently not in use)
// // Build a lazy-loaded registry from the static component map
// export const lazyRegistry: StoryblokComponentMap = Object.keys(components).reduce((acc, key) => {
//   const typedKey = key as keyof StoryblokComponentMap;
//   const Component = components[typedKey];

//   acc[typedKey] = dynamic(() => Promise.resolve(Component), {
//     loading: () => <Placeholder />, // Show placeholder while loading
//     ssr: true, // Keep SSR enabled for SEO-critical components
//   });

//   return acc;
// }, {} as StoryblokComponentMap);

// Non-strictly typed version (for development purposes)

// export const lazyRegistry: Record<string, FC<any>> = Object.keys(components).reduce((acc, key) => {
//   const typedKey = key as keyof StoryblokComponentMap;
//   acc[typedKey] = dynamic(() => Promise.resolve(components[typedKey]), {
//     loading: () => <Placeholder />,
//     ssr: true,
//   });
//   return acc;
// }, {} as Record<string, FC<any>>);

// import dynamic from 'next/dynamic';
// import { components, Placeholder } from './component-map';

// // Dynamic registry with relaxed typing
// export const lazyRegistry: Record<string, React.ComponentType<any>> = Object.keys(components).reduce(
//   (acc, key) => {
//     const typedKey = key as keyof typeof components;

//     // Loosen type for dynamic loader
//     acc[typedKey] = dynamic(() => Promise.resolve(components[typedKey] as React.ComponentType<any>), {
//       loading: () => <Placeholder />,
//       ssr: true,
//     });

//     return acc;
//   },
//   {} as Record<string, React.ComponentType<any>>
// );

// import dynamic from 'next/dynamic';
// import { components, Placeholder } from './component-map';

// // Dynamic registry with preload capability
// export const lazyRegistry: Record<string, React.ComponentType<any>> & {
//   preload: (key: string) => Promise<void>;
// } = Object.keys(components).reduce((acc, key) => {
//   const typedKey = key as keyof typeof components;
//   const Component = components[typedKey];

//   const DynamicComponent = dynamic(() => Promise.resolve(Component as React.ComponentType<any>), {
//     loading: () => <Placeholder />,
//     ssr: true,
//   });

//   acc[typedKey] = DynamicComponent;
//   return acc;
// }, {} as Record<string, React.ComponentType<any>>);

// // Add preload function
// lazyRegistry.preload = async (key: string) => {
//   const typedKey = key as keyof typeof components;
//   if (components[typedKey]) {
//     await Promise.resolve(components[typedKey]); // Simulate preload
//   }
// };

// import dynamic from 'next/dynamic';
// import { components, Placeholder } from './component-map';

// // Step 1: Build the base registry
// const baseRegistry: Record<string, React.ComponentType<any>> = Object.keys(components).reduce(
//   (acc, key) => {
//     const typedKey = key as keyof typeof components;
//     const Component = components[typedKey];

//     acc[typedKey] = dynamic(() => Promise.resolve(Component as React.ComponentType<any>), {
//       loading: () => <Placeholder />,
//       ssr: true,
//     });

//     return acc;
//   },
//   {} as Record<string, React.ComponentType<any>>
// );

// // Step 2: Extend with preload method
// export const lazyRegistry: Record<string, React.ComponentType<any>> & {
//   preload: (key: string) => Promise<void>;
// } = {
//   ...baseRegistry,
//   preload: async (key: string) => {
//     const typedKey = key as keyof typeof components;
//     if (components[typedKey]) {
//       // Simulate preload (could be replaced with actual dynamic import logic)
//       await Promise.resolve(components[typedKey]);
//     }
//   },
// };

//CLOSE!!!

// import dynamic from 'next/dynamic';
// import { components, Placeholder } from './component-map';

// // Define the registry type
// interface LazyRegistry {
//   components: Record<string, React.ComponentType<any>>;
//   preload: (key: string) => Promise<void>;
// }

// // Build the base components registry
// const baseComponents: Record<string, React.ComponentType<any>> = Object.keys(components).reduce(
//   (acc, key) => {
//     const typedKey = key as keyof typeof components;
//     const Component = components[typedKey];

//     acc[typedKey] = dynamic(() => Promise.resolve(Component as React.ComponentType<any>), {
//       loading: () => <Placeholder />,
//       ssr: true,
//     });

//     return acc;
//   },
//   {} as Record<string, React.ComponentType<any>>
// );

// // Create the final registry object
// export const lazyRegistry: LazyRegistry = {
//   components: baseComponents,
//   preload: async (key: string) => {
//     const typedKey = key as keyof typeof components;
//     if (components[typedKey]) {
//       // Simulate preload (replace with actual dynamic import if needed)
//       await Promise.resolve(components[typedKey]);
//     }
//   },
// };

// VERY CLOSE!!!
// import dynamic from 'next/dynamic';
// import { components, Placeholder } from './component-map';
// import type { StoryblokBlok } from '@/lib/storyblok/component-registry/generated-union';

// // Define registry type
// interface LazyRegistry {
//   components: Record<string, React.ComponentType<any>>;
//   preload: (key: string) => Promise<void>;
// }

// // Build hybrid registry
// const baseComponents: Record<string, React.ComponentType<any>> = {};

// Object.keys(components).forEach((key) => {
//   const typedKey = key as keyof typeof components;
//   const Component = components[typedKey];
//   const componentKey = key as keyof StoryblokBlok;

//   // ✅ Hybrid logic:
//   // If Component === Placeholder → use dynamic import for future implementation
//   if (Component === Placeholder) {
//     baseComponents[typedKey] = dynamic(
//       () =>
//         import(`@/components/Storyblok/Sb${typedKey}/Sb${typedKey}`)
//           .then((mod) => mod.default)
//           .catch(() => Placeholder), // fallback if file doesn't exist
//       {
//         loading: () => <Placeholder />,
//         ssr: true,
//       }
//     );
//   } else {
//     // ✅ Implemented components → static import
//     baseComponents[typedKey] = Component;
//   }
// });

// // Add preload method
// export const lazyRegistry: LazyRegistry = {
//   components: baseComponents,
//   preload: async (key: string) => {
//     const typedKey = key as keyof typeof components;
//     if (components[typedKey] === Placeholder) {
//       try {
//         await import(`@/components/Storyblok/${typedKey}/index`);
//       } catch {
//         console.warn(`Preload failed: Component ${typedKey} not implemented yet.`);
//       }
//     }
//   },
// };

import dynamic from 'next/dynamic';
import { components, Placeholder } from './component-map';
import { componentPaths } from './component-paths';

interface LazyRegistry {
  components: Record<string, React.ComponentType<any>>;
  preload: (key: string) => Promise<void>;
}

const baseComponents: Record<string, React.ComponentType<any>> = {};

Object.keys(components).forEach((key) => {
  const typedKey = key as keyof typeof components;
  const Component = components[typedKey];

  if (Component === Placeholder) {
    const mappedPath = componentPaths[typedKey];
    baseComponents[typedKey] = dynamic(
      () =>
        import(`@/components/Storyblok/${mappedPath}/${mappedPath}`)
          .then((mod) => mod.default)
          .catch(() => Placeholder),
      {
        loading: () => <Placeholder />,
        ssr: true,
      }
    );
  } else {
    baseComponents[typedKey] = Component;
  }
});

export const lazyRegistry: LazyRegistry = {
  // components: baseComponents,
  components: components,
  preload: async (key: string) => {
    const mappedPath = componentPaths[key];
    if (mappedPath) {
      try {
        await import(`@/components/Storyblok/${mappedPath}/${mappedPath}`);
      } catch {
        console.warn(`Preload failed: Component ${mappedPath} not implemented yet.`);
      }
    }
  },
};
