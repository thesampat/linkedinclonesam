import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router/dom";
import approuters from './routers'
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux'
import { store } from '../redux/redux_store';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
        <RouterProvider router={approuters} />
        <ToastContainer/>
        </Provider>
  </StrictMode>
)
