import { useParams } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";
import ChatHistorySidebar from "../components/ChatHistorySidebar";
import useFetchHook from "../hooks/useFetch.hook";
import { BASE_URL, SINHA_API_URL } from "../utils/constants";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import LottieReact from "lottie-react"
import ChatInput from "../components/ui/chatinput";
import loadinganimation from "../assets/loading.json"

function ChatDetail() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const { chatId } = useParams();
  const { data, error } = useFetchHook(`${BASE_URL}/chat/singleChat/${chatId}`);
  if (error != null) return toast.error("Error fetching chat ");
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [fileName, setFileName] = useState("");
  const [loading,setLoading] = useState(false)
  const [language,setLanguage] = useState(null)

  const handleSendMessage = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() !== "") {
        console.log("there -1");
        setLoading(true)
        const newMessages = [
          ...messages,
          { text: input, sender: "user" },
        ];
        setMessages(newMessages)
        setInput("");
        console.log("there before try");
        try {
          const response = await fetch(
            `${SINHA_API_URL}/translate`,{
            headers: {
              'Content-Type': 'application/json',
            },
            method : "POST",
            body : JSON.stringify({article_hi : input,language : 1})
          }
          )
          console.log("there0");
          if(response.ok){
            console.log("There");
            const data = await response.json()
            setLoading(false)
          const newMessages = [
            ...messages,
            {text : input,sender : "user"},
            { text: data?.bot_answer.data, sender: "bot" }, // right now dummy response,i will get it from ml
          ];
          setMessages(newMessages);
        }
      } catch (error) {
        console.error('Error:', error);
        setLoading(false)
      }
      } 
      setTimeout(() => {
        setIsNewMessage(true);
        setTimeout(() => {
          setIsNewMessage(false);
        }, 50);
      }, 500);
    }
  };

  useEffect(()=>{

  },[])

  useEffect(() => {
    if (isNewMessage) {
      // when new message is entered then we update the chat(a delay of 500ms we save,then after 50ms we again make it false)
      updateChatHandler();
    }
  }, [isNewMessage]);

  const updateChatHandler = async () => {
    const response = await fetch(`${BASE_URL}/chat/${chatId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });
    if (response.ok) {
      const data = await response.json();
    }
  };
  useEffect(() => {
    setMessages(data?.messages);
  }, [data]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
      <AuthNavbar />
      {/* <FileUploadBar/> */}
      {/* <button onClick={sendMessage}>Test </button> */}
      <div className="text-center flex lg:w-full bg-[#282c34] text-white">
        <ChatHistorySidebar />
        <section className="flex-1 relative bg-[rgb(52,53,65)] flex flex-col pt-8">
          <div className="flex-1 px-[4rem] mb-24 overflow-y-auto">
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
            {/* {fileName} */}
            {/* <div ref={messagesEndRef} /> */}
          </div>
          {/* Chat input bar */}
          <ChatInput
            fileName={fileName}
            language={language}
            setLanguage={setLanguage}
            handleSendMessage={handleSendMessage}
            setFileName={setFileName}
            input={input}
            setInput={setInput}
          />
        </section>
      </div>
    </div>
  );
}

export default ChatDetail;

// const FileUploadBar = () => {
//   const [file, setFile] = useState(null);
//   const [progress, setProgress] = useState(0);

//   const handleChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile);
//   };

//   const handleUpload = () => {
//     // Simulate file upload progress
//     const interval = setInterval(() => {
//       setProgress((prevProgress) => {
//         if (prevProgress === 100) {
//           clearInterval(interval);
//           return 100;
//         } else {
//           return prevProgress + 10;
//         }
//       });
//     }, 500);
//     // In real scenario, you would use some kind of file upload library or API call here
//   };

//   return (
//     <div className="w-full bg-gray-200 p-4 rounded-lg">
//       <input type="file" onChange={handleChange} className="w-full" />
//       <button
//         onClick={handleUpload}
//         disabled={!file}
//         className={`mt-2 w-full bg-blue-500 text-white font-bold py-2 px-4 rounded ${
//           !file && "opacity-50 cursor-not-allowed"
//         }`}
//       >
//         Upload
//       </button>
//       {progress > 0 && (
//         <div className="mt-2 w-full bg-green-400 h-4 rounded-full">
//           <div
//             className="h-full bg-green-600 rounded-full"
//             style={{ width: `${progress}%` }}
//           ></div>
//         </div>
//       )}
//     </div>
//   );
// };
