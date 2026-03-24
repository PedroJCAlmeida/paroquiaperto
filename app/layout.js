import './globals.css';
import '@/styles/Navbar.css';
import GoogleProvider from '@/components/GoogleProvider';

export const metadata = {
  title: 'Paróquia Perto',
  description: 'Encontre a paróquia mais próxima de você',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>
        <GoogleProvider>
          {children}
        </GoogleProvider>
      </body>
    </html>
  );
}
