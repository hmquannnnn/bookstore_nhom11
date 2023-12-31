import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const initialState = {
  isAuthenticated: false,
  user: {
    email: "",
    name: "",
    phone: "",
    password: "",
    address: "",
    role: "",
    image_url: ""
  },

};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    doLoginAction: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    doGetAccountAction: (state, action) => {
      if (
        action.payload &&
        typeof action.payload === "object" &&
        typeof action.payload.name === "string"
      ) {
        state.isAuthenticated = true;
        state.user = action.payload;
      } else {
        console.error("Invalid payload structure in doGetAccountAction");
      }
    },
    doLogOutAction: (state, action) => {
      state.isAuthenticated = false;
      state.user = initialState.user;
    },
    updateAvatar: (state, action) => {
      // console.log(">>>payload: ", action.payload)
      state.user.image_url = action.payload;
    },
    doChangeNameAction: (state, action) => {
      // console.log(">>>new name: ", action.payload)
      state.user.name = action.payload;
    },
    doChangeAddressAction: (state, action) => {
      state.user.address = action.payload;
    }

  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => { },
});

export const { doLoginAction, doGetAccountAction, doLogOutAction, updateAvatar, doChangeNameAction, doChangeAddressAction } = accountSlice.actions;

export default accountSlice.reducer;
