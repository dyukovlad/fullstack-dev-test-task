import React, { useState } from 'react';
import { Product } from '../features/types';
import { useSnackbar } from 'notistack';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../features/api/productsApi';

export default function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(String(product.price));
  const [update, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [del, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [openConfirm, setOpenConfirm] = useState(false);

  async function onSave() {
    try {
      await update({ id: product.id, title, price: Number(price) }).unwrap();
      enqueueSnackbar('Обновлено', { variant: 'success' });
      onClose();
    } catch (e) {
      enqueueSnackbar('Ошибка обновления', { variant: 'error' });
    }
  }

  async function onDelete() {
    try {
      await del(product.id).unwrap();
      enqueueSnackbar('Удалено', { variant: 'success' });
      onClose();
    } catch (e) {
      enqueueSnackbar('Ошибка удаления', { variant: 'error' });
    }
    setOpenConfirm(false);
  }

  return (
    <>
      <Dialog open onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Товар</DialogTitle>
        <DialogContent>
          <Box display="flex" gap={2} marginTop={2}>
            <Box sx={{ width: 260, flexShrink: 0 }}>
              <img
                src={product.image}
                alt={product.title}
                style={{ maxWidth: '100%', objectFit: 'contain' }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                label="Title"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Price"
                fullWidth
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                sx={{ mb: 2 }}
                type="number"
              />
              <Typography variant="body2" color="text.secondary">
                {product.description}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            onClick={() => setOpenConfirm(true)}
            disabled={isDeleting}
          >
            {isDeleting ? 'Удаляем...' : 'Удалить'}
          </Button>
          <Button onClick={onClose}>Отмена</Button>
          <Button variant="contained" onClick={onSave} disabled={isUpdating}>
            {isUpdating ? 'Сохраняем...' : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        open={openConfirm}
        title="Удалить товар?"
        message={`Вы действительно хотите удалить «${product.title}»?`}
        onConfirm={onDelete}
        onCancel={() => setOpenConfirm(false)}
      />
    </>
  );
}
