export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageURL: string;
  stock: number;
  createdAt: any;
  updatedAt: any;
}

export interface Wishlist {
  userId: string;
  productIds: string[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'admin' | 'customer';
  suspended?: boolean;
  createdAt: any;
}
