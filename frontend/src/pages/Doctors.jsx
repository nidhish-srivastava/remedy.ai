import { useEffect, useState } from "react";
import AuthNavbar from "../components/AuthNavbar";
import Button from "../components/ui/button";
import { doctors } from "../assets/merged_file";
import DoctorCard from "../components/DoctorCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SINHA_API_URL } from "../utils/constants";
import noresult from "../assets/noresults.png";

function Doctors() {
  const [query, setQuery] = useState("");
  const [searchedDoctors, setSearchedDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFound, setIsFound] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SINHA_API_URL}/best-speciality`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: query }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.bot_answer.data.split("> "));
        const parsedData = data.bot_answer.data.split("> ")[1].replace(/\s+/g, '');
        if (parsedData == "No doctors found") {
          setLoading(false);
          return;
        }
          const filteredDoctors = doctors.filter(
            (doctor) => doctor.Specialty == parsedData
          );
          // console.log(filteredDoctors);
          setSearchedDoctors(filteredDoctors);
          setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  // useEffect(()=>{
  //   if(query.length==0){
  //     setLoading(false)
  //     setIsClicked(false)
  //   }
  // },[query])
  // const trimmedQuery = query.trim();
  // if (trimmedQuery) {
  //   const regex = new RegExp(trimmedQuery, "i");
  //   const filteredDoctors = doctors.filter((doctor) =>
  //     regex.test(doctor.Name)
  //   );
  //   setSearchedDoctors(filteredDoctors);
  // } else {
  //   setSearchedDoctors([]);
  // }
  // useEffect(() => {
  //   if(query.length==0) setSearchedDoctors([])
  //   const debounce = setTimeout(() => {
  //       handleSearch();
  //   }, 3000);
  //   return () => clearTimeout(debounce);
  // }, [query]);
  console.log(searchedDoctors);
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
