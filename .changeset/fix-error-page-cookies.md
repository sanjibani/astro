---
'astro': patch
---

Fixes a bug where cookies set by a custom 404 or 500 error page were silently dropped, and where the original page's cookies could also vanish when both the original route and the error page set cookies