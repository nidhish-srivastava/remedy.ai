import Lottie from "lottie-react"
import { APP_NAME, features } from "../../utils/constants"
function Features() {
  return (
    <div id="features">
    <h2 className='text-[40px] text-center font-bold mt-12'>
      Why <span className='gradient-text'>{APP_NAME}?</span>
    </h2>
    <div className='flex gap-6 flex-col items-center w-full mt-12'>
      {
        features.map((e,i)=>(
          <div className={`flex w-full ${i%2==0 ? "sm:flex-row-reverse" : "sm:flex-row"} flex-col justify-center sm:gap-48 sm:w-4/5 mx-auto px-6 pb-12`}>
          <div className="w-full sm:w-[30%]">
            <Lottie animationData={e.animation}/>
          </div>
          <div className="space-y-4 w-full sm:w-[40%] py-12">
          <h2 className='font-semibold text-4xl sm:text-4xl'>{e.title}</h2>
          <p className='text-opacity-90 text-black text-[1.1rem] sm:text-lg'>
            {e.description}
          </p>
          </div>
        </div>
        ))
      }
    </div>
  </div>
  )
}

export default Features