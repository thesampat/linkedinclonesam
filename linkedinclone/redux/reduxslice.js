import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loginUser: {},
  status: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    set_login_user(state, action) {
      state.loginUser = action.payload;
    },
    set_user_status(state, action) {
      state.status = action.payload;
    },
    set_friends(state, action) {
      console.log(state)
      console.log("check payload:", action.payload);

      const friend = action.payload;

      if (!state.friends?.some(f => f._id === friend._id)) {
        state?.friends?.push(friend);
      }
    }
  }
});

export const { set_login_user, set_user_status, set_friends } = userSlice.actions
export default userSlice.reducer