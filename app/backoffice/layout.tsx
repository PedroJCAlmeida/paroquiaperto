import PrivateRoute from '@/components/PrivateRoute';
import Navbar from '@/components/Navbar';
import '@/styles/BackofficeLayout.css';

export default function BackofficeLayout({ children }: { children: React.ReactNode }) {
  return (
    <PrivateRoute>
      <Navbar />
      <div className="backoffice-container" style={{ paddingTop: '64px' }}>
        <main className="backoffice-content">{children}</main>
      </div>
    </PrivateRoute>
  );
}
