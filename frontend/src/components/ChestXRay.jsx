import { useState } from "react";

function ChestXRay({handleSendMessage}) {
    const [clinicalIndication, setClinicalIndication] = useState("");
    const [techniqueSection, setTechniqueSection] = useState("");
    const [comparison, setComparison] = useState("");
   
  return (
    <div className="space-y-2">
              <div className="flex justify-center items-center gap-4">
                <label className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 cursor-pointer">
                  Upload Frontal Chest X Ray
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleSendMessage}
                  />
                </label>

                <label className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 cursor-pointer">
                  Upload Lateral Chest X Ray
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleSendMessage}
                  />
                </label>
              </div>
              <div className="flex flex-col w-1/2 mx-auto">
                <input
                  type="text"
                  placeholder="Clinical Indication Text"
                  value={clinicalIndication}
                  onChange={(e) => setClinicalIndication(e.target.value)}
                  className="border outline-none text-black border-gray-300 rounded py-2 px-4 mb-2 w-full"
                />
                <input
                  type="text"
                  placeholder="Technique Section"
                  value={techniqueSection}
                  onChange={(e) => setTechniqueSection(e.target.value)}
                  className="border outline-none text-black border-gray-300 rounded py-2 px-4 mb-2 w-full"
                />
                <input
                  type="text"
                  placeholder="Comparison"
                  value={comparison}
                  onChange={(e) => setComparison(e.target.value)}
                  className="border outline-none text-black border-gray-300 rounded py-2 px-4 mb-2 w-full"
                />
              </div>
            </div>
  )
}

export default ChestXRay