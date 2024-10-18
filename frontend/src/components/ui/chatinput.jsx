import { useRef, useState } from "react";
import { BiSend } from "react-icons/bi";
import { MdAttachFile } from "react-icons/md";

function ChatInput({
  input,
  setInput,
  handleSendMessage,
  handleTextMessage,
  setImage
}) {
  const [isUploaded,setIsUploaded] = useState(false)
  const fileInputRef = useRef(null);
  const fileUploadHandler = () => {
    fileInputRef.current.click();
    setIsUploaded(true)
  };
  
  return (
    <div className="fixed bottom-0 right-8 w-4/5 px-[2rem] py-[1rem]">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e)=>handleSendMessage(e,setImage)}
      />
      <span
        onClick={fileUploadHandler}
        className="absolute top-7 pl-1 text-2xl cursor-pointer"
      >
        <MdAttachFile />
      </span>
      <textarea
        placeholder="Upload images then ask our chatbot"
        className="resize-none  bg-[#40414f] py-[12px] px-[3rem] w-full rounded-md border-none outline-none shadow-[0_0_8px_0_rgba(0,0,0,0.25)] text-white font-[1.25em]"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleTextMessage}
        rows={input?.split("\n").length > 5 ? 5 : 1}
      />
      <button
        className="absolute right-10 text-2xl cursor-pointer pr-1 top-7"
        onClick={handleTextMessage}
      >
        <BiSend />
      </button>
    </div>
  );
}

export default ChatInput;
