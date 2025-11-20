import { NavLink, Outlet, useNavigate } from "react-router";
import { useGetLoginUser } from "./customHooks";
import { useDispatch } from "react-redux";
import { socket } from "./socket";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { set_friends } from "../redux/reduxslice";


function SplitButtons({ closeToast, title }) {
  return (
    <div className="w-full min-w-[250px] p-4 flex flex-col gap-4 bg-white rounded-xl shadow-md">

      <p className="text-sm font-medium text-gray-800">
        {title}
      </p>

      <div className="flex gap-3">

        <button
          onClick={() => closeToast("reject")}
          className="w-full py-2 rounded-lg border border-red-500 text-red-600 font-medium hover:bg-red-50 active:scale-[0.98] transition"
        >
          Reject
        </button>

        <button
          onClick={() => closeToast("accept")}
          className="w-full py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 active:scale-[0.98] transition"
        >
          accept
        </button>

      </div>
    </div>
  );
}

export default function Layout() {
  const navi = useNavigate();
  const user = useGetLoginUser();
  const dispatch = useDispatch();

  const userRef = useRef();
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    const handleToastClose = (res, msg) => {
      toast.dismiss();

      if (res === "reject") {
        console.log("rejected");
      } else {
        socket.emit("friend-response", {
          friend: userRef.current?._id,
          status: "accepted",
          user: msg,
        });

        navi(`chat/${msg?.user}/${msg?.name}`);
      }
    };

    socket.on("friend-request", (msg) => {
      const { friend, name, picture } = msg?.msg || {};

      toast.info(
        () => (
          <SplitButtons
            closeToast={(res) => handleToastClose(res, msg?.msg)}
            title={`User ${name} wants to connect with you`}
          />
        ),
        { autoClose: false }
      );
    });

    socket.on("friend-response", (msg) => {
      navi(`chat/${msg?.sender}/${msg?.name}`);
    });
  }, []); // 👈 IMPORTANT: empty dependency

  return (
    <div>
      <div className="header flex jusity-center items-center gap-10 bg-white/100 p-2 rounded">
        <button onClick={() => navi(-1)}>Back</button>
        <NavLink to={"chat"}>Chat</NavLink>
        <NavLink to={"home"}>Feed</NavLink>
        <img src={user?.picture} alt="" className="w-10 h-10" />
      </div>
      <Outlet />
    </div>
  );
}