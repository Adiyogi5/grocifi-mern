import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './redux/theme/themeSlice';
import adminReducer from './redux/admin/adminSlice';

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        admin: adminReducer,

    },
})