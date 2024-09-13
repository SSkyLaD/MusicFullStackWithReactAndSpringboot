import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    deviceFingerPrint : null
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers :{
        setDeviceFingerPrint : (state, action) => {
            state.deviceFingerPrint = action.payload;
            console.log(action.payload);
        }
    }
})

export default appSlice;