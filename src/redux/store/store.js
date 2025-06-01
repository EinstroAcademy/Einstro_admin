import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '../login/login'


const store = configureStore({
  reducer: {
    admin:loginReducer
  }
})

export default store