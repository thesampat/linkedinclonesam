import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { set_friends, set_login_user, set_user_status } from "../redux/reduxslice";
import { registerOrLogin } from "./services/authService";
import approuters from './routers'
import { RouterProvider } from "react-router/dom";


import './App.css'
import { socket } from "./socket";
import { useState } from "react";
import React from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router";



export default function App() {
  const userdispatch = useDispatch()
  useEffect(() => {
    if (localStorage.getItem('googleid')) {
      registerOrLogin({ token: localStorage.getItem('googleid') }).then(res => {
        userdispatch(set_login_user(res?.data))
        userdispatch(set_user_status(true))
      })
    }
  }, [])


  return (
    <React.Fragment>
      <RouterProvider router={approuters} />
      <ToastContainer />
    </React.Fragment>
  );
}
