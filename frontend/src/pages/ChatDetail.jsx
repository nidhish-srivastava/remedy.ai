import { useParams } from "react-router-dom";
import useFetchHook from "../hooks/useFetch.hook";
import { BASE_URL, FASTAPI_URL } from "../utils/constants";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import LottieReact from "lottie-react";
import ChatInput from "../components/ui/chatinput";
import loadinganimation from "../assets/loading.json";
import ChestXRay from "../components/ChestXRay";
import { uploadImagetoCloudinary } from "../utils/helpers";
import Lottie from "lottie-react";
import Wrapper from "../components/Wrapper";

function ChatDetail() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const { chatId } = useParams();

  const { data, error } = useFetchHook(
    `${BASE_URL}/chat/single_chat/${chatId}`
  );
  if (error != null) return toast.error("Error fetching chat ");

  const [isNewMessage, setIsNewMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [imageUploadIndex, setImageUploadIndex] = useState(null);
  const [image, setImage] = useState(null);

  const [clinicalIndication, setClinicalIndication] = useState("");
  const [techniqueSection, setTechniqueSection] = useState("");
  const [comparison, setComparison] = useState("");
  const [frontalImage, setFrontalImage] = useState(null);
  const [lateralImage, setLateralImage] = useState(null);

  const handleSendMessage = async (e, setFileImage) => {
    if (e.target.files != undefined) {
      e.preventDefault();
      setImageUploadIndex(messages.length);
      const file = e.target?.files[0];
      setFileImage(file);
      const data = await uploadImagetoCloudinary(file);
      const imageUrl = data.url;
      const newMessages = [...messages, { image: imageUrl, sender: "user" }];
      setMessages(newMessages);

      // Making api calls
      // Updating the db
      setTimeout(() => {
        setIsNewMessage(true);
        setTimeout(() => {
          setIsNewMessage(false);
        }, 50);
      }, 500);
    }
  };

  const handleTextMessage = async (e) => {
    if ((e.key === "Enter" && !e.shiftKey) || e.type == "click") {
      if (input.trim != "") {
        const newMessages = [...messages, { text: input, sender: "user" }];
        setMessages(newMessages);
        setInput("");
        // Making api calls
        
        setLoading(true);
        try {
          const formData = new FormData();
          if (serviceName == "general") {
            formData.append("image", image);
            formData.append("query", input);

            const response = await fetch(
              `${FASTAPI_URL}/get_diagnosis_general`,
              {
                method: "POST",
                body: formData,
              }
            );
            const data = await response.json();
            setMessages((prev) => [
              ...prev,
              {
                text: data,
                sender: "bot",
              },
            ]);
            setLoading(false);
          } else if (serviceName == "chest-x-ray") {
            formData.append("frontal_image", frontalImage);
            formData.append("lateral_image", lateralImage);
            formData.append("indication", clinicalIndication);
            formData.append("technique", techniqueSection);
            formData.append("comparision", comparison);
            formData.append("query", input);
            const response = await fetch(`${FASTAPI_URL}/get_diagnosis_CXR`, {
              method: "POST",
              body: formData,
            });
            const data = await response.json();
            setMessages((prev) => [
              ...prev,
              {
                text: data,
                sender: "bot",
              },
            ]);
          } else {
            formData.append("query", input);
            formData.append("image", image);
            const response = await fetch(
              `${FASTAPI_URL}/get_diagnosis_dermat`,
              {
                method: "POST",
                body: formData,
              }
            );
            const data = await response.json();
            console.log(data);
            setMessages((prev) => [
              ...prev,
              {
                text: data,
                sender: "bot",
              },
            ]);
          }
        } catch (error) {
          setLoading(false);
        } finally {
          setLoading(false);
        }
        setTimeout(() => {
          setIsNewMessage(true);
          setTimeout(() => {
            setIsNewMessage(false);
          }, 50);
        }, 500);
      }
    }
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
        body: JSON.stringify(messages),
      });
      if (!response.ok) {
        throw new Error("Error updating the db");
      }
      setImageUploadIndex(null); // When messages array state is updated then we make it null,if we set is after setMessages it wont be useful since useState is async,it wont update at that time so changes wont be visible
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
    <Wrapper>
      <section className="flex-1  relative bg-[rgb(52,53,65)] flex flex-col pt-8">
        {serviceName == "chest-x-ray" && (
          <ChestXRay
            clinicalIndication={clinicalIndication}
            setClinicalIndication={setClinicalIndication}
            techniqueSection={techniqueSection}
            setTechniqueSection={setTechniqueSection}
            comparison={comparison}
            setComparison={setComparison}
            handleSendMessage={handleSendMessage}
            handleTextMessage={handleTextMessage}
            setLateralImage={setLateralImage}
            setFrontalImage={setFrontalImage}
          />
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
          {loading && (
            <div className="w-1/5 mx-auto">
              <Lottie animationData={loadinganimation} />
            </div>
          )}
        </div>
        {/* Chat input bar */}
        <ChatInput
          handleSendMessage={handleSendMessage}
          handleTextMessage={handleTextMessage}
          input={input}
          setInput={setInput}
          setImage={setImage}
        />
      </section>
    </Wrapper>
  );
}

export default ChatDetail;
