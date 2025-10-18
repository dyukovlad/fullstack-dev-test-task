import React from 'react';
import { Product } from '../features/types';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

export default function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: () => void;
}) {
  return (
    <Card
      onClick={onOpen}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
    >
      <CardMedia
        component="img"
        image={product.image}
        alt={product.title}
        sx={{ height: 180, objectFit: 'contain', p: 2 }}
      />
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="subtitle1" noWrap>
          {product.title}
        </Typography>
        <Box display="flex" justifyContent="space-between" mt={1}>
          <Typography variant="body2" color="text.secondary">
            {product.category}
          </Typography>
          <Typography variant="subtitle2">${product.price}</Typography>
        </Box>
        <Box mt={1}>
          <Typography variant="caption">
            Рейтинг: {product.rating?.rate ?? '—'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
