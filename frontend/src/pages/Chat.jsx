import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useAuthContextHook } from "../context";
import { useLocation, useNavigate } from "react-router-dom";
import Wrapper from "../components/Wrapper";

function Chat() {
  const { userInfo } = useAuthContextHook();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const servicename = queryParams.get("service");

  const createChatHandler = async () => {
    const autogenMessage = [
      {
        text: `Welcome to ${servicename} service.Start asking your queries,`,
        sender: "bot",
      },
    ];
    const response = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: autogenMessage, userId: userInfo._id,service : servicename }),
    });
    if (response.ok) {
      const data = await response.json();
      navigate(`/chat/${data?.data?._id}`);
    }
  };
  useEffect(() => {
    if (servicename) {
      createChatHandler();
    }
  }, [servicename]);



  const services = [
    {
      name: "Chest X ray",
      link: "chest-x-ray",
    },
    {
      name: "Dermatology",
      link: "dermatology",
    },
    {
      name: "General",
      link: "general",
    },
  ];

  const selectServiceHandler = (link) => {
    navigate(`?service=${link}`);
  };

  return (
    <Wrapper>
      <section className="flex-1 relative bg-[rgb(52,53,65)] flex flex-col pt-8">
        {/* When we haven't started the conversation then what to show */}
        {servicename == null && (
          <>
            <h3 className="text-2xl font-medium text-center text-slate-300 mt-8">
              Choose your section
            </h3>
            <div className="flex flex-wrap gap-6 justify-center mt-12 cursor-pointer">
              {services.map((e) => (
                <div
                  key={e.name}
                  onClick={() => selectServiceHandler(e.link)}
                  className="py-4 px-6 border border-gray-300 flex justify-center text-lg w-48 hover:bg-blue-500 hover:text-white text-black text-opacity-90 hover:text-opacity-100 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105  bg-slate-200"
                >
                  {e.name}
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </Wrapper>
  );
}

export default Chat;
