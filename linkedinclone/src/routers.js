import App from "./App";
import { createBrowserRouter } from "react-router";
import GoogleLogin from "./components/login";
import ChatPage from "./components/chat";


const approuters = createBrowserRouter([
{ index:true, Component: GoogleLogin },
{ path:'chat', Component: ChatPage },
]);


export default approuters
