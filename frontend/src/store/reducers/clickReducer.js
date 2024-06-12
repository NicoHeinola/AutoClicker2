import { createSlice } from '@reduxjs/toolkit';
import clickAPI from "apis/clickAPI";

const initialState = {
    playState: {}
};

const clickSlice = createSlice({
    name: 'click',
    initialState,
    reducers: {
        setPlayState: (state, playState) => {
            state.playState = playState.payload;
        },
    },
});

const setPlayStateCall = (playState) => async (dispatch) => {
    dispatch(clickSlice.actions.setPlayState(playState));
};

const startClickingCall = () => async (dispatch) => {
    clickAPI.startClicking();
    dispatch(clickSlice.actions.setPlayState("playing"));
};

const stopClickingCall = () => async (dispatch) => {
    clickAPI.stopClicking();
    dispatch(clickSlice.actions.setPlayState("stopped"));
};

const loadPlayStateCall = () => async (dispatch) => {
    const response = await clickAPI.getPlayState();
    dispatch(clickSlice.actions.setPlayState(response.data));
};

export {
    setPlayStateCall,
    startClickingCall,
    stopClickingCall,
    loadPlayStateCall
};

export default clickSlice.reducer;
