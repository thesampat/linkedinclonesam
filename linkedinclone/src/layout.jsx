import { Outlet, useNavigate } from "react-router";
import { useGetLoginUser } from "./customHooks";
import { useDispatch } from "react-redux";
import { socket } from "./socket";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { set_friends, set_online_users } from "../redux/reduxslice";
import Headernav from "./components/headernav";
import SplitButtons from "./components/customToast";

const handleToastClose = (res, navi, msg, userRef, dispatch) => {
  toast.dismiss();

  if (res === "reject") {
    console.log("rejected");
  } else {
    socket.emit("friend-response", {
      friend: userRef.current?._id,
      status: "accepted",
      user: msg,
    });

    dispatch(set_friends(msg?.sender))

    navi(`chat/${msg?.sender}/${msg?.name}/${encodeURIComponent(msg?.sender_picture)}`);
  }
};

export default function Layout() {
  const navi = useNavigate();
  const user = useGetLoginUser();
  const dispatch = useDispatch()
  const userRef = useRef();

  useEffect(() => {
    if (user?._id) {
      socket.emit('join-room', user?._id);
      navi('/feed')

    }
  }, [user]);

  useEffect(() => {
    socket.on('user-online', (msg) => {
      dispatch(set_online_users(msg))
    })

    socket.on("friend-response", (msg) => {
      dispatch(set_friends(msg?.receiver))
      navi(`chat/${msg?.receiver}/${msg?.name}/${encodeURIComponent(msg?.receiver_picture)}`);
    });

    socket.on("friend-request", (msg) => {
      const { name } = msg?.msg || {};

      toast.info(
        () => (
          <SplitButtons
            closeToast={(res) => handleToastClose(res, navi, msg?.msg, userRef, dispatch)}
            title={`User ${name} wants to connect with you`}
          />
        ),
        { autoClose: false }
      );
    });
  }, [])


  return (
    <div className="mainwrapper w-screen overflow-x-hidden">
      <Headernav />
      <div className="w-full flex justify-center mt-4 p-0 m-0">
        <div className="max-w-full xl:max-w-5/6 w-full px-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}