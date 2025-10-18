export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: string; // string because we generate UUIDs
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: Rating;
}
