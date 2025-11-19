import { configureStore, applyMiddleware, compose } from '@reduxjs/toolkit'

import userReducer from './reduxslice'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


export const store = configureStore({
  reducer: {user:userReducer}
},   composeEnhancers()
)