import AuthNavbar from "./AuthNavbar"
import ChatHistorySidebar from "./ChatHistorySidebar"

function Wrapper({children}) {
  return (
    <div>
      <AuthNavbar />
      <div className="text-center flex lg:w-full bg-[#282c34] text-white">
      <ChatHistorySidebar/>
        {children}
        </div>
    </div>
  )
}

export default Wrapper