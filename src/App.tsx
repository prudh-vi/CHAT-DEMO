import { Route, Routes } from "react-router-dom"
import { Home } from "./pages/Home"

import Chat from "./pages/Chat"
import { Login } from "./pages/Login"


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login type="login" />} />
        <Route path="/signup" element={<Login type="signup" />} />
        <Route path="/chat" element={<Chat/>} />
      </Routes>
    </div>
  )
}

export default App