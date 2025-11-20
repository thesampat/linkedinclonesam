import App from "./App";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import GoogleLogin from "./components/login";
import ChatPage from "./components/chat";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./layout";
import Feed from "./components/feed";


const approuters = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Layout/>}>
        <Route element={<ProtectedRoute />}>
        
      </Route>
      <Route path="chat/:user/:name" element={<ChatPage />} />
          <Route path="home" element={<Feed />} />
         <Route index element={<GoogleLogin />} />
        <Route path="*" element={<h1>Page not found</h1>} />
    </Route>
));


[
{ index:true, Component: GoogleLogin },
 {
    path: "chat",
    element: <ChatPage/>
  },
]

export default approuters
