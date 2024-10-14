import { useParams } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";
import ChatHistorySidebar from "../components/ChatHistorySidebar";
import useFetchHook from "../hooks/useFetch.hook";
import { BASE_URL } from "../utils/constants";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import LottieReact from "lottie-react";
import ChatInput from "../components/ui/chatinput";
import loadinganimation from "../assets/loading.json";
import ChestXRay from "../components/ChestXRay";
import { uploadImagetoCloudinary } from "../utils/helpers";

function ChatDetail() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const { chatId } = useParams();

  const { data, error } = useFetchHook(`${BASE_URL}/chat/singleChat/${chatId}`);
  if (error != null) return toast.error("Error fetching chat ");

  const [isNewMessage, setIsNewMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [imageUploadIndex,setImageUploadIndex] = useState(null)

  const handleSendMessage = async (e) => {
    // For handling image input
    if (e.target.files != undefined) {
      setImageUploadIndex(messages.length)
      const file = e.target?.files[0];
      const data = await uploadImagetoCloudinary(file);
      const imageUrl = data.url;
      const newMessages = [...messages, { image: imageUrl, sender: "user" }];
      setMessages(newMessages);
      // Updating the db
      setTimeout(() => {
        setIsNewMessage(true);
        setTimeout(() => {
          setIsNewMessage(false);
        }, 50);
      }, 500);
    }

    // For handling text input
    if ((e.key === "Enter" && !e.shiftKey) || e.type == "click") {
      e.preventDefault();
      if (input.trim() != "") {
        const newMessages = [...messages, { text: input, sender: "user" }];
        setMessages(newMessages);
        setInput("");
        // Updating the db
        setTimeout(() => {
          setIsNewMessage(true);
          setTimeout(() => {
            setIsNewMessage(false);
          }, 50);
        }, 500);
      }
    }

    // API CALLS for getting response from our fast api backend
    // setLoading(true);
    // try {
    //   if (serviceName == "general") {
    //     const response = await fetch(
    //       `${RAG_BACKEND_URL}/get_diagnosis_general`,
    //       {
    //         method: "POST",
    //         body: formData,
    //       }
    //     );
    //     const data = await response.json();
    //     setMessages((prev) => [
    //       ...prev,
    //       {
    //         text: data.output[0],
    //         sender: "bot",
    //       },
    //     ]);
    //   } else if (serviceName == "chest-x-ray") {
    //     const response = await fetch(`${RAG_BACKEND_URL}/get_diagnosis_CXR`, {
    //       method: "POST",
    //       body: formData,
    //     });
    //     const data = await response.json();
    //     setMessages((prev) => [
    //       ...prev,
    //       {
    //         text: data.output[0],
    //         sender: "bot",
    //       },
    //     ]);
    //   } else {
    //     const response = await fetch(
    //       // `${RAG_BACKEND_URL}/get_diagnosis_dermat`,
    //       `https://2da5-34-46-31-163.ngrok-free.app/process`,
    //       {
    //         method: "POST",
    //         body: formData,
    //       }
    //     );
    //     const data = await response.json();
    //     setMessages((prev) => [
    //       ...prev,
    //       {
    //         text: data.output[0],
    //         sender: "bot",
    //       },
    //     ]);
    //   }
    // setLoading(false);
    // } catch (error) {
    //   setLoading(false);
    // }
    // finally{
    //   setLoading(false);
    // }

    // We are updating the chat so creating a timer which runs after 500ms of sending message,it updates chat in db
  };

  useEffect(() => {
    if (isNewMessage) {
      // when new message is entered then we update the chat(a delay of 500ms we save,then after 50ms we again make it false)
      updateChatHandler();
    }
  }, [isNewMessage]);

  const updateChatHandler = async () => {
    try {
      const response = await fetch(`${BASE_URL}/chat/${chatId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });
      if (!response.ok) {
        throw new Error("Error updating the db");
      }
      setImageUploadIndex(null)  // When messages array state is updated then we make it null,if we set is after setMessages it wont be useful since useState is async,it wont update at that time so changes wont be visible
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // when we open chat then updating the state when we get data from the api for this chat
    setServiceName(data?.service);
    setMessages(data?.messages);
  }, [data]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  

  return (
    <div>
      <AuthNavbar />
      <div className="text-center flex lg:w-full bg-[#282c34] text-white">
        <ChatHistorySidebar />
        <section className="flex-1  relative bg-[rgb(52,53,65)] flex flex-col pt-8">
          {serviceName == "chest-x-ray" && (
            <ChestXRay handleSendMessage={handleSendMessage} />
          )}
          <div className="flex-1 px-[4rem] mb-24 overflow-y-auto">
            {messages?.map((message, index) => (
              <div
                key={index}
                className={`p-[12px] my-[8px] rounded-md ${
                  message.sender === "user"
                    ? "bg-[#40414f] text-white max-w-4/5 w-fit ml-auto text-right"
                    : "text-white max-w-4/5 w-fit mr-auto text-left"
                }`}
              >
                {message.image && imageUploadIndex == index ? (
                  <div className="w-20 mx-auto mb-2">
                    <LottieReact animationData={loadinganimation} />
                  </div>
                ) : (
                  message.image && (
                    <div>
                      <img
                        src={message.image}
                        alt="Preview"
                        style={{
                          width: "auto",
                          height: "250px",
                          display: "block",
                          margin: "0 auto",
                        }}
                      />
                    </div>
                  )
                )}
                {message.text && <div>{message.text}</div>}
              </div>
            ))}
          </div>

          {/* Chat input bar */}
          <ChatInput
            handleSendMessage={handleSendMessage}
            input={input}
            setInput={setInput}
          />
        </section>
      </div>
    </div>
  );
}

export default ChatDetail;
