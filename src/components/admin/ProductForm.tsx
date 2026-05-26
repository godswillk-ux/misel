import React, { useState, useRef } from 'react';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, OperationType, handleFirestoreError } from '@/lib/firebase';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Upload, X, Loader2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || '',
    imageURL: product?.imageURL || '',
    stock: product?.stock || 0,
  });
  const [previewUrl, setPreviewUrl] = useState<string>(product?.imageURL || '');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setUploading(true);
    const toastId = toast.loading('Optimizing and uploading image...');

    try {
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1280,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      
      const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const url = await getDownloadURL(snapshot.ref);
      
      setFormData(prev => ({ ...prev, imageURL: url }));
      setPreviewUrl(url); // Switch from local blob to remote URL
      toast.success('Image uploaded successfully', { id: toastId });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image', { id: toastId });
      if (!formData.imageURL) setPreviewUrl('');
    } finally {
      setUploading(false);
      if (localUrl.startsWith('blob:')) {
        URL.revokeObjectURL(localUrl);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageURL) {
      toast.error('Please provide an image URL or upload a file');
      return;
    }
    setLoading(true);

    try {
      if (product) {
        const productRef = doc(db, 'products', product.id);
        await updateDoc(productRef, {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          updatedAt: serverTimestamp(),
        });
        toast.success('Product updated successfully');
      } else {
        await addDoc(collection(db, 'products'), {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        toast.success('Product added successfully');
      }
      onSuccess();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            required
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label>Product Image</Label>
        
        {previewUrl ? (
          <div className="relative aspect-video rounded-lg overflow-hidden border">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className={`w-full h-full object-cover transition-opacity ${uploading ? 'opacity-50' : 'opacity-100'}`}
              referrerPolicy="no-referrer"
            />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={() => {
                setFormData({ ...formData, imageURL: '' });
                setPreviewUrl('');
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div 
            className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="h-10 w-10 text-muted-foreground" />
            )}
            <p className="text-sm font-medium">Click to upload image</p>
            <p className="text-xs text-muted-foreground">PNG, JPG or WebP</p>
          </div>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        
        {!previewUrl && (
          <>
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or provide URL</span>
              </div>
            </div>
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.imageURL}
              onChange={(e) => {
                const url = e.target.value;
                setFormData({ ...formData, imageURL: url });
                setPreviewUrl(url);
              }}
            />
          </>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={loading || uploading}>
        {loading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
      </Button>
    </form>
  );
};
