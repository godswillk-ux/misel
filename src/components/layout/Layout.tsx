import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Toaster } from '@/components/ui/sonner';
import { CookieBanner } from './CookieBanner';
import { useSettings } from '@/hooks/useSettings';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const { theme } = useTheme();
  const isGoldTheme = settings.backgroundTheme === 'gold';
  
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const checkDark = () => {
      if (theme === 'system') {
        setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      } else {
        setIsDark(theme === 'dark');
      }
    };
    checkDark();
    
    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => setIsDark(media.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [theme]);

  const bgImage = isDark && settings.backgroundImageUrlDark
    ? settings.backgroundImageUrlDark
    : settings.backgroundImageUrl || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className={cn("min-h-screen font-sans antialiased flex flex-col relative transition-colors duration-500 bg-background")}>
      {/* Global Background Image */}
      <div 
        className="fixed inset-0 z-[-2] bg-cover bg-center bg-no-repeat bg-fixed opacity-50 dark:opacity-30 transition-opacity duration-1000"
        style={{ backgroundImage: `url("${bgImage}")` }}
      />
      
      {/* Dynamic Overlay - Ensures content readability over the image */}
      <div className={cn(
        "fixed inset-0 z-[-1] transition-colors duration-500",
        isGoldTheme 
          ? 'bg-gold/90 dark:bg-gold/95' 
          : 'bg-background/85 dark:bg-background/98',
        "backdrop-blur-[8px] shadow-inner"
      )} />
      
      <Navbar />
      <main className="container mx-auto px-6 py-8 flex-grow relative z-0">
        {children}
      </main>
      <Footer />
      <Toaster position="top-center" />
      <CookieBanner />
    </div>
  );
};
