import { Groq } from "groq-sdk";
import AuthNavbar from "../components/AuthNavbar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useState } from "react";

const groq = new Groq({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

function DoDonts() {
  const [dodonts, setDoDonts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const storedDiseases = localStorage.getItem("disease");
    // setDiseases(storedDiseases)
    if (storedDiseases.length > 0) {
      const parsedDiseases = JSON.parse(storedDiseases);
      // setDiseases(parsedDiseases)
      console.log(parsedDiseases);
      fetchDoDontHandler(parsedDiseases);
    }
  }, []);
  const fetchDoDontHandler = async (parsedDiseases) => {
    setLoading(true);
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Give me a list of do's and dont's if i am having the following diseases and medical problems : .I want the response in json format in array of string.Dont give any other response please,just the way i want.If there is a single disease then also don't change the structure of your output`,
        },
      ],
      model: "mixtral-8x7b-32768",
    });
    const response = chatCompletion.choices[0]?.message?.content;
    const result = JSON.parse(response);
    // console.log(result);
    setDoDonts(result)
    setLoading(false)
  };
  console.log(dodonts);
  return (
    <div>
      <AuthNavbar />
      <h2 className="text-3xl mt-4 text-center font-medium">
        Do's and Dont'ts
      </h2>
      <div className="mt-14 mb-14">
        {loading ? (
          <div className="w-3/5 mx-auto">
            <Skeleton count={3} />
          </div>
        ) : (
          <div className="w-4/5 flex gap-6 flex-wrap mx-auto justify-around mt-8">
            {Object.entries(dodonts).map(
              ([disease, {do : dos,"don't" : donts}], index) => (
                <div
                key={index}
                className="bg-zinc-600 text-white w-[300px] p-4  rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                <h2 className="text-xl font-semibold mb-4">{disease}</h2>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Do's:</h3>
                  <ul className="list-disc list-inside pl-4">
                    {dos?.map((item, idx) => (
                      <li key={idx} className="text-sm mb-2">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Don'ts:</h3>
                  <ul className="list-disc list-inside pl-4">
                    {donts?.map((item, idx) => (
                      <li key={idx} className="text-sm mb-2">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoDonts;


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