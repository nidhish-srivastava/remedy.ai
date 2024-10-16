import { useState } from "react";
import AuthNavbar from "../components/AuthNavbar";

function SyntheticDataGenerator() {
  const [numItems, setNumItems] = useState("")
  const [selectedButtonId, setSelectedButtonId] = useState(null)
  const [fileUrl, setFileUrl] = useState("")
  const [canDownloadFile,setCanDownloadFile] = useState(false)
  const [isGenerating,setIsGenerating] = useState(false)

  const features = [
    { id: 1, name: "Breast Cancer", link: "generate_breast_data" },
    { id: 2, name: "Diabetes", link: "generate_diabetes_data" },
    { id: 3, name: "Cleveland Heart Disease", link: "generate_heart_data" },
    { id: 4, name: "Knee X Ray", link: "generate_knee_images" },
    { id: 5, name: "Chest X Ray", link: "generate_chest_images" },
  ]

  const generateDataHandler = async (endpoint) => {
    try {
      let response
      setIsGenerating(true)
      if(selectedButtonId<=3){
        response = await fetch(
          `https://e74d-2409-40f2-32-9d26-89f8-e19d-3283-84ff.ngrok-free.app/${endpoint}`,
          {
            method: "POST",
            body: JSON.stringify({
              num_rows: Number(numItems),
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      }
      else{
        response = await fetch(
          `https://e74d-2409-40f2-32-9d26-89f8-e19d-3283-84ff.ngrok-free.app/${endpoint}`,
          {
            method: "POST",
            body: JSON.stringify({
              num_images: Number(numItems),
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      }
      if (!response.ok) throw new Error("Error")
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setFileUrl(url)
      setCanDownloadFile(true)
      setIsGenerating(false)
    } catch (error) {
      console.error(error)
    }
  };

  const featureClickHandler = async (link, index) => {
    setSelectedButtonId(features[index].id)
    if (selectedButtonId != null) {  // Means that when we change the button that we want to choose as a feature
      setSelectedButtonId(null)
      setNumItems("")
      setCanDownloadFile(false)
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen">
      <AuthNavbar />
      <div className="w-4/5 mx-auto p-4">
        <h2 className="text-3xl mt-4 text-center font-medium">
          Generate Synthetic Data
        </h2>
        <div className="flex flex-col gap-6 items-start">
          <h3 className="mb-2 mt-12 font-medium">Choose one of the options</h3>
          {features.map((feature, index) => (
            <div className="flex w-full items-center" key={feature.id}>
              <button
                key={feature}
                onClick={() => featureClickHandler(feature.link, index)}
                className="bg-blue-500 text-white py-2 px-4 w-1/4 rounded-lg shadow-lg hover:bg-blue-600 transition duration-200"
              >
                {feature.name}
              </button>
              <div className="w-full relative ml-24">
                {index + 1 === selectedButtonId && (
                  <div className="flex items-center justify-between ">
                    <input
                      placeholder={index<=2 ? `Enter the number of fields you want in your csv file` : `Enter the number of images you want in your zip file`}
                      value={numItems}
                      type="number"
                      min={1}
                      max={10}
                      onChange={(e) => setNumItems(e.target.value)}
                      className="w-2/3 py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-sm"
                    />
                    <button
                      disabled={numItems < 1 || isGenerating}
                      className={`bg-blue-500 text-white py-2 px-4 w-1/4 rounded-lg shadow-lg transition duration-200 ${
                        numItems < 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-blue-600"
                      }`}
                      onClick={() => generateDataHandler(feature.link)}
                    >
                      {
                        isGenerating ? "Generating..." : "Generate"
                      }
                    </button>
                    {
                        canDownloadFile && 
                        <>
                        {
                          index<3 ?
                      <a
                        href={fileUrl}
                        download={`${
                          features[Number(selectedButtonId)-1].name
                        }.csv`} // Name for the downloaded file
                        className="absolute right-0 bottom-16 bg-green-500 py-2 px-4 w-1/4 text-white rounded-lg shadow-lg hover:bg-green-600 transition duration-200 text-center"
                      >
                        Download csv file
                      </a> : 
                      <a
                      href={fileUrl}
                      download={`${
                        features[Number(selectedButtonId)-1].name
                      }.zip`} // Name for the downloaded file
                      className="absolute right-0 bottom-16 bg-green-500 py-2 px-4 w-1/4 text-white rounded-lg shadow-lg hover:bg-green-600 transition duration-200 text-center"
                      >
                        Download zip file
                      </a>
                        }
                        </>
                    }
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SyntheticDataGenerator;
