import App from "./App";
import { createBrowserRouter } from "react-router";
import GoogleLogin from "./components/login";


const approuters = createBrowserRouter([
{ index:true, Component: GoogleLogin },
]);


export default approuters
