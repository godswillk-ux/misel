import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Heart, User, LogOut, Menu, ShieldCheck, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { CartSheet } from '../cart/CartSheet';
import { useTranslation } from 'react-i18next';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navbar = () => {
  const { user, loginWithGoogle, logout } = useAuth();
  const { profile } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 flex items-center justify-center border border-foreground group-hover:rotate-45 transition-transform duration-500">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tighter uppercase">MISEL</span>
          </Link>
          
          <div className="hidden lg:flex gap-10">
            <Link to="/shop" className="text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-gold opacity-60 hover:opacity-100">{t('nav.shop')}</Link>
            <Link to="/our-story" className="text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-gold opacity-60 hover:opacity-100">{t('home.learnMore')}</Link>
            <Link to="/categories" className="text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:text-gold opacity-60 hover:opacity-100">{t('nav.categories')}</Link>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          <div className="hidden sm:flex items-center gap-6">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          
          <div className="h-6 w-[1px] bg-border hidden sm:block" />

          {user ? (
            <div className="flex items-center gap-2">
              <CartSheet />
              <Link to="/wishlist" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "hover:bg-accent rounded-none")}>
                <Heart className="h-5 w-5 font-light" />
              </Link>
              <Link to="/dashboard" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "relative hover:bg-accent rounded-none")}>
                <User className="h-5 w-5 font-light" />
                {(profile?.email === 'godswillk116@gmail.com' || profile?.email === 'uokide@yahoo.com') && (
                  <Star className="h-3 w-3 absolute top-1 right-1 fill-gold text-gold" />
                )}
              </Link>
              {profile?.role === 'admin' && (
                <Link to="/admin" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "text-gold rounded-none")}>
                  <ShieldCheck className="h-5 w-5" />
                </Link>
              )}
              <Button variant="ghost" size="icon" onClick={logout} className="hover:bg-destructive/10 hover:text-destructive rounded-none transition-colors">
                <LogOut className="h-5 w-5 font-light" />
              </Button>
            </div>
          ) : (
            <Button 
              onClick={loginWithGoogle}
              className="bg-gold text-white rounded-none px-6 font-bold tracking-widest uppercase text-xs h-10 hover:shadow-lg transition-all"
            >
              {t('nav.signIn')}
            </Button>
          )}

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-none")}>
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="bg-popover border-l-border">
                <div className="flex flex-col gap-8 mt-12">
                  <div className="flex items-center justify-between mb-8 pb-8 border-b border-border">
                    <LanguageSwitcher />
                    <ThemeToggle />
                  </div>
                  <Link to="/shop" className="text-2xl font-display font-medium tracking-tight uppercase">{t('nav.shop')}</Link>
                  <Link to="/our-story" className="text-2xl font-display font-medium tracking-tight uppercase">{t('home.learnMore')}</Link>
                  <Link to="/categories" className="text-2xl font-display font-medium tracking-tight uppercase">{t('nav.categories')}</Link>
                  {user && (
                    <div className="flex flex-col gap-8 pt-8 border-t border-border">
                      <Link to="/wishlist" className="text-2xl font-display font-medium tracking-tight uppercase">{t('nav.wishlist')}</Link>
                      <Link to="/dashboard" className="text-2xl font-display font-medium tracking-tight uppercase">{t('nav.dashboard')}</Link>
                      {profile?.role === 'admin' && (
                        <Link to="/admin" className="text-2xl font-display font-medium tracking-tight uppercase text-gold">{t('nav.admin')}</Link>
                      )}
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
