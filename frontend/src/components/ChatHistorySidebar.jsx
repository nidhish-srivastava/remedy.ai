import { useEffect, useState } from "react";
import { useAuthContextHook } from "../context";
import { BASE_URL } from "../utils/constants";
import { Link } from "react-router-dom";

function ChatHistorySidebar() {
  const [chatHistory,setChatHistory] = useState([])
  const { userInfo } = useAuthContextHook();
  
  const fetchAllChatsHandler = async () => {
    if (userInfo?._id?.length > 0) {
      const response = await fetch(`${BASE_URL}/chat/${userInfo?._id}`);
      if (response.ok) {
        const data = await response.json();
        setChatHistory(data?.data);
      }
    }
  };
  useEffect(() => {
    fetchAllChatsHandler();
  }, [userInfo]);

  return (
    <aside className="min-w-[240px] p-[10px] bg-[#202123]  min-h-screen">
        <Link to={`/chat`}>
      <div className="p-[12px] text-left rounded-md hover:bg-[rgba(255,255,255,0.1)] cursor-pointer transition-all">
        <span className="px-[12px]">+</span>
        New chat
      </div>
        </Link>
      <div className="flex flex-col gap-2 mt-6">
        {chatHistory?.map((e) => (
          <Link key={e?._id} to={`/chat/${e?._id}`}>
          <div
            key={e._id}
            className="px-[12px] py-2 text-left rounded-md hover:bg-[rgba(255,255,255,0.1)] cursor-pointer transition-all"
            >
            {e?.messages[0]?.text.slice(0, 10)}
          </div>
            </Link>
        ))}
      </div>
    </aside>
  );
}

export default ChatHistorySidebar;
