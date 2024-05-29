import {  useState } from "react";
import AuthNavbar from "../components/AuthNavbar";
import Button from "../components/ui/button";
import { doctors } from "../assets/merged_file";
import DoctorCard from "../components/DoctorCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

function Doctors() {
  const [query, setQuery] = useState("");
  const [searchedDoctors, setSearchedDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if ((e.key === "Enter" && !e.shiftKey) || e.type=="click") {
      e.preventDefault();
      if (query.trim() !== "") {
        setLoading(true);
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: `You are a medical problem specialist . Give name of speciality of the medical problem that the patient is having : ${query}.Don't give answers out of medical speciality.I want a one word answer only,no other type of response and explaination,just the name of speciality.If the query doesn't pertain to patient's condition then return that ask relevant questions`,
            },
          ],
          model: "mixtral-8x7b-32768",
        });
        const response = chatCompletion.choices[0]?.message?.content;
        const specialist = response.split(".")[0];
        console.log(specialist);
        const filteredDoctors = doctors.filter(
          (doctor) => doctor.Specialty == specialist
        );
        console.log(filteredDoctors);
        setSearchedDoctors(filteredDoctors);
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <AuthNavbar />
      <section className="bg-[#fff9ea]  px-24 py-20">
        <div className="text-center">
          <h2 className="heading">Find Relevant doctors based on your query</h2>
          <div className="max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex  items-center justify-between">
            <input
              type="search"
              placeholder="Search for doctors"
              className="w-full py-4 pl-2 pr-2 focus:outline-none  placeholder:text-head bg-transparent outline-none"
              value={query}
              onKeyDown={handleSearch}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button className="py-4 px-4 rounded-md" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>
      </section>
      <section className="">
        {loading ? (
          <div className="w-4/5 mx-auto mt-4">
            <Skeleton count={3} />
          </div>
        ) : (
          <section className="py-4">
            {searchedDoctors.length != 0 && (
              <p className="text-left px-12 font-bold text-gray-600 mb-4">
                Found {searchedDoctors.length}{" "}
                {searchedDoctors.length === 1 ? "result" : "results"}
              </p>
            )}
            <div className="w-4/5 gap-8 mx-auto grid grid-cols-3">
              {searchedDoctors.map((doctor) => (
                <div key={doctor.Code} className="">
                  <DoctorCard doctor={doctor} />
                </div>
              ))}
            </div>
          </section>
        )}
        <div className="w-4/5 mt-12 gap-12 mx-auto grid grid-cols-3">
          {
            searchedDoctors.length == 0 &&
              //  <div className=" border">
              //   <img src={noresult} alt="" />
              //  </div>
              null
            // doctors.slice(0, 10).map((doctor) => (
            //   <div key={doctor.Code}>
            //     <DoctorCard doctor={doctor} />
            //   </div>
            // ))
          }
        </div>
      </section>
    </div>
  );
}

export default Doctors;
