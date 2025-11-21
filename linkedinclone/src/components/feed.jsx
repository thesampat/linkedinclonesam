import React, { useEffect, useState } from "react";
import { createPost, getPosts } from "../services/postsServices";
import { useNavigate } from "react-router";
import { useGetLoginUser } from "../customHooks";
import { socket } from "../socket";
import { IoClose } from "react-icons/io5";
import { MdPermMedia } from "react-icons/md";
import { toast } from "react-toastify";
import { IoMdChatbubbles } from "react-icons/io";
import { useSelector } from "react-redux";




export default function Feed() {
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const loginUser = useGetLoginUser()
  const friends = useSelector(state => state?.user?.friends)

  const fetchPosts = () => {
    getPosts().then((res) => {
      setPosts(res?.data || []);
    });
  }

  useEffect(() => {
    fetchPosts()
  }, [loginUser]);


  const handleChat = async (post) => {
    let { _id, name, picture } = post?.authorData || {}
    if (friends?.includes(post?.author) || loginUser?.friends?.includes(post?.author)) {
      navigate(`/chat/${_id}/${name}/${encodeURIComponent(picture)}`)
    } else {
      socket.emit('friend-request', { receiver: post?.authorData?._id, name, sender: loginUser._id, receiver_picture: picture, sender_picture: loginUser?.picture })
    }

  }

  return (
    <div className="bg-gray-100 flex justify-center ">

      <div className="w-full flex flex-col md:flex-row justify-center items-start gap-2 mt-6 px-3">

        <LeftFeed loginUser={loginUser} />
        <CenterFeed loginUser={loginUser} setOpen={setOpen} posts={posts} handleChat={handleChat} />
        <RightFeed />


      </div>
      {open && <CreatePost close={() => setOpen(false)} fetchPosts={fetchPosts} />}
    </div>
  );
}


const CenterFeed = ({ loginUser, setOpen, posts, handleChat }) => {

  useEffect(() => {
    const videos = document.querySelectorAll("video");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.play();
          } else {
            entry.target.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    videos.forEach((video) => observer.observe(video));

    return () => {
      videos.forEach((video) => observer.unobserve(video));
    };
  }, [posts]);

  return (
    <div className="basis-7xl order-2">
      <div className="profilesection bg-white flex justify-center items-center p-5 gap-3 rounded-lg border border-gray-300/80">
        <img src={loginUser?.picture} className="w-12 h-12 rounded-full" alt="" />
        <button onClick={() => setOpen(true)} className=" w-full h-12 text-start text-gray-600 ps-5 font-semibold cursor-pointer  border bg-none border-gray-500 outline-none rounded-full">
          Start a post
        </button>

      </div>
      <br />
      <div className="chat windiw flex flex-col gap-5 h-screen overflow-y-auto custom-scroll p-2">
        {posts?.map((post) => (
          <div
            key={post?._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-3 p-3">
              <img
                src={post?.authorData?.picture}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h2 className="font-semibold text-base text-black capitalize">
                  {post?.authorData?.name}
                </h2>
                <p className="text-xs text-gray-500 text-start p-2">
                  {new Date(post?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="px-3 pb-3 text-gray-800 text-sm text-start bg-gray-50">
              {post?.content}
            </div>

            {post?.file && (
              <div className="w-full bg-gray-50">
                {post?.file.endsWith(".mp4") ? (
                  <video muted playsInline src={import.meta.env.VITE_SERVER_URL + "uploads/" + post?.file} controls className="w-full" />
                ) : (
                  <img
                    src={import.meta.env.VITE_SERVER_URL + post?.file}
                    className="w-full max-h-[380px] object-cover"
                  />
                )}
              </div>
            )}

            <div className="p-3">
              <button
                onClick={() => handleChat(post)}
                className="w-fit px-6 py-2.5 flex items-center gap-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.97] shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden"
              >
                <IoMdChatbubbles className="w-5 h-5 text-white" />
                Chat
              </button>

            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

const LeftFeed = ({ loginUser }) => {
  return (
    <div className="w-full md:basis-3xl md:w-fit order-1">
      <div className="bg-white relative gap-3 rounded-lg border border-gray-300/80 md:mb-4">
        <div className="bg-gray-400 h-15 w-full"></div>
        <img src={loginUser?.picture} className="w-12 h-12 rounded-full absolute left-4 top-10" alt="" />
        <div className="description flex flex-col justify-start items-start mt-8 m-3">
          <p className="text-black font-semibold text-nowrap text-lg">{loginUser?.name}</p>
          <p className="text-black text-[12px]">Mern Remote Developer</p>
          <p className="text-gray-600 text-[12px]">Bangalore, karnataka</p>
        </div>
      </div>
      <div className="bg-white md:flex flex-col justify-between items-start p-5 gap-3 rounded-lg border border-gray-300/80 hidden">
        <div className="flex w-full justify-between"><p className="text-gray-700 font-semibold text-[14px]">Profile viewers</p><p className="text-blue-600 font-semibold text-[12px]">110</p></div>
        <div className="flex w-full justify-between"><p className="text-gray-700 font-semibold text-[14px]">Post impressions</p><p className="text-blue-600 font-semibold text-[12px]">110</p></div>
      </div>
    </div>
  )
}

const RightFeed = () => {
  return (<div className="basis-7xl hidden lg:block order-3">
    <div className="bg-white p-4 rounded-xl shadow-sm sticky top-4">
      <h2 className="font-semibold text-lg text-black mb-3">Suggested Users</h2>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <div>
            <p className="font-semibold text-sm text-black">User Name</p>
            <p className="text-xs text-gray-500">Follow</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <div>
            <p className="font-semibold text-sm text-black">Someone</p>
            <p className="text-xs text-gray-500">Follow</p>
          </div>
        </div>

      </div>
    </div>
  </div>)
}


const CreatePost = ({ close, fetchPosts }) => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const loginUser = useGetLoginUser()


  const handleFile = (e) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;

    setFile(uploaded);

    const type = uploaded.type;

    if (type.startsWith("image/")) {
      setFileType("image");
    } else if (type.startsWith("video/")) {
      setFileType("video");
    } else {
      alert("Only image or video allowed");
      return;
    }

    setFilePreview(URL.createObjectURL(uploaded));
  };

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("content", content);

    if (file) {
      formData.append("file", file);
    }

    try {
      await createPost({ data: formData })
      toast.success("post created")
      fetchPosts()
      close()
      close();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">

      <div className="bg-white w-[90%] max-w-[600px] rounded-xl shadow-lg px-4">

        <div className="flex justify-end items-end border-b pb-2">
          <IoClose
            className="text-2xl font-bold cursor-pointer text-black m-3 my-4"
            onClick={close}
          />
        </div>

        <div className="flex items-center gap-3">
          <img
            src={loginUser?.picture}
            alt="user"
            className="w-10 h-10 rounded-full"
          />
          <p className="font-medium text-black font-semibold text-xl">{loginUser?.name}</p>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full text-black mt-4 p-4 h-32 outline-none resize-none text-lg"
        />

        {/* PREVIEW */}
        {filePreview && fileType === "image" && (
          <div className="mt-3">
            <img src={filePreview} className="rounded-lg max-h-60 object-cover" />
          </div>
        )}

        {filePreview && fileType === "video" && (
          <div className="mt-3">
            <video src={filePreview} className="rounded-lg max-h-60 w-full" controls />
          </div>
        )}

        {/* UPLOAD BUTTON */}
        <div className="mt-4">
          <label className="cursor-pointer flex items-center">
            <MdPermMedia className="w-8 h-8 text-gray-600" />
            <span className="text-black ps-4">Upload Image/Video</span>
            <input
              type="file"
              className="hidden"
              accept="image/*,video/*"
              onChange={handleFile}
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end m-4">
          <button
            onClick={handlePost}
            disabled={!content && !file}
            className={`px-6 py-2 rounded-full text-white font-semibold
              ${content || file ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-300 cursor-not-allowed"}
            `}
          >
            Post
          </button>
        </div>

      </div>
    </div>
  );
}