import { ThemeProvider } from 'next-themes';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import Providers from '@/providers/providers';
import { metroSans } from '@/utils/font';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from 'sonner';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Landmark | Burgess Rawson',
  description: 'Created by Aaron J. Girton.',
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
