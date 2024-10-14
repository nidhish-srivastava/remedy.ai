import { useEffect, useState } from "react";
import AuthNavbar from "../components/AuthNavbar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser : true
});

function DietPlan() {
  const [dietPlan, setDietPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status,setStatus] = useState("")
  useEffect(() => {
    const storedDiseases = localStorage.getItem("disease");
    if (storedDiseases?.length > 0 && storedDiseases!="undefined") {
      const parsedDiseases = JSON?.parse(storedDiseases);
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
            content: `Give me a diet plan if i am having the following diseases and medical problems : ${parsedDiseases}.Just give me atleast 5 points in numbers and max of 8 points,no other response,not in the beginning and not in the end,just the 5 points`,
          },
        ],
        model: "mixtral-8x7b-32768",
      });
      const response = chatCompletion.choices[0]?.message?.content;
      const result = parseNumberedPoints(response)
// console.log(response);
      // const result = JSON.parse(response);
      // console.log(result);
      setDietPlan(result);
      setLoading(false);
  };

  console.log(dietPlan);
  function parseNumberedPoints(inputString) {
    // Split the input string by the numbered points using a regular expression
    const points = inputString.split(/\d+\.\s*/).filter(Boolean);
  
    // Trim any extra whitespace from each point
    return points.map(point => point.trim());
  }

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
          // {/* //   {Object.entries(dietPlan).map(
          //   //     ([condition, recommendations], index) => (
          //     //       <DietPlanCard
          //     //         key={index}
          //     //         condition={condition}
          //     //         recommendations={recommendations}
          //     //       />
          //     //     )
          //   //   )} */}
            <div className="w-4/5 flex gap-6 flex-wrap mx-auto mt-8">
            {
              dietPlan?.map((e, index) => (
                <div 
                  key={index}
                  className="mx-auto max-w-[500px] bg-zinc-700 text-white shadow-lg rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out border border-gray-300 p-6"
                >
                  <li className="list-none">
                    {e}
                  </li>
                </div>
              ))
            }
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

// const DietPlanCard = ({ condition, recommendations }) => {
//   return (
//     <div className="mx-auto max-w-[500px] bg-zinc-800 text-white shadow-md overflow-hidden  rounded-lg transform hover:scale-105 transition-transform duration-300 ease-in-out border border-gray-200">
//       <div className="px-6 py-5">
//         <h2 className="text-xl font-semibold text-white mb-4">{condition}</h2>
//         <ul className="list-disc ml-6">
//           {recommendations.map((recommendation, index) => (
//             <li key={index} className="text-gray-400">
//               {recommendation}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };
