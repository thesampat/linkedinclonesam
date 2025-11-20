import React, { useEffect, useState } from "react";
import { getPosts } from "../services/postsServices";
import { useNavigate } from "react-router";
import { useGetLoginUser } from "../customHooks";
import { socket } from "../socket";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const loginUser = useGetLoginUser()

  useEffect(() => {
    
    if (loginUser?._id) {
    socket.emit('join-room', loginUser._id);
  }

    getPosts().then((res) => {
      setPosts(res?.data || []);
    });
  }, [loginUser]);


  const handleChat=async(post)=>{
    let {_id, name, picture} = post?.authorData||{}
    if(loginUser?.friends?.includes(post?.author)){
          navigate(`/chat/${post.authorData?._id}/${post.authorData?.name}`)
    }else{
      socket.emit('friend-request', {receiver:post?.authorData?._id, name, picture, sender:loginUser._id})
    }
    
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center">
      
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 px-3">

        <div className="hidden md:block md:col-span-3">
          <div className="bg-white p-4 rounded-xl shadow-sm sticky top-4">
            <h2 className="font-semibold text-xl mb-3">Your Profile</h2>
            <p className="text-sm text-gray-600">Quick links & shortcuts</p>

            <div className="mt-4 space-y-2 text-gray-800">
              <p className="hover:text-blue-600 cursor-pointer">My Posts</p>
              <p className="hover:text-blue-600 cursor-pointer">Messages</p>
              <p className="hover:text-blue-600 cursor-pointer">Settings</p>
            </div>
          </div>
        </div>

        {/* MIDDLE FEED */}
        <div className="md:col-span-6 flex flex-col gap-5">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              {/* Header */}
              <div className="flex items-center gap-3 p-3">
                <img
                  src={post.authorData?.picture}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-semibold text-base capitalize">
                    {post.authorData?.name}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="px-3 pb-3 text-gray-800 text-sm">
                {post.content}
              </div>

              {/* Media */}
              {post.file && (
                <div className="w-full bg-gray-50">
                  {post.file.endsWith(".mp4") ? (
                    <video src={post.file} controls className="w-full" />
                  ) : (
                    <img
                      src={post.file}
                      className="w-full max-h-[380px] object-cover"
                    />
                  )}
                </div>
              )}

              {/* Footer Button */}
              <div className="p-3">
                <button
                  onClick={()=>handleChat(post)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
                >
                  Chat
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="hidden md:block md:col-span-3">
          <div className="bg-white p-4 rounded-xl shadow-sm sticky top-4">
            <h2 className="font-semibold text-lg mb-3">Suggested Users</h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                <div>
                  <p className="font-semibold text-sm">User Name</p>
                  <p className="text-xs text-gray-500">Follow</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                <div>
                  <p className="font-semibold text-sm">Someone</p>
                  <p className="text-xs text-gray-500">Follow</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
