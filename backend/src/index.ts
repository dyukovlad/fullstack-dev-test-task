import express, { Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import {
  readProducts,
  writeProducts,
  readCategories,
  writeCategories,
  ensureCategory,
} from './storage';
import { Product } from './types';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use(cors()); // базовый CORS — фронтенд сможет обращаться
app.use(express.json()); // body parser

// GET categories
app.get('/api/categories', async (req: Request, res: Response) => {
  const categories = await readCategories();
  res.json(categories);
});

// POST category (optional)
app.post('/api/categories', async (req: Request, res: Response) => {
  const { category } = req.body;
  if (!category || !String(category).trim()) {
    return res.status(400).json({ message: 'category is required' });
  }
  const cats = await readCategories();
  const normalized = String(category).trim();
  if (!cats.some((c) => c.toLowerCase() === normalized.toLowerCase())) {
    cats.push(normalized);
    await writeCategories(cats);
  }
  res.status(201).json({ category: normalized });
});

// GET /api/products
app.get('/api/products', async (req: Request, res: Response) => {
  const products = await readProducts();
  res.json(products);
});

// GET /api/products/:id
app.get('/api/products/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const products = await readProducts();
  const p = products.find((x) => x.id === id);
  if (!p) return res.status(404).json({ message: 'Product not found' });
  res.json(p);
});

// POST /api/products
app.post('/api/products', async (req: Request, res: Response) => {
  const { title, price, description, image, category } = req.body;

  if (!title || !price || !image || !category) {
    return res
      .status(400)
      .json({ message: 'title, price, image and category are required' });
  }

  const products = await readProducts();
  const newItem: Product = {
    id: uuidv4(),
    title: String(title),
    price: Number(price),
    description: String(description || ''),
    image: String(image),
    category: String(category),
    rating: { rate: 0, count: 0 },
  };

  products.push(newItem);
  await writeProducts(products);

  // important: ensure category stored
  await ensureCategory(newItem.category);

  res.status(201).json(newItem);
});

// PUT /api/products/:id
app.put('/api/products/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  const { title, price, description, image, category } = req.body;
  const products = await readProducts();
  const idx = products.findIndex((x) => x.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Product not found' });

  const updated = {
    ...products[idx],
    title: title !== undefined ? String(title) : products[idx].title,
    price: price !== undefined ? Number(price) : products[idx].price,
    description:
      description !== undefined
        ? String(description)
        : products[idx].description,
    image: image !== undefined ? String(image) : products[idx].image,
    category:
      category !== undefined ? String(category) : products[idx].category,
  };

  products[idx] = updated;
  await writeProducts(products);
  res.json(updated);
});

// DELETE /api/products/:id
app.delete('/api/products/:id', async (req: Request, res: Response) => {
  const id = req.params.id;
  let products = await readProducts();
  const idx = products.findIndex((x) => x.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Product not found' });
  const removed = products.splice(idx, 1);
  await writeProducts(products);
  res.json({ message: 'Deleted', item: removed[0] });
});

app.listen(PORT, () => {
  console.log(`FakeStore local API running at http://localhost:${PORT}/api`);
});
