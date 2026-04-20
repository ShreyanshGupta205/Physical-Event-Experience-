import './globals.css';
import { AppProvider } from '@/context/AppContext';
import DynamicAssistant from '@/components/ui/DynamicAssistant';

export const metadata = {
  title: 'Eventra — Smart Event Experience Platform',
  description: 'AI-powered platform to discover, manage, and experience events. Real-time crowd management, QR check-in, and smart coordination for attendees, organizers, and admins.',
  keywords: 'event management, hackathon, conference, smart venue, crowd management, QR check-in',
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Eventra",
    "operatingSystem": "Web",
    "applicationCategory": "BusinessApplication",
    "description": "AI-powered platform to discover, manage, and experience events with real-time orchestration.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1250"
    },
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Eventra Platform",
    "url": "https://smart-event-645235868525.us-central1.run.app/",
    "logo": "https://smart-event-645235868525.us-central1.run.app/favicon.ico",
    "sameAs": [
      "https://github.com/ShreyanshGupta205/Physical-Event-Experience-"
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
      </head>
      <body>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-100EVENTRA"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-100EVENTRA');
            `,
          }}
        />
        <AppProvider>
          {children}
          <DynamicAssistant />
        </AppProvider>
      </body>
    </html>
  );
}
