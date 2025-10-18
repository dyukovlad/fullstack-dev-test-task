import React, { useMemo, useState } from 'react';
import { useGetProductsQuery } from '../features/api/productsApi';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import {
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
} from '@mui/material';
import { Product } from '../features/types';

export default function ProductList() {
  const { data: products = [], isLoading } = useGetProductsQuery();
  const [selected, setSelected] = useState<Product | null>(null);
  const [sortKey, setSortKey] = useState<'price' | 'rating'>('price');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sorted = useMemo(() => {
    const arr = [...products];
    arr.sort((a, b) => {
      const aVal = sortKey === 'price' ? a.price : a.rating?.rate ?? 0;
      const bVal = sortKey === 'price' ? b.price : b.rating?.rate ?? 0;
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });
    return arr;
  }, [products, sortKey, sortDir]);

  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Box display="flex" gap={2} mb={2}>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Сортировать по</InputLabel>
          <Select
            value={sortKey}
            label="Сортировать по"
            onChange={(e) => setSortKey(e.target.value as any)}
          >
            <MenuItem value="price">Цене</MenuItem>
            <MenuItem value="rating">Рейтингу</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
        >
          {sortDir === 'asc' ? 'По возрастанию' : 'По убыванию'}
        </Button>
      </Box>

      <Grid container spacing={2}>
        {sorted.map((p) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
            <ProductCard product={p} onOpen={() => setSelected(p)} />
          </Grid>
        ))}
      </Grid>

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
