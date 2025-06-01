import { createSlice } from '@reduxjs/toolkit'

export const loginSlice=createSlice({
    name: 'admin',
    initialState: {
        admin:localStorage.getItem('adminData') ?JSON.parse(localStorage.getItem('adminData')):{}
    },
      reducers:{
        updateLoginData:(state,payload)=>{
            state.admin=payload.payload
        },
        checkLogin: (state) => {
            return state?.admin?.id && state?.admin?.token;
          },
        logout:(state)=>{
            state.admin={}
        }
      }
})

export const { updateLoginData,checkLogin,logout } = loginSlice.actions

export default loginSlice.reducer