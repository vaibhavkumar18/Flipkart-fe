import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,              // ONLY user object
  isAuthenticated: false
};

const userslice = createSlice({
  name: "user",
  initialState,
  reducers: {

    // ✅ LOGIN (same name as before)
    signup: (state, action) => {
      state.user = action.payload;   // 👈 direct user object
      state.isAuthenticated = true;
    },

    loginSuccess: (state, action) => {
      console.log("Login Success Action Payload:", action.payload);
      state.user = action.payload;
      console.log("Login Success state user:", state.user);
      state.isAuthenticated = true;
    },


    // ✅ LOGOUT
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },

    // ✅ UPDATE PROFILE
    updateprofile: (state, action) => {
      if (!state.user) return;

      state.user = {
        ...state.user,
        ...action.payload
      };
    },

    // ✅ ADD ADDRESS
    AddAddress: (state, action) => {
      if (!state.user) return;

      if (!Array.isArray(state.user.Address)) {
        state.user.Address = [];
      }

      state.user.Address.push(action.payload);
    },

    // ✅ DELETE ADDRESS
    DeleteAddress: (state, action) => {
      if (!state.user || !Array.isArray(state.user.Address)) return;

      state.user.Address = state.user.Address.filter(
        addr => addr.id !== action.payload
      );
    },

    // ✅ UPDATE ADDRESS
    updateAddress: (state, action) => {
      if (!state.user || !Array.isArray(state.user.Address)) return;

      const index = state.user.Address.findIndex(
        addr => addr.id === action.payload.id
      );

      if (index !== -1) {
        state.user.Address[index] = action.payload;
      }
    }
  }
});

export const {
  loginSuccess,
  signup,
  logout,
  updateprofile,
  AddAddress,
  DeleteAddress,
  updateAddress
} = userslice.actions;

export default userslice.reducer;
