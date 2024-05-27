import { useEffect, useState } from "react";
import AuthNavbar from "../components/AuthNavbar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey:import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser : true
});

function DietPlan() {
  const [dietPlan, setDietPlan] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status,setStatus] = useState("")
  // const [diseases, setDiseases] = useState([]);
  // const diseases = ["Headache", "Piles", "Low sugar","Ulcer","High BP"];
  useEffect(() => {
    const storedDiseases = localStorage.getItem("disease");
    // setDiseases(storedDiseases)
    if (storedDiseases?.length > 0) {
      const parsedDiseases = JSON.parse(storedDiseases);
      // setDiseases(parsedDiseases)
      fetchDietPlanHandler(parsedDiseases)
    }
    else setStatus("No relevant details as of now from user to suggest a diet plan!!!")
  }, []);

  const fetchDietPlanHandler = async (parsedDiseases) => {
    setLoading(true);
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: `Give me a diet plan if i am having the following diseases and medical problems : ${parsedDiseases}.I want the response in json format with the disease name as key and its plans as array of strings.Dont give any other response please,just the way i want`,
          },
        ],
        model: "mixtral-8x7b-32768",
      });
      const response = chatCompletion.choices[0]?.message?.content;
      const result = JSON.parse(response);
      setDietPlan(result);
      setLoading(false);
  };

  return (
    <div className="">
      <AuthNavbar />
      {/* <div className="gap-8 flex justify-center flex-wrap">
        {diseases.length>0 && diseases?.map((disease, index) => (
          <div
            key={index}
            className="px-4 py-2 border cursor-pointer rounded-lg shadow-lg bg-indigo-400 transition duration-300 transform hover:scale-105"
          >
            <h2 className="text-lg font-medium text-white">{disease}</h2>
          </div>
        ))}
      </div> */}
      <h2 className="text-3xl mt-4 text-center font-medium">Your customised diet plan</h2>
      <div className="mt-14">
        {loading ? (
          <div className="w-3/5 mx-auto">
            <Skeleton count={3} />
          </div>
        ) : (
          <div className="w-4/5 flex gap-6 flex-wrap mx-auto mt-8">
            {Object.entries(dietPlan).map(
              ([condition, recommendations], index) => (
                <DietPlanCard
                  key={index}
                  condition={condition}
                  recommendations={recommendations}
                />
              )
            )}
          </div>
        )}
      </div>
      <h2 className="text-center">
      {status}
      </h2>
    </div>
  );
}

export default DietPlan;

const DietPlanCard = ({ condition, recommendations }) => {
  return (
    <div className="mx-auto max-w-[500px] bg-zinc-800 text-white shadow-md overflow-hidden  rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out border border-gray-200">
      <div className="px-6 py-5">
        <h2 className="text-xl font-semibold text-white mb-4">{condition}</h2>
        <ul className="list-disc ml-6">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="text-gray-400">
              {recommendation}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
