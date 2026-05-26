import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useWishlist } from '@/hooks/useWishlist';
import { useProducts } from '@/hooks/useProducts';
import { useSettings } from '@/hooks/useSettings';
import { ProductCard } from '@/components/products/ProductCard';
import { OrderTracking } from '@/components/orders/OrderTracking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Heart, Package, Settings, Shield, Star, Upload, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';

export const Dashboard = () => {
  const { profile, updateProfile } = useUser();
  const { wishlist } = useWishlist();
  const { products } = useProducts();
  const { settings, updateSettings } = useSettings();
  const { t } = useTranslation();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || '');
  const [bgUrl, setBgUrl] = useState(settings.backgroundImageUrl || '');
  const [bgUrlDark, setBgUrlDark] = useState(settings.backgroundImageUrlDark || '');
  const [bgTheme, setBgTheme] = useState(settings.backgroundTheme || 'default');
  
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingBgDark, setUploadingBgDark] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const bgDarkInputRef = useRef<HTMLInputElement>(null);

  const [profilePreview, setProfilePreview] = useState(profile?.photoURL || '');
  const [bgPreview, setBgPreview] = useState(settings.backgroundImageUrl || '');
  const [bgDarkPreview, setBgDarkPreview] = useState(settings.backgroundImageUrlDark || '');

  // Sync settings when they load
  useEffect(() => {
    if (settings.backgroundImageUrl) {
      setBgUrl(settings.backgroundImageUrl);
      setBgPreview(settings.backgroundImageUrl);
    }
    if (settings.backgroundImageUrlDark) {
      setBgUrlDark(settings.backgroundImageUrlDark);
      setBgDarkPreview(settings.backgroundImageUrlDark);
    }
    if (settings.backgroundTheme) {
      setBgTheme(settings.backgroundTheme);
    }
  }, [settings]);

  const wishlistedProducts = products?.filter(p => wishlist?.productIds.includes(p.id)) || [];

  const handleFileUpload = async (file: File, path: string, setUrl: (url: string) => void, setPreview: (url: string) => void, setLoading: (loading: boolean) => void) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setLoading(true);
    const toastId = toast.loading('Optimizing and uploading image...');

    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: path === 'profiles' ? 400 : 1920,
        useWebWorker: true
      };
      const compressedFile = await imageCompression(file, options);

      const storageRef = ref(storage, `${path}/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const url = await getDownloadURL(snapshot.ref);
      setUrl(url);
      setPreview(url);
      toast.success('Image uploaded successfully', { id: toastId });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image', { id: toastId });
    } finally {
      setLoading(false);
      if (localUrl.startsWith('blob:')) {
        URL.revokeObjectURL(localUrl);
      }
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ displayName, photoURL });
  };

  const handleAdminSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({ 
      backgroundImageUrl: bgUrl, 
      backgroundImageUrlDark: bgUrlDark,
      backgroundTheme: bgTheme as 'default' | 'gold' 
    });
  };

  const isOwner = profile?.email === 'godswillk116@gmail.com' || profile?.email === 'uokide@yahoo.com';

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <Card className="w-full md:w-1/3">
          <CardHeader className="text-center">
            <div className="mx-auto w-24 h-24 rounded-full overflow-hidden border-4 border-primary/10 mb-4">
              <img
                src={profile?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.displayName || 'User')}`}
                alt={profile?.displayName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              {profile?.displayName}
              {isOwner && (
                <span className="flex items-center text-yellow-500 text-sm">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1 text-muted-foreground text-xs">(Owner)</span>
                </span>
              )}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary capitalize">
                {profile?.role}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Member since</span>
                <span className="font-medium">
                  {profile?.createdAt?.toDate().toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex-grow w-full">
          <Tabs defaultValue="wishlist" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-4">
              <TabsTrigger value="wishlist" className="gap-2">
                <Heart className="h-4 w-4" /> {t('nav.wishlist')}
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <Package className="h-4 w-4" /> Orders
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" /> Settings
              </TabsTrigger>
              {profile?.role === 'admin' && (
                <TabsTrigger value="admin" className="gap-2">
                  <Shield className="h-4 w-4" /> Admin
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="wishlist" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {wishlistedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
                {wishlistedProducts.length === 0 && (
                  <div className="col-span-full text-center py-12 border rounded-lg border-dashed">
                    <p className="text-muted-foreground">Your wishlist is empty.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="orders" className="mt-6">
              <OrderTracking />
            </TabsContent>
            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input 
                        id="displayName" 
                        value={displayName} 
                        onChange={(e) => setDisplayName(e.target.value)} 
                        placeholder="Your Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Profile Picture</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-full overflow-hidden border">
                          <img 
                            src={profilePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || 'User')}`} 
                            alt="Preview" 
                            className={`w-full h-full object-cover transition-opacity ${uploadingProfile ? 'opacity-50' : 'opacity-100'}`}
                            referrerPolicy="no-referrer"
                          />
                          {uploadingProfile && (
                            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="flex-grow space-y-2">
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() => profileInputRef.current?.click()}
                              disabled={uploadingProfile}
                            >
                              <Upload className="h-4 w-4" /> Upload File
                            </Button>
                            {photoURL && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-destructive"
                                onClick={() => {
                                  setPhotoURL('');
                                  setProfilePreview('');
                                }}
                              >
                                <X className="h-4 w-4" /> Clear
                              </Button>
                            )}
                          </div>
                          <Input 
                            value={photoURL} 
                            onChange={(e) => {
                              setPhotoURL(e.target.value);
                              setProfilePreview(e.target.value);
                            }}
                            placeholder="Or paste image URL"
                            className="h-8 text-xs"
                          />
                        </div>
                        <input 
                          type="file" 
                          ref={profileInputRef}
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileUpload(e.target.files[0], 'profiles', setPhotoURL, setProfilePreview, setUploadingProfile);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <Button type="submit">Save Profile</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            {profile?.role === 'admin' && (
              <TabsContent value="admin" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Global Website Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAdminSettingsUpdate} className="space-y-6 max-w-md">
                      <div className="space-y-4">
                        <Label>Background Theme</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <Button 
                            type="button"
                            variant={bgTheme === 'default' ? 'default' : 'outline'}
                            onClick={() => setBgTheme('default')}
                            className="w-full"
                          >
                            Default (Image)
                          </Button>
                          <Button 
                            type="button"
                            variant={bgTheme === 'gold' ? 'default' : 'outline'}
                            onClick={() => setBgTheme('gold')}
                            className="w-full bg-gold text-gold-foreground hover:bg-gold/90"
                          >
                            Gold Theme
                          </Button>
                        </div>
                      </div>

                      {bgTheme === 'default' && (
                        <div className="space-y-8">
                          {/* Light Background */}
                          <div className="space-y-2">
                            <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Light Mode Background</Label>
                            {bgPreview ? (
                              <div className="relative aspect-video rounded-lg overflow-hidden border">
                                <img 
                                  src={bgPreview} 
                                  alt="Light Background Preview" 
                                  className={`w-full h-full object-cover transition-opacity ${uploadingBg ? 'opacity-50' : 'opacity-100'}`}
                                  referrerPolicy="no-referrer"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-8 w-8"
                                  onClick={() => {
                                    setBgUrl('');
                                    setBgPreview('');
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                {uploadingBg && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div 
                                className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent transition-colors"
                                onClick={() => bgInputRef.current?.click()}
                              >
                                {uploadingBg ? (
                                  <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                                ) : (
                                  <Upload className="h-8 w-8 text-muted-foreground" />
                                )}
                                <p className="text-xs font-medium">Click to upload light background</p>
                              </div>
                            )}
                            <input 
                              type="file" 
                              ref={bgInputRef}
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleFileUpload(e.target.files[0], 'settings', setBgUrl, setBgPreview, setUploadingBg);
                                }
                              }}
                            />
                            <div className="space-y-2 pt-1">
                              <Input 
                                value={bgUrl} 
                                onChange={(e) => {
                                  setBgUrl(e.target.value);
                                  setBgPreview(e.target.value);
                                }} 
                                placeholder="Light image URL"
                                className="h-8 text-xs"
                              />
                            </div>
                          </div>

                          {/* Dark Background */}
                          <div className="space-y-2">
                            <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Dark Mode Background</Label>
                            {bgDarkPreview ? (
                              <div className="relative aspect-video rounded-lg overflow-hidden border">
                                <img 
                                  src={bgDarkPreview} 
                                  alt="Dark Background Preview" 
                                  className={`w-full h-full object-cover transition-opacity ${uploadingBgDark ? 'opacity-50' : 'opacity-100'}`}
                                  referrerPolicy="no-referrer"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 h-8 w-8"
                                  onClick={() => {
                                    setBgUrlDark('');
                                    setBgDarkPreview('');
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                {uploadingBgDark && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div 
                                className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-accent transition-colors"
                                onClick={() => bgDarkInputRef.current?.click()}
                              >
                                {uploadingBgDark ? (
                                  <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                                ) : (
                                  <Upload className="h-8 w-8 text-muted-foreground" />
                                )}
                                <p className="text-xs font-medium">Click to upload dark background</p>
                              </div>
                            )}
                            <input 
                              type="file" 
                              ref={bgDarkInputRef}
                              className="hidden" 
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleFileUpload(e.target.files[0], 'settings', setBgUrlDark, setBgDarkPreview, setUploadingBgDark);
                                }
                              }}
                            />
                            <div className="space-y-2 pt-1">
                              <Input 
                                value={bgUrlDark} 
                                onChange={(e) => {
                                  setBgUrlDark(e.target.value);
                                  setBgDarkPreview(e.target.value);
                                }} 
                                placeholder="Dark image URL"
                                className="h-8 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <Button type="submit" className="w-full">Save Global Settings</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};
