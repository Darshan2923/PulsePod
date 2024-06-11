import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from './userSlice';
import snackbarReducer from './snackbarSlice';
import audioReducer from "./audioplayerSlice";
import signinReducer from './setSigninSlice';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "root",
    version: 1,
    storage,
};

const rootReducer = combineReducers({ user: userReducer, snackBar: snackbarReducer, signin: signinReducer, audioPlayer: audioReducer });

const persistReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [FLUSH, REHYDRATE, PERSIST, PAUSE, PURGE, REGISTER]
            },
        }),
});

export const persistor = persistStore(store)