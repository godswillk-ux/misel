import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { ArrowRight, Box } from 'lucide-react';

export const Categories = () => {
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  const categoryData = useMemo(() => {
    if (!products) return [];
    const counts: Record<string, { count: number; image: string }> = {};
    
    products.forEach(p => {
      if (!counts[p.category]) {
        counts[p.category] = { count: 0, image: p.imageURL };
      }
      counts[p.category].count++;
    });

    return Object.entries(counts).map(([name, data]) => ({
      name,
      count: data.count,
      image: data.image
    }));
  }, [products]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Box className="h-8 w-8 text-primary opacity-50" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-10">
      <section className="text-center space-y-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase mb-2"
        >
          Collections
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
          Browse by <span className="text-primary">Vibe</span>
        </h1>
        <p className="text-muted-foreground">
          Explore our curated selections of premium objects and atmospheres.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categoryData.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-accent/10 bg-accent/5 cursor-pointer shadow-xl hover:shadow-2xl transition-all"
            onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
          >
            <img 
              src={cat.image} 
              alt={cat.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-white/60 font-black uppercase tracking-widest text-[10px]">
                  {cat.count} {cat.count === 1 ? 'Item' : 'Items'}
                </p>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                  {cat.name}
                </h3>
              </div>
              <Button size="icon" className="rounded-full h-12 w-12 bg-white text-black hover:bg-gold hover:text-gold-foreground transition-all">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
