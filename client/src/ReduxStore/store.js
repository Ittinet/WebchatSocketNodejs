import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../Reducers/userSlice";
import authSlice from "../Reducers/authSlice"
import storage from 'redux-persist/lib/storage'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['token', 'user'],
}

const persistedUserReducer = persistReducer(persistConfig, authSlice)

const store = configureStore({
    reducer: {
        user: userSlice,
        auth: persistedUserReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

const persistor = persistStore(store)

export { store, persistor }