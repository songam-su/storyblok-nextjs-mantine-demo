# Why Use Dynamic Component Registration with Strong Typing in Next.js App Router?

The decision to use **dynamic component registration with strong typing** (via Storyblok’s generated types) instead of a simple static import for `storyblokInit` in a Next.js App Router project comes down to several architectural and maintainability benefits:

---

## ✅ 1. App Router + Server Components Compatibility

In **Next.js 16 with App Router**:

- `layout.tsx` and `page.tsx` are **server components**.
- Downstream components can be **client** or **hybrid**.

### Why Static Imports Are Problematic

If you use **static imports** for all Storyblok components in `storyblokInit`, you:

- Force those imports into the **server layer**.
- **Increase bundle size** unnecessarily.
- Break **tree-shaking** for client-only components.

### Why Dynamic Registration Helps

Dynamic registration allows you to **load only the components needed for the current story**, reducing overhead.

---

## ✅ 2. Strong Typing from Generated Types

Storyblok’s `storyblok pull` generates:

- `storyblok-components.d.ts`
- `datasources.json`

### Benefits of Dynamic Registration + TypeScript Types

- **Type-safe props** for each component.
- Prevent **runtime errors** caused by mismatched schema vs component props.

Static imports don’t leverage these generated types effectively because they’re **hardcoded**.

---

## ✅ 3. Scalability for Large Spaces

If you have **dozens of components**:

- **Static registration** → Import all components upfront.

- **Static registration** → Import all components upfront.
- **Dynamic registration** → Resolve components **only when needed**.

This is especially important for **ISR/SSG** and **preview mode**, where you want **minimal overhead**.

---

## ✅ 4. Better Integration with Storyblok Visual Editor

Dynamic registration works seamlessly with the **Storyblok Bridge** for live updates:

- When editors add new components, you **don’t need to redeploy** or manually update `storyblokInit`.
- Your **dynamic resolver** can handle it automatically.

---

### TL;DR

Dynamic registration + strong typing = **better performance, scalability, type safety, and editor experience**.
