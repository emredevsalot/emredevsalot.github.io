import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/about";
import Homepage from "./pages/homepage";

function App() {
  return (
    <BrowserRouter>
      <div className="noise-bg px-[clamp(1rem,10vw,36rem)]">
        {/* <div>navbar</div> */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
