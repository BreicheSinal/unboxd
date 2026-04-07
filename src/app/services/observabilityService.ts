const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
const gaMeasurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;

function appendScript(src: string) {
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

export function initObservability() {
  if (typeof window === "undefined") return;

  if (sentryDsn) {
    appendScript("https://browser.sentry-cdn.com/8.46.0/bundle.tracing.replay.min.js");
    setTimeout(() => {
      const maybeSentry = (window as typeof window & { Sentry?: { init: (input: Record<string, unknown>) => void } }).Sentry;
      if (!maybeSentry) return;
      maybeSentry.init({
        dsn: sentryDsn,
        environment: import.meta.env.MODE,
        tracesSampleRate: import.meta.env.PROD ? 0.2 : 1,
      });
    }, 0);
  }

  if (gaMeasurementId) {
    appendScript(`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`);

    const inline = document.createElement("script");
    inline.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);} 
      gtag('js', new Date());
      gtag('config', '${gaMeasurementId}');
    `;
    document.head.appendChild(inline);
  }
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (!gtag) return;
  gtag("event", name, params ?? {});
}
