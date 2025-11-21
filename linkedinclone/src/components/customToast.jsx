const SplitButtons=({ closeToast, title })=>{
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



export default SplitButtons