import { motion } from "framer-motion";
import Button from "../ui/button";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div>
        <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
         Your Ultimate Health Wellness Destination
        </div>
        <p className=" text-center font-light text-black text-opacity-90 text-base md:text-xl w-4/5  py-4">
          We empower you to take charge of your health with our conversational health-care assistant chatbot, insightful reports, doctor finder, and engaging health chat
        </p>
        <Button className={`px-8 py-3 rounded-full text-lg`}>
          <Link to={`/login`}>
          Get Started
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}

export default Hero