import { promises as fs } from 'fs';
import path from 'path';
import { Product } from './types';

const DATA_DIR = path.join(__dirname, '..', 'data');
const PRODUCTS_PATH = path.join(DATA_DIR, 'products.json');
const CATEGORIES_PATH = path.join(DATA_DIR, 'categories.json');

export async function readProducts(): Promise<Product[]> {
  try {
    const raw = await fs.readFile(PRODUCTS_PATH, 'utf-8');
    return JSON.parse(raw) as Product[];
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await writeProducts([]);
      return [];
    }
    throw err;
  }
}

export async function writeProducts(products: Product[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(PRODUCTS_PATH, JSON.stringify(products, null, 2), 'utf-8');
}

export async function readCategories(): Promise<string[]> {
  try {
    const raw = await fs.readFile(CATEGORIES_PATH, 'utf-8');
    return JSON.parse(raw) as string[];
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await writeCategories([]);
      return [];
    }
    throw err;
  }
}

export async function writeCategories(categories: string[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    CATEGORIES_PATH,
    JSON.stringify(categories, null, 2),
    'utf-8'
  );
}

// helper: ensure category exists (case-insensitive optional)
export async function ensureCategory(category: string): Promise<void> {
  const normalized = category?.trim();
  if (!normalized) return;
  const cats = await readCategories();
  // avoid duplicates (case-insensitive)
  const exists = cats.some((c) => c.toLowerCase() === normalized.toLowerCase());
  if (!exists) {
    cats.push(normalized);
    await writeCategories(cats);
  }
}
