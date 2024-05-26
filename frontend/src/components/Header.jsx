import { Link } from "react-router-dom";
import { headerNavItems } from "../utils/constants";
import Button from "./ui/button";
import logo from "../assets/logo3.png"
// import { useEffect, useState } from "react";
function Header() {
  // const [showNav,setShowNav] = useState(false)
  // useEffect(()=>{
  //   const scrollHandler = () =>{
  //     if(window.scrollY>30) setShowNav(true)
  //       else setShowNav(false)
  //   }
  //   window.addEventListener("scroll",scrollHandler)
  //   return()=>window.removeEventListener("scroll",scrollHandler)
  // },[])
  return (
    <header className="fixed top-6 flex items-center justify-between w-full px-8">
      <Link to={`/`} className="text-3xl fixed left-5 top-5">
        <div className="w-[65%]">
        <img src={logo} alt=""/>
        </div>
      </Link>
        <div className={`ml-auto space-x-12 z-400 `}
        style={{ transition: "opacity .2s ease-in-out" }}
        >
          {headerNavItems.map((e,index) => (
            <a key={index} href={e.path} className="glass-effect-navbar">
              <span className="font-medium">{e.name}</span>
            </a>
          ))}
        <Link to={`/login`}>
        <Button className={`rounded-full px-6 py-2`}>
          Login
        </Button>
        </Link>
        </div>
    </header>
  )
}

export default Header