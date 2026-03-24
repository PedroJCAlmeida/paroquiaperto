import './globals.css';
import '@/styles/Navbar.css';
import GoogleProvider from '@/components/GoogleProvider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Paróquia Perto',
  description: 'Encontre a paróquia mais próxima de você',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <GoogleProvider>{children}</GoogleProvider>
      </body>
    </html>
  );
}
