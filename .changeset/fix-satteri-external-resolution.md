---
'astro': patch
---

Prevents Rollup from failing to resolve `satteri` and `@astrojs/markdown-satteri` during builds when they are not installed. These optional dependencies (used by the satteri markdown processor) are now marked as external in the prerender build environment, following the same pattern used for `sharp`. This fixes a build error when importing `getContainerRenderer` from `@astrojs/mdx` without the satteri processor installed.
