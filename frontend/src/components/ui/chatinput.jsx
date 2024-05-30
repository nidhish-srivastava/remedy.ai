// import { useRef } from "react";
// import { MdAttachFile } from "react-icons/md";
import { BiSend } from "react-icons/bi";

function ChatInput({
  input,
  setInput,
  handleSendMessage
}) {
  
  return (
    <div className="fixed bottom-0 right-8 w-4/5 px-[2rem] py-[1rem]">
      {/* <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <span
        onClick={fileUploadHandler}
        className="absolute top-7 pl-1 text-2xl cursor-pointer"
      >
        <MdAttachFile />
      </span> */}
      <textarea
        placeholder="Write your medical queries"
        className="resize-none  bg-[#40414f] py-[12px] px-[3rem] w-full rounded-md border-none outline-none shadow-[0_0_8px_0_rgba(0,0,0,0.25)] text-white font-[1.25em]"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleSendMessage}
        rows={input?.split("\n").length > 5 ? 5 : 1}
      />
      <button
        className="absolute right-10 text-2xl cursor-pointer pr-1 top-7"
        onClick={handleSendMessage}
      >
        <BiSend />
      </button>
      {/* <select
        name="language"
        id="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className={`absolute right-20 top-7 bg-inherit border w-fit border-gray-100 border-opacity-20 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
      >
        <option value="1">English</option>
        <option value="2">Hindi</option>
        <option value="3">Kannada</option>
      </select> */}
    </div>
  );
}

export default ChatInput;
