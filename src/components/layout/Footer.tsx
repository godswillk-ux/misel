import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MessageSquare, Phone, Truck, RefreshCw, ShieldAlert } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-bone dark:bg-charcoal border-t border-charcoal/5 dark:border-bone/5 pt-32 pb-16 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24">
          <div className="space-y-10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 flex items-center justify-center border border-charcoal dark:border-bone">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span className="text-2xl font-display font-bold tracking-tighter uppercase leading-none">MISEL</span>
            </div>
            <p className="text-sm font-light text-muted-foreground leading-relaxed italic max-w-xs">
              Curated aesthetics and premium lifestyle pieces. Elevate your atmosphere with MISEL Studio.
            </p>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black tracking-[0.4em] uppercase text-charcoal/40 dark:text-bone/40">Studio</h4>
            <ul className="space-y-4 text-xs font-bold tracking-widest uppercase">
              <li><Link to="/our-story" className="hover:text-gold transition-colors">Our Story</Link></li>
              <li><Link to="/reviews" className="hover:text-gold transition-colors">User Reviews</Link></li>
              <li><Link to="/shop" className="hover:text-gold transition-colors">Gallery</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black tracking-[0.4em] uppercase text-charcoal/40 dark:text-bone/40">Concierge</h4>
            <ul className="space-y-4 text-xs font-bold tracking-widest uppercase">
              <li>
                <a 
                  href="https://wa.me/2347010393855" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-gold transition-colors"
                >
                  WhatsApp Studio
                </a>
              </li>
              <li><Link to="/shipping" className="hover:text-gold transition-colors">Delivery</Link></li>
              <li><Link to="/returns" className="hover:text-gold transition-colors">Exchange</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[10px] font-black tracking-[0.4em] uppercase text-charcoal/40 dark:text-bone/40">Legal</h4>
            <ul className="space-y-4 text-xs font-bold tracking-widest uppercase">
              <li><Link to="/privacy" className="hover:text-gold transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-gold transition-colors">Terms</Link></li>
              <li>
                <div className="pt-4 mt-4 border-t border-charcoal/5 dark:border-bone/5">
                  <div className="flex items-center gap-2 text-destructive font-black text-[10px] tracking-widest mb-2 uppercase">
                    <ShieldAlert className="h-4 w-4" /> Final Sale
                  </div>
                  <p className="text-[10px] font-light text-muted-foreground leading-tight italic">
                    Strictly no refunds and no good or service exchange after purchase.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-charcoal/5 dark:border-bone/5 mt-24 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black tracking-[0.5em] uppercase text-charcoal/30 dark:text-bone/30">
            © {new Date().getFullYear()} MISEL Studio. Crafted with Intention.
          </p>
          <div className="flex gap-8">
            <div className="h-4 w-4 rounded-full border border-charcoal/10 dark:border-bone/10" />
            <div className="h-4 w-4 rounded-full bg-gold/20" />
            <div className="h-4 w-4 rounded-full border border-charcoal/10 dark:border-bone/10" />
          </div>
        </div>
      </div>
    </footer>
  );
};
