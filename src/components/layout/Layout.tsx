import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export default function Layout({ children, hideFooter = false }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main className="page-enter">{children}</main>
      {!hideFooter && <Footer />}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid #1F1F1F',
            borderRadius: '12px',
          },
          success: {
            iconTheme: { primary: '#C9A84C', secondary: '#000' },
          },
        }}
      />
    </div>
  );
}
