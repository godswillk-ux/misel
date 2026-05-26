import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Zap, Shield, Smartphone, Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useProducts } from '@/hooks/useProducts';

export const Home = () => {
  const { t } = useTranslation();
  const { products, loading } = useProducts();
  const navigate = useNavigate();
  
  const featuredProducts = useMemo(() => {
    if (!products) return [];
    return products.slice(0, 8);
  }, [products]);

  return (
    <div className="space-y-32 pb-20">
      {/* Hero Section - Split Studio Layout */}
      <section className="relative min-h-[85vh] flex items-center pt-20">
        <div className="container px-6 mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative z-10 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="h-[1px] w-12 bg-charcoal/30 dark:bg-bone/30" />
              <span className="text-[10px] font-black tracking-[0.4em] uppercase text-charcoal/50 dark:text-bone/50">
                Curated Atmosphere 2026
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-5xl sm:text-7xl md:text-9xl font-display font-bold leading-[0.85] tracking-tighter mb-10 text-charcoal dark:text-bone uppercase"
            >
              MISEL <br />
              <span className="italic font-light text-gold text-4xl sm:text-6xl md:text-8xl">Studio</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-lg font-light"
            >
              {t('home.heroSubtitle')}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-6"
            >
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-gold text-white dark:bg-gold dark:text-bone rounded-none px-10 h-16 transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                onClick={() => navigate('/shop')}
              >
                <span className="relative z-10 font-bold tracking-widest uppercase text-sm">
                  {t('home.shopNow')}
                </span>
                <div className="absolute inset-0 bg-charcoal scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                <ArrowRight className="absolute right-4 w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10" />
              </Button>
              
              <Button 
                size="lg" 
                variant="ghost" 
                className="rounded-none px-8 h-16 border-b-2 border-charcoal/10 hover:bg-gold/5 dark:hover:bg-gold/5 hover:border-gold dark:border-bone/10 dark:hover:border-gold transition-all font-bold tracking-widest uppercase text-sm"
                onClick={() => navigate('/our-story')}
              >
                {t('home.learnMore')}
              </Button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative order-1 lg:order-2 h-[60vh] lg:h-[80vh]"
          >
            <div className="absolute inset-0 bg-charcoal/5 dark:bg-bone/5 rounded-3xl" />
            <div className="absolute inset-0 overflow-hidden rounded-3xl shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop" 
                alt="MISEL Aesthetic Studio" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
            </div>
            
            {/* Architectural accent */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 border border-charcoal/10 dark:border-bone/10 hidden xl:block" />
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section - Interactive Cards */}
      <section className="container px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-charcoal/10 dark:border-bone/10">
          {[
            { tag: "01", title: "Curated Aesthetics", desc: "Unique atmosphere pieces designed for mindful living spaces." },
            { tag: "02", title: "Atmospheric Quality", desc: "Form meets function. Minimalist objects crafted from premium materials." },
            { tag: "03", title: "Visual Harmony", desc: "A seamless aesthetic journey across all your digital environments." }
          ].map((feat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-12 border-b md:border-b-0 md:border-r border-charcoal/10 dark:border-bone/10 group hover:bg-gold/5 dark:hover:bg-gold/5 transition-all"
            >
              <span className="text-[10px] font-black text-gold mb-8 block tracking-widest">{feat.tag}</span>
              <h3 className="text-2xl font-display font-medium tracking-tight mb-4 group-hover:translate-x-2 transition-transform duration-300">{feat.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-light">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Legacy/Color Section - Added for visual variety */}
      <section className="bg-gold/10 dark:bg-gold/5 py-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,100 L100,0 L100,100 Z" fill="currentColor" className="text-gold" />
          </svg>
        </div>
        <div className="container px-6 mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 relative z-10">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-gold">The Story</span>
            <h2 className="text-5xl md:text-7xl font-display font-bold leading-tight">
              A Legacy of <br />
              <span className="text-gold italic">Pure Form.</span>
            </h2>
            <p className="text-xl font-light leading-relaxed max-w-lg text-muted-foreground">
              Founded on the belief that objects define our reality, MISEL creates more than just decor. We provide the visual framework for your digital and physical life.
            </p>
            <Button 
              variant="outline" 
              className="rounded-none border-gold hover:bg-gold hover:text-white px-10 h-14 font-bold tracking-widest uppercase transition-all"
              onClick={() => navigate('/our-story')}
            >
              Read Our Story
            </Button>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2067&auto=format&fit=crop" 
                alt="MISEL Legacy" 
                className="w-full h-full object-cover grayscale-[30%]"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-full h-full border-2 border-gold/30 rounded-2xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Featured Gallery */}
      <section id="shop" className="container px-6 mx-auto space-y-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 pb-12 border-b border-charcoal/10 dark:border-bone/10">
          <div className="space-y-4">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-gold">Latest Objects</span>
            <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter uppercase leading-[0.9]">
              Featured <br /> <span className="italic font-light opacity-50 text-3xl md:text-5xl">Collection</span>
            </h2>
          </div>
          <Button 
            variant="link" 
            className="font-bold tracking-[0.2em] uppercase text-xs h-auto p-0 gap-3 group" 
            onClick={() => navigate('/shop')}
          >
            View Gallery <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
          </Button>
        </div>

        <ProductGrid products={featuredProducts} loading={loading} />

        <div className="flex justify-center pt-8">
          <Button 
            size="lg" 
            variant="outline" 
            className="rounded-none h-16 px-12 border-charcoal/10 hover:border-charcoal dark:border-bone/10 dark:hover:border-bone font-bold tracking-widest uppercase text-sm transition-all"
            onClick={() => navigate('/shop')}
          >
            {t('home.viewAll')}
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-black tracking-widest uppercase"
          >
            Explore Collections
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">Shop by Vibe</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from(new Set(products?.map(p => p.category) || [])).slice(0, 4).map((catNameObj, i) => {
            const catName = catNameObj as string;
            const catProduct = products?.find(p => p.category === catName);
            return (
              <motion.div
                key={catName}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer border border-accent/10"
                onClick={() => navigate(`/shop?category=${encodeURIComponent(catName)}`)}
              >
                <img 
                  src={catProduct?.imageURL} 
                  alt={catName} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-black italic uppercase tracking-tighter transition-transform group-hover:scale-110">{catName}</h3>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="flex justify-center">
          <Button 
            variant="link" 
            className="font-black italic uppercase tracking-widest text-xs h-auto p-0 gap-2 group"
            onClick={() => navigate('/categories')}
          >
            Browse All Vibes <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>
    </div>
  );
};
