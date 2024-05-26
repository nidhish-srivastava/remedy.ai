import logo from "../../assets/logo3.png";
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import Button from "../ui/button";
import { APP_NAME } from "../../utils/constants";

function Footer() {
  return (
    <footer className="bg-gray-50 py-6 border-t border-gray-100 text-center">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex flex-col gap-8 items-start">
                <div className="w-2/3">
                <img src={logo} alt="Logo" loading="lazy" />
                </div>
                <form className="flex flex-col items-start">
                    <label htmlFor="email" className="text-gray-700 mb-2">Subscribe to our Newsletter</label>
                    <div className="flex">
                        <input 
                            type="email" 
                            id="email" 
                            className="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
                            placeholder="Enter your email"
                        />
                        <Button 
                            type="submit" 
                            className="px-4 py-2 rounded-r-md hover:bg-blue-600"
                        >
                            Subscribe
                        </Button>
                    </div>
                </form>
            </div>
            <div className="flex space-x-6">
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-500">
                    <FaTwitter size={32} />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-700">
                    <FaLinkedin size={32} />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-500">
                    <FaGithub size={32} />
                </a>
            </div>
        </div>
        <div className="text-gray-500 text-sm mt-4">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
    </footer>
  );
}

export default Footer;
