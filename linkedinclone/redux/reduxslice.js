import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loginUser: {},     
  status: false
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
    }
  }
});

export const { set_login_user, set_user_status } = userSlice.actions
export default userSlice.reducer