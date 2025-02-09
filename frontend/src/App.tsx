import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import "./App.css";
import { Route, Routes } from "react-router";
import DetailsView from "./pages/DetailsView";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details" element={<DetailsView />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};


export default App;