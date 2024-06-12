import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './reducers/settingsReducer';
import clickReducer from './reducers/clickReducer';

const store = configureStore({
    reducer: {
        settings: settingsReducer,
        click: clickReducer
    },
});

export default store;
