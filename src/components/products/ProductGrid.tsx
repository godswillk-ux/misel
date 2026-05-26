import React from 'react';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/types';

interface ProductGridProps {
  products?: Product[];
  loading?: boolean;
}

export const ProductGrid = ({ products: propProducts, loading: propLoading }: ProductGridProps) => {
  const { products: hookProducts, loading: hookLoading } = useProducts();
  
  const products = propProducts ?? hookProducts;
  const loading = propLoading ?? hookLoading;

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-square rounded-xl" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold">No products found</h3>
        <p className="text-muted-foreground">Check back later for new arrivals.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
