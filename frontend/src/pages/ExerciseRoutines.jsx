import { useEffect, useState } from "react";
import AuthNavbar from "../components/AuthNavbar";
import { Groq } from "groq-sdk";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser : true
});
function ExerciseRoutines() {
  const [loading, setLoading] = useState(false);
  const [exerciseRoutines,setExerciseRoutines] = useState([])
  const [status,setStatus] = useState("")
  const fetchExercisePlan = async (parsedDiseases) => {
    setLoading(true);
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Give me a exercise routine since I am having several diseases which needs exercise route to follow regularly.Based on these ${parsedDiseases} give me the response.Don't give any other output,just an array of strings as response.Dont make subparts of an exercise,just return sentences and total array length of 10`,
        },
      ],
      model: "mixtral-8x7b-32768",
    });
    const response = chatCompletion.choices[0]?.message?.content;
    const result = JSON.parse(response)
    setExerciseRoutines(result)
    setLoading(false);
  };
  useEffect(() => {
    const storedDiseases = localStorage.getItem("disease");
    // setDiseases(storedDiseases)
    if (storedDiseases?.length > 0) {
      const parsedDiseases = JSON.parse(storedDiseases);
      // setDiseases(parsedDiseases)
      fetchExercisePlan(parsedDiseases);
    }
    else setStatus("No relevant details as of now from user to suggest exercise routines!!!")
  }, []);
  console.log(typeof exerciseRoutines);
  return (
    <div>
      <AuthNavbar />
      <h2 className="text-3xl mt-4 text-center font-medium">Your Exercise Routine</h2>
      <div className="mt-14">
        {
          loading ? (
            <div className="w-3/5 mx-auto">
            <Skeleton count={3} />
          </div>
          ) : (
            <div className="w-4/5 mx-auto justify-around flex flex-wrap gap-4">
      {exerciseRoutines?.map((exercise, index) => (
        <div
          key={index}
          className="bg-zinc-600 text-white w-[200px] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center justify-center"
        >
          <div className="text-center">
            <h2 className="text-lg font-semibold">{exercise}</h2>
          </div>
        </div>
      ))}
    </div>
          )
        }
      </div>
      <div className="text-center">
      {status}
      </div>
    </div>
  );
}

export default ExerciseRoutines;
