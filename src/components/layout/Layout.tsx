import { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';
import { useUIStore } from '../../store/uiStore';

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export default function Layout({ children, hideFooter = false }: LayoutProps) {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-light');
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  const isLight = theme === 'light';

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isLight ? 'bg-[#F5F4F0] text-[#111]' : 'bg-[#0A0A0A] text-white'
      }`}
    >
      <Navbar />
      <main className="page-enter">{children}</main>
      {!hideFooter && <Footer />}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: isLight ? '#fff' : '#111',
            color: isLight ? '#111' : '#fff',
            border: `1px solid ${isLight ? '#E0DDD6' : '#1F1F1F'}`,
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
