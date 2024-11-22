import { ThemeProvider } from 'next-themes';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import Providers from '@/providers/providers';
import { metroSans } from '@/utils/font';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from 'sonner';
import type { Metadata } from 'next';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    template: '%s › Landmark',
    default: 'Landmark › Burgess Rawson',
  },
  description: 'Burgess Rawson internal platform for commercial real estate operations.',
  keywords: ['Burgess Rawson', 'commercial real estate', 'intranet', 'internal platform'],
  authors: [{ name: 'Aaron J. Girton' }],
  creator: 'Aaron J. Girton - Burgess Rawson Technology Department',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.className} ${metroSans.variable}`}
      suppressHydrationWarning={true}
    >
      <body className={`bg-background text-foreground`}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <Sonner />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
