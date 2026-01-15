export const DISABLE_FORM_SUBMIT: boolean = (() => {
  // Default: disabled for demo safety.
  // To re-enable locally: set NEXT_PUBLIC_DISABLE_FORM_SUBMIT=false
  const raw = process.env.NEXT_PUBLIC_DISABLE_FORM_SUBMIT;
  if (!raw) return true;

  const normalized = raw.trim().toLowerCase();
  return !(normalized === 'false' || normalized === '0' || normalized === 'no');
})();

export const DEMO_FORM_DISABLED_MESSAGE = 'Submissions are disabled in this demo.';
