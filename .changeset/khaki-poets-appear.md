---
'astro': patch
---

Fixes CSS `@import` rules being placed after other styles in bundled inline `<style>` tags during build. Browsers silently ignore `@import` rules that don't appear at the top of a stylesheet, which could cause fonts or other imported CSS resources to fail loading in production builds.
