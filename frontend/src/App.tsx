import React, { useState } from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import AddProductForm from './components/AddProductForm';
import ProductList from './components/ProductList';

export default function App() {
  const [openAdd, setOpenAdd] = useState(false);
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          Менеджер товаров
        </Typography>
        <Button variant="contained" onClick={() => setOpenAdd(true)}>
          Добавить товар
        </Button>
      </Box>
      <ProductList />
      <AddProductForm open={openAdd} onClose={() => setOpenAdd(false)} />
    </Container>
  );
}
