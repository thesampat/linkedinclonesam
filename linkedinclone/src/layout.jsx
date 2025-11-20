import { NavLink, Outlet, useNavigate } from "react-router";
import { useGetLoginUser } from "./customHooks";
import { useDispatch } from "react-redux";
import { socket } from "./socket";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { set_friends } from "../redux/reduxslice";
import { IoSearch } from "react-icons/io5";
import { BiSolidHome } from "react-icons/bi";
import { IoPeopleSharp } from "react-icons/io5";
import { FaSuitcase } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { IoNotificationsSharp } from "react-icons/io5";






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

        navi(`chat/${msg?.sender}/${msg?.name}`);
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
      navi(`chat/${msg?.receiver}/${msg?.name}`);
    });
  }, []); 

  return (
    <div className="mainwrapper w-screen overflow-x-hidden">
      <div className="header flex justify-center items-center bg-white w-full">
        <div className="innerheader flex justify-between gap-20">
        <div className="logoAndSearch flex items-center justify-center gap-10">
          <div className="logoin bg-black rounded w-10 h-10 flex justify-center items-center">
            <p className="text-white font-semibold text-4xl">in</p>
          </div>
          <div className="relative">
          <input type="text" placeholder="Search" className="ps-10 text-black outline-none border border-gray-400 max-w-[300px] rounded-full py-1.5 w-100 hidden md:block" name="" id="" />
          <IoSearch className="w-5 h-5 text-black absolute top-2 left-3 hidden md:block"/>
          </div>

        </div>
        <div className="navs flex justify-center gap-5 py-2">
                <NavLink className='flex flex-col items-center justify-center' to={"home"}>
                  <BiSolidHome className="h-6 w-6 text-gray-600"/>
                  <p className="text-gray-500 text-sm">Home</p>
                  </NavLink>

                   <NavLink className='flex flex-col items-center justify-center' to={"home"}>
                  <IoPeopleSharp className="h-6 w-6 text-gray-600"/>
                  <p className="text-gray-500 text-sm">Network</p>
                  </NavLink>
                  <NavLink className='flex flex-col items-center justify-center' to={"home"}>
                  <FaSuitcase className="h-6 w-6 text-gray-600"/>
                  <p className="text-gray-500 text-sm">Jobs</p>
                  </NavLink>
                  <NavLink className='flex flex-col items-center justify-center' to={"home"}>
                  <MdMessage className="h-6 w-6 text-gray-600"/>
                  <p className="text-gray-500 text-sm">Chat</p>
                  </NavLink>
                  <NavLink className='flex flex-col items-center justify-center' to={"home"}>
                  <IoNotificationsSharp className="h-6 w-6 text-gray-600"/>
                  <p className="text-gray-500 text-sm">Notification</p>
                  </NavLink>
                  <div className='flex flex-col items-center justify-center'>
                  <img src={user?.picture} alt="" className="w-6 h-6 rounded-full" />
                  <p className="text-gray-500 text-sm">Me</p>
                  </div>
                  </div>
        </div>

      </div>
      <div className="w-full flex justify-center mt-4 p-0 m-0">
    <div className="max-w-[900px] w-full px-4">
      <Outlet />
    </div>
  </div>
    </div>
  );
}