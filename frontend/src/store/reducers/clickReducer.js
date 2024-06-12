import { createSlice } from '@reduxjs/toolkit';
import settingAPI from "apis/settingAPI";

const initialState = {
    playState: {}
};

const settingsSlice = createSlice({
    name: 'click',
    initialState,
    reducers: {
        setPlayState: (state, playState) => {
            state.playState = playState.payload;
        },
    },
});

const setPlayStateCall = (playState) => async (dispatch) => {
    settingAPI.updateSettings(settingsToUpdate);
    dispatch(settingsSlice.actions.updateSettings(settingsToUpdate));
};

const startClickingCall = () => async (dispatch) => {
    settingAPI.updateSettings(settingsToUpdate);
    dispatch(settingsSlice.actions.updateSettings(settingsToUpdate));
};

const stopClickingCall = () => async (dispatch) => {
    settingAPI.updateSettings(settingsToUpdate);
    dispatch(settingsSlice.actions.updateSettings(settingsToUpdate));
};

export {
    updateSettingsCall,
    loadSettingsCall
};

export default settingsSlice.reducer;
