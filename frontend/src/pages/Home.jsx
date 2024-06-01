import { Link } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";
import { RAG_BACKEND_URL, homePageFeatures } from "../utils/constants";
import { useEffect } from "react";
import { useAuthContextHook } from "../context";
// Diet PLan
// Exercise
// Do's and dont's

function Home() {
  const { userInfo } = useAuthContextHook();
 
    //     useEffect(() => {
    // if (userInfo?.email?.length > 0) {
      // namespacePushHandler();
      // setTimeout(()=>{
        //   fetchDiseaseHandler();
        // },200)
      // }
  // }, []);
  return (
    <div>
      <AuthNavbar />
      <div className="w-4/5 mx-auto p-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {homePageFeatures.map((feature, index) => (
            <Link to={`${feature.path}`} key={index}>
              <div
                key={index}
                className="max-w-sm rounded overflow-hidden shadow-lg bg-white"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={feature.image}
                    alt={feature.heading}
                  />
                </div>
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">
                    {feature.heading}
                  </div>
                  <p className="text-gray-700 text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
