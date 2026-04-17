export interface Store {
  id: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  image: string;
  rating: number;
  category: 'Luxury' | 'Streetwear' | 'Ethnic' | 'Contemporary';
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
  category: string;
  inStock: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  storeId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    returnStatus?: 'none' | 'return_requested' | 'replace_requested';
  }>;
  total: number;
  status: 'pending' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  cancelReason?: string;
  createdAt: any;
  deliveryLocation: { address: string; lat: number; lng: number };
  partnerId?: string;
  agentInfo?: {
    name: string;
    phone: string;
    vehicle: string;
    currentLocation: { lat: number; lng: number };
  };
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  favoriteStoreIds?: string[];
}
