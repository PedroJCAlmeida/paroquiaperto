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

export const metadata: Metadata = {
  title: 'Paróquia Perto',
  description: 'Encontre a paróquia mais próxima de você',
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
