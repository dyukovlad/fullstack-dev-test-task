import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  MenuItem,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { TextField } from '@mui/material';
import {
  useGetCategoriesQuery,
  useAddProductMutation,
} from '../features/api/productsApi';
import { useSnackbar } from 'notistack';

interface FormValues {
  title: string;
  price: number | string;
  description: string;
  image: string;
  category: string;
  customCategory?: string;
}

export default function AddProductForm({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: categories = [] } = useGetCategoriesQuery();
  const [add, { isLoading }] = useAddProductMutation();
  const { enqueueSnackbar } = useSnackbar();

  console.log({ categories });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      price: '',
      description: '',
      image: '',
      category: '',
      customCategory: '',
    },
  });

  const watchedCategory = watch('category');

  useEffect(() => {
    const current = getValues('category');

    if (categories.length) {
      if (!current) {
        setValue('category', categories[0]);
      }
    } else {
      if (current !== 'other') {
        setValue('category', 'other');
      }
    }
  }, [categories, getValues, setValue]);

  const onSubmit = async (data: FormValues) => {
    let finalCategory = data.category;
    if (data.category === 'other' || !categories.length) {
      finalCategory = (data.customCategory || '').trim();
      if (!finalCategory) {
        enqueueSnackbar('Укажите собственную категорию', {
          variant: 'warning',
        });
        return;
      }
    }

    if (!data.title.trim()) {
      enqueueSnackbar('Введите название товара', { variant: 'warning' });
      return;
    }
    if (!data.image.trim()) {
      enqueueSnackbar('Укажите ссылку на изображение', { variant: 'warning' });
      return;
    }
    const priceNum = Number(data.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      enqueueSnackbar('Укажите корректную цену > 0', { variant: 'warning' });
      return;
    }

    try {
      await add({
        title: data.title,
        price: priceNum,
        description: data.description,
        image: data.image,
        category: finalCategory,
      }).unwrap();
      enqueueSnackbar('Товар добавлен (mock API / локальный)', {
        variant: 'success',
      });
      onClose();
      reset();
    } catch (e) {
      enqueueSnackbar('Ошибка при добавлении', { variant: 'error' });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Добавить товар</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
        >
          <Controller
            name="title"
            control={control}
            rules={{ required: 'Введите название' }}
            render={({ field }) => (
              <TextField
                label="Название"
                {...field}
                error={!!errors.title}
                helperText={errors.title?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="price"
            control={control}
            rules={{
              required: 'Введите цену',
              validate: (v) => Number(v) > 0 || 'Цена должна быть больше 0',
            }}
            render={({ field }) => (
              <TextField
                label="Цена"
                {...field}
                type="number"
                error={!!errors.price}
                helperText={errors.price?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                label="Описание"
                {...field}
                multiline
                rows={3}
                fullWidth
              />
            )}
          />

          <Controller
            name="image"
            control={control}
            rules={{ required: 'Укажите URL изображения' }}
            render={({ field }) => (
              <TextField
                label="Image URL"
                {...field}
                error={!!errors.image}
                helperText={errors.image?.message}
                fullWidth
              />
            )}
          />

          {categories.length ? (
            <Controller
              name="category"
              control={control}
              rules={{ required: 'Выберите категорию' }}
              render={({ field }) => (
                <TextField
                  select
                  label="Категория"
                  {...field}
                  error={!!errors.category}
                  helperText={errors.category?.message}
                  fullWidth
                >
                  {categories.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                  <MenuItem value="other">Другая...</MenuItem>
                </TextField>
              )}
            />
          ) : (
            <Controller
              name="customCategory"
              control={control}
              rules={{ required: 'Укажите категорию' }}
              render={({ field }) => (
                <TextField
                  label="Категория (создайте свою)"
                  {...field}
                  error={!!errors.customCategory}
                  helperText={errors.customCategory?.message}
                  fullWidth
                />
              )}
            />
          )}

          {Boolean(categories.length) && watchedCategory === 'other' && (
            <Controller
              name="customCategory"
              control={control}
              rules={{ required: 'Укажите собственную категорию' }}
              render={({ field }) => (
                <TextField
                  label="Ваша категория"
                  {...field}
                  error={!!errors.customCategory}
                  helperText={errors.customCategory?.message}
                  fullWidth
                />
              )}
            />
          )}

          <DialogActions sx={{ px: 0 }}>
            <Button
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Отмена
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? 'Добавляем...' : 'Добавить'}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
