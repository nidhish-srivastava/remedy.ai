import finddoctorsanimation from "../assets/finddoctors.json"
import medicalreportanimation from "../assets/medicalreportanimation.json"
import chatbotanimation from "../assets/chatbotanimation.json"
import diet from "../assets/diet.jpg"
import dodonts from "../assets/dodonts.png"
import exercise from "../assets/exercise.jpg"
import chatbot from "../assets/chatbot.png"

const headerNavItems = [
    {
        path : "#features",
        name : "Features"
    },
    // {
    //     path : "/",
    //     name : "item2"
    // },
    // {
    //     path : "/",
    //     name : "item3"
    // },
]

const authenticatedNavItems = [
  {
    path : "/home",
    name : "Home"
  },
  {
      path : "/doctors",
      name : "Doctors"
  },
    {
        path : "/chat",
        name : "Chat"
    },
    {
      path : "/premium-chat",
      name : "Try Premium"
    }
]

const features = [
  {
    title : "Chatbot",
    description : "Chat with our AI chatbot for instant health-related answers, lifestyle tips, and medical resources. It's like having a 24/7 health expert for personalized support and recommendations.",
    animation : chatbotanimation
  },
  {
    title : "Medical Report",
    description : "Understanding your medical report can be overwhelming. You can ask detailed questions about your health reports and receive clear, concise explanations",
    animation : medicalreportanimation
  },
  {
    title : "Find a doctor",
    description : "Struggling to find the right healthcare professional? Our extensive database and smart search capabilities will guide you to the right medical professional.",
    animation : finddoctorsanimation
  },
  ]

  const homePageFeatures = [
    {
      heading : "Get Medical assistance",
      image : chatbot,
      description : "Interact with our chatbot and get your medical related issues resolved",
      path : "/chat"
    },
    {
      heading : "Diet Plan",
      image : diet,
      description : "Get a customized diet plan tailored to your specific health needs.",
      path : "/diet-plan"
    },
    {
      heading : "Tailored Exercise Routines",
      image : exercise,
      description : "Access exercise routines designed for your health condition.",
      path : "/exercise-routine"
    },
    // {
    //   heading : "Health Do's and Don'ts",
    //   image : dodonts,
    //   description : "Learn what to do and avoid for managing your condition effectively.",
    //   path : "/do-don'ts"
    // },
  ]
  

const APP_NAME = "remedy"

const fallbackDp = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"

// const BASE_URL = `https://remedy-nmithacks.vercel.app/api/v1`
const BASE_URL = `http://localhost:5000/api/v1`

const SINHA_API_URL = "https://7097-36-255-14-6.ngrok-free.app"

const AKASH_API_URL = "https://c3a8-117-205-71-6.ngrok-free.app"


export {headerNavItems,BASE_URL,authenticatedNavItems,APP_NAME,features,fallbackDp,homePageFeatures,SINHA_API_URL,AKASH_API_URL}