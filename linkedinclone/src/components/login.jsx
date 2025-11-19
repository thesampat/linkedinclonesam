import React, { useEffect } from "react";
import customaxios from "../axios";
import { toast } from "react-toastify";
import { set_login_user, set_user_status } from "../../redux/reduxslice";
import { useReducer } from "react";
import { useDispatch } from "react-redux";


const postLogin = async (id, reducer) => {
  try {
    let res = await customaxios.post('auth', { googleid: id })
    reducer(set_login_user(res.data?.data?.user?.[0]))
    reducer(set_user_status(true))
  } catch (error) {
    console.log(error)
    toast.error(error?.response?.data?.message||'login failed')
  }
}

export default function GoogleLogin({ onSuccess }) {
  const userdispatch = useDispatch()
  
  useEffect(() => {


    customaxios.get('post').then(res=>{
      console.log(res?.data?.data)
    })

    const scriptId = "google-login-script";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.id = scriptId;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = initializeGoogle;
    } else {
      initializeGoogle();
    }
  }, []);

  function initializeGoogle() {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
      callback: handleResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      {
        theme: "filled_blue",
        size: "large",
        shape: "pill",
        width: 300,
      }
    );
  }

  const handleResponse=(response)=>{
    const id_token = response.credential;
    try {
      console.log(id_token)
      postLogin(id_token, userdispatch)
    } catch (error) {
      
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-white text-center mb-6">
          Login with Google
        </h1>

        <div id="googleSignInDiv" className="flex justify-center"></div>

        <p className="text-gray-400 text-xs text-center mt-4">
          Continue securely using your Google account
        </p>
      </div>
    </div>
  );
}
