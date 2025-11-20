import React, { useEffect } from "react";
import customaxios from "../axios";
import { toast } from "react-toastify";
import reducer, { set_login_user, set_user_status } from "../../redux/reduxslice";
import { useDispatch } from "react-redux";
import { registerOrLogin } from "../services/authService";
import { useGetLoginUser } from "../customHooks";


export default function GoogleLogin() {
  const userdispatch = useDispatch()

  
  useEffect(() => {
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

  const handleResponse=async(response)=>{
    const id_token = response.credential;
    localStorage.setItem('googleid', id_token)
    let data = await registerOrLogin({token:id_token})
    userdispatch(set_login_user(data?.data))
    userdispatch(set_user_status(true))
    
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
