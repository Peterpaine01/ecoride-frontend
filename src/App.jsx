import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";

// Images
//import LogoHD from "../src/assets/logo-EcoRide.svg";

// Pages
import Home from "./pages/Home";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
