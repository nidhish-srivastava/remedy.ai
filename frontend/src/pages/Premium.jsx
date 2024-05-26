import { useRef, useState } from "react";
import AuthNavbar from "../components/AuthNavbar";
import ChatHistorySidebar from "../components/ChatHistorySidebar";
import { MdAttachFile } from "react-icons/md";
import { BiSend } from "react-icons/bi";
import { AKASH_API_URL } from "../utils/constants";

function Premium() {
  const [loading,setLoading] = useState(false)
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [filename,setFileName] = useState("")

  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    // Handle the file input change event
    const file = event.target.files[0];
    setFileName("Uploading...")
    // console.log(file);
    if (file) {
      // console.log("Selected file:", file.name);
      // Assuming you're using fetch for API calls, you can update the backend here
      const formData = new FormData();

      formData.append("files", file);
      const metadata = { content: "Medical report" };
      formData.append("metadata", JSON.stringify(metadata));
      console.log("before try catch", formData);
      try {
        const response = await fetch(
          `${AKASH_API_URL}/upload/files`,
          {
            method: "POST",
            body: formData,
            // Add headers if required, e.g., for authentication
          }
        );
        console.log("after response");
        if (!response.ok) {
          throw new Error("Failed to upload file");
        }
        console.log("after response checking error");
        setFileName(`${file.name} uploaded successfully`)
        // Handle success response if needed
      } catch (error) {
        console.error("Error uploading file:", error.message);
        // Handle error if needed
      }
    }
  };

  const fileUploadHandler = () => {
    fileInputRef.current.click();
  };
    const QueryPdfHandler = async(e)=>{
    if (e.key === "Enter" && !e.shiftKey) {
        console.log(e);
        e.preventDefault();
      if (input.trim() !== "") {
        console.log("there -1");
        setLoading(true)
        const newMessages = [
            ...messages,
            { text: input, sender: "user" },
          ];
          setMessages(newMessages)
          setInput("")
          console.log("before try");
          try {
            const response = await fetch(
              `${AKASH_API_URL}/get_response`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: input}),
              }
            );
            if (!response.ok) throw new Error("Errror fetching");
            const data = await response.json();
            setLoading(false)
            const newMessages = [
                ...messages,
                { text: input, sender: "user" },
                { text: data?.answer, sender: "bot" }, // right now dummy response,i will get it from ml
              ];
              setMessages(newMessages);
            console.log(data);
          } catch (error) {
            
          }
      }
    }
    }
  return (
    <div>
      <AuthNavbar />
      <div className="text-center flex lg:w-full bg-[#282c34] text-white">
        <ChatHistorySidebar />
        <section className="flex-1 relative bg-[rgb(52,53,65)] flex flex-col pt-8">
        <div className="flex-1 px-[4rem] mb-24 overflow-y-auto">
           
           {
            filename
           }
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
            {
              loading && "Loading"
            }
            {/* {fileName} */}
            {/* <div ref={messagesEndRef} /> */}
          </div>
          
        </section>
        <div className="fixed bottom-0 right-8 w-4/5 px-[2rem] py-[1rem]">
      {/* <button onClick={queryFromPdfHandler}>Test</button> */}
      <input
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
      </span>
      <textarea
        placeholder="Write your medical queries"
        className="resize-none  bg-[#40414f] py-[12px] px-[3rem] w-full rounded-md border-none outline-none shadow-[0_0_8px_0_rgba(0,0,0,0.25)] text-white font-[1.25em]"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={QueryPdfHandler}
        rows={input?.split("\n").length > 5 ? 5 : 1}
      />
      {/* <button
        disabled={file==null}
        className={`absolute right-10 text-2xl cursor-pointer pr-1 top-7`}
        onClick={QueryPdfHandler}
      >
        <BiSend />
      </button> */}
    </div>
      </div>
    </div>
  );
}

export default Premium;
