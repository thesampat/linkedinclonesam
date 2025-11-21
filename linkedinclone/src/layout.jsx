import { NavLink, Outlet, UNSAFE_useFogOFWarDiscovery, useNavigate } from "react-router";
import { useGetLoginUser } from "./customHooks";
import { useDispatch } from "react-redux";
import { socket } from "./socket";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { set_friends, set_online_users } from "../redux/reduxslice";
import { IoSearch } from "react-icons/io5";
import { BiSolidHome } from "react-icons/bi";
import { IoPeopleSharp } from "react-icons/io5";
import { FaSuitcase } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { IoNotificationsSharp } from "react-icons/io5";
import { MdMenu } from "react-icons/md";







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
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch()


  const userRef = useRef();
  useEffect(() => {
    userRef.current = user;
     if (userRef.current?._id) {
    }
  }, [user]);

  useEffect(() => {
    console.log('is user exisist', user?._id)
    if(user?._id){
      console.log('rinnnn', user?._id)
      socket.emit('join-room', user?._id);
    }
  
  return () => {
    // socket.off("user-online");   //on logout
  };
}, [user]);

useEffect(()=>{
   socket.on('user-online', (msg) => {
    console.log('user online now', msg)
    dispatch(set_online_users(msg))
   })

  return () => socket.off("user-online");
}, [])

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

        dispatch(set_friends(msg?.sender))

        navi(`chat/${msg?.sender}/${msg?.name}/${encodeURIComponent(msg?.sender_picture)}`);
      }
    };

    socket.on("friend-request", (msg) => {
      const { name } = msg?.msg || {};

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
      dispatch(set_friends(msg?.receiver))
      navi(`chat/${msg?.receiver}/${msg?.name}/${encodeURIComponent(msg?.receiver_picture)}`);
    });
  }, []);

  return (
    <div className="mainwrapper w-screen overflow-x-hidden">
      <div className="header flex justify-center items-center bg-white w-full">
        <div className="innerheader relative flex justify-between gap-10 w-full px-10 py-2 lg:max-w-[60vw]">
          <div className="logoAndSearch flex items-center justify-center gap-10">
            <div className="logoin bg-black rounded w-10 h-10 flex justify-center items-center">
              <p className="text-white font-semibold text-4xl">in</p>
            </div>
            <div className="relative">
              <input type="text" placeholder="Search" className="ps-10 text-black outline-none border border-gray-400 max-w-[300px] rounded-full py-1.5 w-100 hidden md:block" name="" id="" />
              <IoSearch className="w-5 h-5 text-black absolute top-2 left-3 hidden md:block" />
            </div>

          </div>
          <div className="navs hidden sm:flex justify-center gap-5 py-2 ">
            <NavLink className='flex flex-col items-center justify-center' to={"home"}>
              <BiSolidHome className="h-6 w-6 text-gray-600" />
              <p className="text-gray-500 text-sm">Home</p>
            </NavLink>

            <NavLink className='flex flex-col items-center justify-center' to={"home"}>
              <IoPeopleSharp className="h-6 w-6 text-gray-600" />
              <p className="text-gray-500 text-sm">Network</p>
            </NavLink>
            <NavLink className='flex flex-col items-center justify-center' to={"home"}>
              <FaSuitcase className="h-6 w-6 text-gray-600" />
              <p className="text-gray-500 text-sm">Jobs</p>
            </NavLink>
            <NavLink className='flex flex-col items-center justify-center' to={"home"}>
              <MdMessage className="h-6 w-6 text-gray-600" />
              <p className="text-gray-500 text-sm">Chat</p>
            </NavLink>
            <NavLink className='md:hidden flex flex-col items-center justify-center' to={"home"}>
              <IoNotificationsSharp className="h-6 w-6 text-gray-600" />
              <p className="text-gray-500 text-sm">Notification</p>
            </NavLink>
            <div className='flex flex-col items-center justify-center'>
              <img src={user?.picture} alt="" className="w-6 h-6 rounded-full" />
              <p className="text-gray-500 text-sm">Me</p>
            </div>
          </div>


          <button className="block sm:hidden" onClick={() => setOpen(true)}><MdMenu className="w-8 h-8 text-black" /></button>

          {/* Offcanvas Menu */}
          <div
            
            className={`fixed top-0 right-0 h-full z-10 w-64 bg-white shadow-xl p-6 transition-transform duration-300 
       ${open ? "translate-x-0" : "translate-x-full"}`}
          >
            <div className="flex w-full justify-between items-center mb-4">
                          <h2 className="text-lg font-semibold text-black">My Menu</h2>

            <button onClick={()=>setOpen(false)} className="text-black cursor-pointer">X</button>
            </div>
            <ul className="space-y-4">
              <li><NavLink to="/home" onClick={() => setOpen(false)}>Home</NavLink></li>
              <li><NavLink to="/network" onClick={() => setOpen(false)}>Network</NavLink></li>
              <li><NavLink to="/jobs" onClick={() => setOpen(false)}>Jobs</NavLink></li>
              <li><NavLink to="/chat" onClick={() => setOpen(false)}>Chat</NavLink></li>
              <li><NavLink to="/notifications" onClick={() => setOpen(false)}>Notifications</NavLink></li>
            </ul>
          </div>
        </div>

      </div>
      <div className="w-full flex justify-center mt-4 p-0 m-0">
        <div className="max-w-full xl:max-w-5/6 w-full px-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}