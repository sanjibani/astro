---
'astro': patch
---

Fixed `Astro.cookies.get()` returning `undefined` for cookies with empty values (e.g., `Cookie: foo=`). Empty-value cookies are valid per RFC 6265 and are now correctly returned as an `AstroCookie` with `value: ""`, consistent with `Astro.cookies.has()` which already reported them as present.
