# Form UX & Styling

Purpose: show how form sections (contact/newsletter) inherit theme tokens and apply contrast-safe styles.

Notes

- Forms are client components styled via Mantine theme + CSS vars from site-config.
- Newsletter CTA uses accent button styling; inputs maintain accessible contrast in both light and dark themes.

```mermaid
flowchart LR
  CFG["Site-config theme vars<br/>text/background/accent"] --> Theme["Mantine theme<br/>+ CSS vars"]
  Theme --> FormSection["Form sections<br/>(contact/newsletter)"]
  FormSection --> Inputs["Inputs + labels<br/>accessible contrast"]
  FormSection --> Buttons["Buttons<br/>ghost/default/accent"]
  Buttons --> Hover["Hover/focus states<br/>light-friendly"]
```

Submission wiring (API routes + M365 SMTP): [form-email.md](form-email.md)
