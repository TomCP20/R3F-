import { HashRouter, Route, Routes } from "react-router-dom";
import Menger from "./Menger";
import RepeatingSpheres from "./RepeatingSpheres";
import NavBar from "./NavBar";

export default function App() {
  return (
    <HashRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<RepeatingSpheres />} />
          <Route path="/menger" element={<Menger />} />
        </Routes>
    </HashRouter>
  )
}

