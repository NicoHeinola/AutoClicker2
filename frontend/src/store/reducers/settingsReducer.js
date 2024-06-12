import { createSlice } from '@reduxjs/toolkit';
import settingAPI from "apis/settingAPI";

const initialState = {
    settings: {}
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setSettings: (state, settings) => {
            state.settings = settings.payload;
        },
        updateSettings: (state, settings) => {
            let newSettings = { ...state.settings };
            let toUpdate = settings.payload;
            for (let key in toUpdate) {
                newSettings[key] = toUpdate[key];
            }
            state.settings = newSettings;
        },
    },
});

const updateSettingsCall = (settingsToUpdate) => async (dispatch) => {
    settingAPI.updateSettings(settingsToUpdate);
    dispatch(settingsSlice.actions.updateSettings(settingsToUpdate));
};

const loadSettingsCall = () => async (dispatch) => {
    const response = await settingAPI.getAllSettings();
    let allSettings = response.data;
    dispatch(settingsSlice.actions.updateSettings(allSettings));
};

export {
    updateSettingsCall,
    loadSettingsCall
};

export default settingsSlice.reducer;
