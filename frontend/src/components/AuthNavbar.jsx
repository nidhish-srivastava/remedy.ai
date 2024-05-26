import { toast } from "react-toastify";
import { BASE_URL, authenticatedNavItems, fallbackDp } from "../utils/constants";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import useFetchHook from "../hooks/useFetch.hook";
import logo from "../assets/logo3.png"
import { useAuthContextHook } from "../context";

function AuthNavbar() {
  const navigate = useNavigate();
  const modalRef = useRef();
  const {setUserInfo} = useAuthContextHook()
  const { data, error, loading } = useFetchHook(
    `${BASE_URL}/auth/current-user`
  );
  useEffect(()=>{
    setUserInfo(data)
  },[data])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const logoutHandler = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to logout. Please try again.");
      }
      const data = await response.json();
      toast.success(data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target))
      setIsModalOpen(false);
  };
  useEffect(() => {
    if (isModalOpen) window.addEventListener("mousedown", handleOutsideClick);
    else window.removeEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, [isModalOpen]);
  return (
    <div>
      <Link to={`/home`} className="text-3xl absolute left-5 top-5">
        <div className="w-[65%]">
        <img src={logo} alt=""/>
        </div>
      </Link>
      <nav className="flex items-center gap-12 justify-end px-8 py-4">
        <div
          className="flex gap-6"
          style={{ transition: "opacity .2s ease-in-out" }}
        >
          {authenticatedNavItems.map((e) => (
            <NavLink className="px-4 py-2" to={`${e.path}`} key={e.path}>
              <span className="font-medium">{e.name}</span>
            </NavLink>
          ))}
        </div>
        <div className="relative" ref={modalRef}>
          {
            loading ? 
            <img
            src={fallbackDp}
            alt=""
            loading="lazy"
            className="w-10 h-10 rounded-full cursor-pointer"
          /> : 
          <img
            src={data?.photo}
            alt=""
            loading="lazy"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={toggleModal}
          />
          }
          {isModalOpen && (
            <div className="absolute space-y-4 right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
              <div className="font-semibold px-4 py-2">{data?.name}</div>
              <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                Profile
              </Link>
              <button
                onClick={logoutHandler}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default AuthNavbar;
