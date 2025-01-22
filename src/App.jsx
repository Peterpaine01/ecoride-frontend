import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";

// Images
//import LogoHD from "../src/assets/logo-EcoRide.svg";

// Pages
import Home from "./pages/Home";
import PublishRide from "./pages/PublishRide";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/publier-trajet" element={<PublishRide />} />
      </Routes>
    </Router>
  );
};

export default App;
