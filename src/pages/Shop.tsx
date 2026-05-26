import React, { useState, useMemo, useEffect } from 'react';
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
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useProducts } from '@/hooks/useProducts';
import { useSearchParams } from 'react-router-dom';

export const Shop = () => {
  const { t } = useTranslation();
  const { products, loading } = useProducts();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(initialCategory !== 'all');

  useEffect(() => {
    const urlCategory = searchParams.get('category');
    if (urlCategory) {
      setCategory(urlCategory);
      setShowFilters(true);
    }
  }, [searchParams]);

  const categories = useMemo(() => {
    if (!products) return [];
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = category === 'all' || product.category === category;
      const matchesMinPrice = minPrice === '' || product.price >= parseFloat(minPrice);
      const matchesMaxPrice = maxPrice === '' || product.price <= parseFloat(maxPrice);
      
      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
    });
  }, [products, searchQuery, category, minPrice, maxPrice]);

  const clearFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div className="space-y-12 py-10">
      <section className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
          Explore Our <span className="text-primary">Collection</span>
        </h1>
        <p className="text-muted-foreground">
          Discovery premium objects and atmospheric pieces for those who appreciate tranquility.
        </p>
      </section>

      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold uppercase italic tracking-tight">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search for perfection..." 
                className="pl-9 rounded-full bg-accent/30 border-accent/50 focus:border-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              className="gap-2 rounded-full border-accent/50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {(category !== 'all' || minPrice !== '' || maxPrice !== '') && (
                <span className="flex h-2 w-2 rounded-full bg-primary" />
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="p-8 rounded-[2rem] border border-accent/20 bg-accent/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Vibe</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="rounded-xl bg-background">
                      <SelectValue placeholder="All Vibes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Vibes</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Min Price</label>
                  <Input 
                    type="number" 
                    placeholder="Min" 
                    className="rounded-xl bg-background"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Max Price</label>
                  <Input 
                    type="number" 
                    placeholder="Max" 
                    className="rounded-xl bg-background"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="ghost" 
                    className="w-full gap-2 text-muted-foreground hover:text-foreground rounded-xl"
                    onClick={clearFilters}
                  >
                    <X className="h-4 w-4" />
                    Clear All
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ProductGrid products={filteredProducts} loading={loading} />
      </section>
    </div>
  );
};
