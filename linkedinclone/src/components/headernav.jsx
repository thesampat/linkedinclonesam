import { IoSearch } from "react-icons/io5";
import { BiSolidHome } from "react-icons/bi";
import { IoPeopleSharp } from "react-icons/io5";
import { FaSuitcase } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { IoNotificationsSharp } from "react-icons/io5";
import { MdMenu } from "react-icons/md";
import { NavLink } from "react-router";
import { useGetLoginUser } from "../customHooks";
import { useState } from "react";


const HeaderNav=()=>{
      const user = useGetLoginUser();
        const [open, setOpen] = useState(false);


    return(   <div className="header flex justify-center items-center bg-white w-full">
        <div className={window.location.pathname==='/'?'hidden':"innerheader relative flex justify-between gap-10 w-full px-10 py-2 lg:max-w-[60vw]"}>
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
            <NavLink className='flex flex-col items-center justify-center' to={"feed"}>
              <BiSolidHome className="h-6 w-6 text-gray-600" />
              <p className="text-gray-500 text-sm">Home</p>
            </NavLink>

            <NavLink className='flex flex-col items-center justify-center' to={"network"}>
              <IoPeopleSharp className="h-6 w-6 text-gray-600" />
              <p className="text-gray-500 text-sm">Network</p>
            </NavLink>
            <NavLink className='flex flex-col items-center justify-center' to={"jobs"}>
              <FaSuitcase className="h-6 w-6 text-gray-600" />
              <p className="text-gray-500 text-sm">Jobs</p>
            </NavLink>
            <NavLink className='flex flex-col items-center justify-center' to={"chatlist"}>
              <MdMessage className="h-6 w-6 text-gray-600" />
              <p className="text-gray-500 text-sm">Chat</p>
            </NavLink>
            <NavLink className='md:hidden flex flex-col items-center justify-center' to={"notification"}>
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
              <li><NavLink to="/feed" onClick={() => setOpen(false)}>Home</NavLink></li>
              <li><NavLink to="/network" onClick={() => setOpen(false)}>Network</NavLink></li>
              <li><NavLink to="/jobs" onClick={() => setOpen(false)}>Jobs</NavLink></li>
              <li><NavLink to="/chat" onClick={() => setOpen(false)}>Chat</NavLink></li>
              <li><NavLink to="/notifications" onClick={() => setOpen(false)}>Notifications</NavLink></li>
            </ul>
          </div>
        </div>

        <div className={window.location.pathname==='/'?"innerheader relative flex justify-start gap-2 w-full px-10 py-2 lg:max-w-[60vw]":'hidden'}>
          <p className="text-black font-semibold text-4xl">Linked</p>
            <div className="logoin bg-black rounded w-10 h-10 flex justify-center items-center">
              <p className="text-white font-semibold text-4xl">in</p>
          </div>
        </div>

      </div>)
}

export default HeaderNav