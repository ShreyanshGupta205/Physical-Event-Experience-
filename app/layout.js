import './globals.css';
import { AppProvider } from '@/context/AppContext';
import SmartAssistant from '@/components/ui/SmartAssistant';

export const metadata = {
  title: 'EventSphere — Smart Event Experience Platform',
  description: 'AI-powered platform to discover, manage, and experience events. Real-time crowd management, QR check-in, and smart coordination for attendees, organizers, and admins.',
  keywords: 'event management, hackathon, conference, smart venue, crowd management, QR check-in',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
          <SmartAssistant />
        </AppProvider>
      </body>
    </html>
  );
}
