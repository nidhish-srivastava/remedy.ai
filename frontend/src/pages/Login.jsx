import { Suspense, useEffect, useState } from "react";
import Authanimation from "../components/ui/authanimation";
import Button from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";
import { BASE_URL } from "../utils/constants";
import { toast } from "react-toastify";

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [sendNamespace, setSendNameSpace] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) {
        if (response.status == 404) {
          toast.error("User does not exist");
        } else if (response.status === 400) {
          toast.error("Invalid Credentials");
        } else {
          toast.error("An error occurred. Please try again.");
        }
        return;
      }
      const data = await response.json();
      toast.success(data.message);
      navigate("/home");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="flex flex-col sm:flex-row items-center justify-center sm:items-start mt-24  gap-12 sm:gap-6">
        <div className="w-[40%] sm:p-0 lg:p-24 lg:pt-0 -z-10">
          <Suspense fallback={``}>
            <Authanimation />
          </Suspense>
        </div>
        <div className="w-[40%] rounded-lg shadow-md md:p-10">
          <h3 className="text-center text-[22px] leading-9 font-bold mb-10">
            Hello! <span className="text-primary "> Welcome</span> Back
          </h3>
          <form className="space-y-6" onSubmit={submitHandler}>
            <div>
              <input
                type="email"
                placeholder="Enter Your Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="input"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Enter Your password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="input"
              />
            </div>

            <div className="">
              <Button
                disabled={loading && true}
                type="submit"
                className={`w-full rounded-lg py-3 px-4`}
              >
                {loading ? (
                  <HashLoader
                    cssOverride={{ padding: ".75rem 0" }}
                    size={25}
                    color="#ffffff"
                  />
                ) : (
                  "Login"
                )}
              </Button>
            </div>
            <p className="text-head text-center cursor-pointer">
              Don&apos;t have an account?
              <Link to="/signup" className="text-primary font-medium ml-1">
                Register
              </Link>
            </p>
          </form>
        </div>
      </main>
    </>
  );
}

export default Login;
