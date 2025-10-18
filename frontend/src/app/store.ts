import { configureStore } from '@reduxjs/toolkit';
import { productsApi } from '../features/api/productsApi';

export const store = configureStore({
  reducer: { [productsApi.reducerPath]: productsApi.reducer },
  middleware: (gDM) => gDM().concat(productsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
