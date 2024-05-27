import React, { useEffect, useRef, useState } from "react";
import AuthNavbar from "../components/AuthNavbar";
import { BASE_URL, SINHA_API_URL } from "../utils/constants";
import { useAuthContextHook } from "../context";
import ChatHistorySidebar from "../components/ChatHistorySidebar";
import { useNavigate } from "react-router-dom";
import ChatInput from "../components/ui/chatinput";
import loadinganimation from "../assets/loading.json"
import LottieReact from "lottie-react"
function Chat() {
  const [messages, setMessages] = useState([]);
  const { userInfo } = useAuthContextHook();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const [isNewChat, setIsNewChat] = useState(false);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [language,setLanguage] = useState(null)

  const handleSendMessage = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() !== "") {
        setLoading(true);
        console.log("there -1");
        const newMessages = [...messages, { text: input, sender: "user" }];
        setMessages(newMessages);
        setInput("");
        try {
          const response = await fetch(
            `${SINHA_API_URL}/translate`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({ article_hi: input, language: 1 }),
            }
          );
          console.log("there0");
          if (response.ok) {
            const data = await response.json();
            console.log("There",data);
            setLoading(false);
            const newMessages = [
              ...messages,
              { text: input, sender: "user" },
              { text: data?.bot_answer?.data, sender: "bot" }, // right now dummy response,i will get it from ml
            ];
            setMessages(newMessages);
          }
        } catch (error) {
          console.error("Error:", error);
          setLoading(false);
        }
      }
      setIsNewChat(true);
      console.log(data);
    }
  };

  const createChatHandler = async () => {
    const response = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages, userId: userInfo._id }),
    });
    if (response.ok) {
      const data = await response.json();
      // console.log(data);
      navigate(`/chat/${data?.data?._id}`);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      // adding a delay after getting response
      if (isNewChat) {
        createChatHandler();
      }
    }, 1000);
  }, [isNewChat]);

  const dummyQueries = [
    "Symptoms & relief for seasonal allergies?",
    "Home remedies for migraine relief?",
    "Latest cancer treatment advancements?",
    "Distinguishing arthritis from aging joint pain?",
  ];

  return (
    <div className="">
      <AuthNavbar />
      <div className="text-center flex lg:w-full bg-[#282c34] text-white">
        <ChatHistorySidebar />
        <section className="flex-1 relative bg-[rgb(52,53,65)] flex flex-col pt-8">
          {/* When we haven't started the conversation then what to show */}
          {!isNewChat && (
            <div className="flex gap-4 justify-center mt-24 cursor-pointer">
              {dummyQueries.map((e) => (
                <div
                  onClick={() => setInput(e)}
                  className="border-[1px] flex w-[200px]  hover:bg-slate-500 border-white text-white text-opacity-40 hover:text-opacity-100 rounded-2xl py-3 border-opacity-20 gap-12 bg-transparent"
                >
                  {e}
                </div>
              ))}
            </div>
          )}
          {/* Chat messages */}
          <div className="flex-1 px-[4rem] mb-24 overflow-y-auto">
            {/* {fileName}  */}
            {messages?.map((message, index) => (
              <div
                key={index}
                className={`p-[12px] my-[8px] rounded-md ${
                  message.sender === "user"
                    ? "bg-[#40414f] text-white max-w-4/5 w-fit ml-auto text-right"
                    : " text-white max-w-4/5 w-fit mr-auto text-left"
                }`}
              >
                {message.text}
              </div>
            ))}
            {loading && 
            <div className="w-2/5 mx-auto">
            <LottieReact animationData = {loadinganimation}/>
            </div>
            }
          </div>
          {/* Chat input bar */}
          <ChatInput
            setFileName={setFileName}
            language={language}
            setLanguage={setLanguage}
            handleSendMessage={handleSendMessage}
            input={input}
            setInput={setInput}
          />
        </section>
      </div>
    </div>
  );
}

export default Chat;
