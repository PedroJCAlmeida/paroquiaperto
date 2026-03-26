import './globals.css';
import '@/styles/Navbar.css';
import '@/styles/dark-mode.css';
import ThemeProvider from '@/components/ThemeProvider';
import type { Metadata } from 'next';
import { Libre_Baskerville, Source_Sans_3 } from 'next/font/google';

const headingFont = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-heading',
});

const bodyFont = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

const appUrl = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'https://paroquiaperto.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: 'Paróquia Perto',
    template: '%s | Paróquia Perto',
  },
  description: 'Encontre paróquias próximas, horários de missas e eventos da sua comunidade em Portugal.',
  keywords: [
    'paróquia perto',
    'paroquias portugal',
    'horários de missa',
    'eventos paroquiais',
    'igreja católica',
    'comunidade católica',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [{ url: '/icon.png', type: 'image/png' }],
    apple: [{ url: '/apple-icon.png', type: 'image/png' }],
    shortcut: ['/icon.png'],
  },
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    url: appUrl,
    siteName: 'Paróquia Perto',
    title: 'Paróquia Perto',
    description: 'Descubra paróquias, horários de missa e eventos perto de si.',
    images: [
      {
        url: '/logo_paroquia.png',
        width: 512,
        height: 512,
        alt: 'Paróquia Perto',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paróquia Perto',
    description: 'Descubra paróquias, horários de missa e eventos perto de si.',
    images: ['/logo_paroquia.png'],
  },
  category: 'religion',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC: set dark class before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: [
              '(function(){',
              '  try {',
              "    var t = localStorage.getItem('theme');",
              "    if (t === 'dark' || (t === null && window.matchMedia('(prefers-color-scheme: dark)').matches)) {",
              "      document.documentElement.classList.add('dark');",
              '    }',
              '  } catch (e) {}',
              '})();',
            ].join('\n'),
          }}
        />
      </head>
      <body className={`${bodyFont.variable} ${headingFont.variable}`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
